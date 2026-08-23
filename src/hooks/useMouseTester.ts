'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export type MouseButtonId = 'left' | 'middle' | 'right' | 'back' | 'forward';

export interface ButtonState {
  detected: boolean;
  pressed:  boolean;
}

export interface MouseEvent_ {
  id:        number;
  timestamp: number;
  type:      string;
  detail:    string;
}

export interface MouseStats {
  totalClicks:  number;
  leftClicks:   number;
  middleClicks: number;
  rightClicks:  number;
  movementPx:   number;
  scrollEvents: number;
  lastEvent:    string;
  sessionStart: number;
}

export interface ScrollState {
  up:            number;
  down:          number;
  horizontal:    number;
  lastDirection: 'up' | 'down' | 'left' | 'right' | null;
}

export interface DoubleClickState {
  count:         number;
  lastInterval:  number | null;
  lastTimestamp: number | null;
}

export interface MovementState {
  x:          number;
  y:          number;
  totalPx:    number;
  eventCount: number;
}

export interface MouseTesterState {
  isActive:   boolean;
  toggle:     () => void;
  buttons:    Record<MouseButtonId, ButtonState>;
  stats:      MouseStats;
  events:     MouseEvent_[];
  movement:   MovementState;
  scroll:     ScrollState;
  doubleClick:DoubleClickState;
  reset:      () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buttonIndex(index: number): MouseButtonId | null {
  switch (index) {
    case 0: return 'left';
    case 1: return 'middle';
    case 2: return 'right';
    case 3: return 'back';
    case 4: return 'forward';
    default: return null;
  }
}

const MAX_EVENTS = 100;

const defaultButtons   = (): Record<MouseButtonId, ButtonState> => ({
  left:    { detected: false, pressed: false },
  middle:  { detected: false, pressed: false },
  right:   { detected: false, pressed: false },
  back:    { detected: false, pressed: false },
  forward: { detected: false, pressed: false },
});
const defaultStats     = (): MouseStats => ({
  totalClicks: 0, leftClicks: 0, middleClicks: 0, rightClicks: 0,
  movementPx: 0, scrollEvents: 0, lastEvent: '—', sessionStart: Date.now(),
});
const defaultScroll    = (): ScrollState  => ({ up: 0, down: 0, horizontal: 0, lastDirection: null });
const defaultDoubleClick = (): DoubleClickState => ({ count: 0, lastInterval: null, lastTimestamp: null });
const defaultMovement  = (): MovementState => ({ x: 0, y: 0, totalPx: 0, eventCount: 0 });

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useMouseTester(): MouseTesterState {
  const [isActive,    setIsActive]    = useState(false);
  const [buttons,     setButtons]     = useState(defaultButtons);
  const [stats,       setStats]       = useState(defaultStats);
  const [events,      setEvents]      = useState<MouseEvent_[]>([]);
  const [movement,    setMovement]    = useState(defaultMovement);
  const [scroll,      setScroll]      = useState(defaultScroll);
  const [doubleClick, setDoubleClick] = useState(defaultDoubleClick);

  const eventIdRef       = useRef(0);
  const rafPendingRef    = useRef(false);
  const pendingMoveRef   = useRef<{ dx: number; dy: number; count: number } | null>(null);
  const lastClickTimeRef = useRef<Record<MouseButtonId, number>>({ left: 0, middle: 0, right: 0, back: 0, forward: 0 });
  const doubleClickRef   = useRef<DoubleClickState>(defaultDoubleClick());
  const isActiveRef      = useRef(false); // sync ref for handlers

  const toggle = useCallback(() => {
    setIsActive(prev => {
      const next = !prev;
      isActiveRef.current = next;
      // Release all pressed buttons when deactivating
      if (!next) {
        setButtons(defaultButtons());
      }
      return next;
    });
  }, []);

  const addEvent = useCallback((type: string, detail: string) => {
    const id = ++eventIdRef.current;
    const entry: MouseEvent_ = { id, timestamp: Date.now(), type, detail };
    setEvents(prev => [entry, ...prev].slice(0, MAX_EVENTS));
    setStats(prev => ({ ...prev, lastEvent: detail }));
  }, []);

  // ── mousedown ──────────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!isActiveRef.current) return;
    const btnId = buttonIndex(e.button);
    if (!btnId) return;

    if (btnId === 'left') {
      const now      = Date.now();
      const prev     = lastClickTimeRef.current.left;
      const interval = now - prev;
      lastClickTimeRef.current.left = now;
      if (prev > 0 && interval <= 500) {
        const next: DoubleClickState = { count: doubleClickRef.current.count + 1, lastInterval: interval, lastTimestamp: now };
        doubleClickRef.current = next;
        setDoubleClick({ ...next });
      }
    }

    setButtons(prev => ({ ...prev, [btnId]: { detected: true, pressed: true } }));
    setStats(prev => {
      const next = { ...prev, totalClicks: prev.totalClicks + 1, lastEvent: `${btnId.toUpperCase()} CLICK` };
      if (btnId === 'left')   next.leftClicks   = prev.leftClicks   + 1;
      if (btnId === 'middle') next.middleClicks  = prev.middleClicks + 1;
      if (btnId === 'right')  next.rightClicks   = prev.rightClicks  + 1;
      return next;
    });
    addEvent('DOWN', `${btnId.toUpperCase()} DOWN`);
  }, [addEvent]);

  // ── mouseup ────────────────────────────────────────────────────────────────
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isActiveRef.current) return;
    const btnId = buttonIndex(e.button);
    if (!btnId) return;
    setButtons(prev => ({ ...prev, [btnId]: { ...prev[btnId], pressed: false } }));
    addEvent('UP', `${btnId.toUpperCase()} UP`);
  }, [addEvent]);

  // ── mousemove — throttled via rAF ──────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isActiveRef.current) return;
    const { movementX, movementY } = e;

    if (pendingMoveRef.current) {
      pendingMoveRef.current.dx    += movementX;
      pendingMoveRef.current.dy    += movementY;
      pendingMoveRef.current.count += 1;
    } else {
      pendingMoveRef.current = { dx: movementX, dy: movementY, count: 1 };
    }

    if (!rafPendingRef.current) {
      rafPendingRef.current = true;
      requestAnimationFrame(() => {
        const p = pendingMoveRef.current;
        if (p && isActiveRef.current) {
          const dist = Math.sqrt(p.dx * p.dx + p.dy * p.dy);
          setMovement(prev => ({ x: e.clientX, y: e.clientY, totalPx: prev.totalPx + dist, eventCount: prev.eventCount + p.count }));
          setStats(prev => ({ ...prev, movementPx: prev.movementPx + dist, lastEvent: 'MOVE' }));
          pendingMoveRef.current = null;
        }
        rafPendingRef.current = false;
      });
    }
  }, []);

  // ── wheel — only captured when active, so page scrolls normally otherwise ──
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isActiveRef.current) return;
    e.preventDefault();
    setStats(prev => ({ ...prev, scrollEvents: prev.scrollEvents + 1, lastEvent: 'SCROLL' }));

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      const dir = e.deltaX > 0 ? 'right' : 'left';
      setScroll(prev => ({ ...prev, horizontal: prev.horizontal + 1, lastDirection: dir }));
      addEvent('SCROLL', `SCROLL ${dir.toUpperCase()}`);
    } else {
      const dir = e.deltaY > 0 ? 'down' : 'up';
      setScroll(prev => ({ ...prev, [dir]: prev[dir] + 1, lastDirection: dir }));
      addEvent('SCROLL', `SCROLL ${dir.toUpperCase()}`);
    }
  }, [addEvent]);

  // ── contextmenu — only suppressed when active ──────────────────────────────
  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (!isActiveRef.current) return;
    e.preventDefault();
  }, []);

  // ── Register global listeners always (handlers check isActiveRef internally) ─
  useEffect(() => {
    window.addEventListener('mousedown',   handleMouseDown);
    window.addEventListener('mouseup',     handleMouseUp);
    window.addEventListener('mousemove',   handleMouseMove);
    window.addEventListener('wheel',       handleWheel,       { passive: false });
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('mousedown',   handleMouseDown);
      window.removeEventListener('mouseup',     handleMouseUp);
      window.removeEventListener('mousemove',   handleMouseMove);
      window.removeEventListener('wheel',       handleWheel);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleMouseDown, handleMouseUp, handleMouseMove, handleWheel, handleContextMenu]);

  // ── reset ──────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setButtons(defaultButtons());
    setStats(defaultStats());
    setEvents([]);
    setMovement(defaultMovement());
    setScroll(defaultScroll());
    setDoubleClick(defaultDoubleClick());
    doubleClickRef.current = defaultDoubleClick();
    lastClickTimeRef.current = { left: 0, middle: 0, right: 0, back: 0, forward: 0 };
    pendingMoveRef.current = null;
    eventIdRef.current = 0;
  }, []);

  return { isActive, toggle, buttons, stats, events, movement, scroll, doubleClick, reset };
}
