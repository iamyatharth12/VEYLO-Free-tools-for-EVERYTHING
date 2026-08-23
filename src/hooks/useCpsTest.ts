'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type CpsDuration = 1 | 5 | 10;
export type CpsPhase = 'idle' | 'countdown' | 'active' | 'done';

export interface CpsState {
  phase:       CpsPhase;
  duration:    CpsDuration;
  timeLeft:    number;
  clicks:      number;
  cps:         number;
  start:       (dur: CpsDuration) => void;
  registerClick: () => void;
  reset:       () => void;
}

export function useCpsTest(): CpsState {
  const [phase,    setPhase]    = useState<CpsPhase>('idle');
  const [duration, setDuration] = useState<CpsDuration>(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [clicks,   setClicks]   = useState(0);
  const [cps,      setCps]      = useState(0);

  const clicksRef    = useRef(0);
  const startTimeRef = useRef(0);
  const durRef       = useRef<CpsDuration>(5);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef     = useRef<CpsPhase>('idle');

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback((dur: CpsDuration) => {
    clearTimer();
    setDuration(dur);
    durRef.current = dur;
    setPhase('countdown');
    phaseRef.current = 'countdown';
    setTimeLeft(3);
    setClicks(0);
    clicksRef.current = 0;
    setCps(0);

    let countdown = 3;
    intervalRef.current = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        clearTimer();
        setPhase('active');
        phaseRef.current = 'active';
        setTimeLeft(dur);
        startTimeRef.current = Date.now();

        let remaining = dur;
        intervalRef.current = setInterval(() => {
          remaining -= 1;
          setTimeLeft(remaining);
          if (remaining <= 0) {
            clearTimer();
            setPhase('done');
            phaseRef.current = 'done';
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const finalCps = elapsed > 0 ? clicksRef.current / elapsed : 0;
            setCps(Math.round(finalCps * 10) / 10);
          }
        }, 1000);
      } else {
        setTimeLeft(countdown);
      }
    }, 1000);
  }, []);

  const registerClick = useCallback(() => {
    if (phaseRef.current !== 'active') return;
    clicksRef.current += 1;
    setClicks(clicksRef.current);
    // Live CPS
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    if (elapsed > 0) setCps(Math.round((clicksRef.current / elapsed) * 10) / 10);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setPhase('idle');
    phaseRef.current = 'idle';
    setTimeLeft(0);
    setClicks(0);
    clicksRef.current = 0;
    setCps(0);
  }, []);

  useEffect(() => () => clearTimer(), []);

  return { phase, duration, timeLeft, clicks, cps, start, registerClick, reset };
}
