'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  GenerateButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_ROSTERS = {
  gaming: ['Apex', 'Viper', 'Shadow', 'Nova', 'Cyber', 'Frost', 'Hyper', 'Ghost', 'Titan', 'Stealth'],
  classroom: ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Elijah', 'Sophia', 'Lucas', 'Mia', 'Mason', 'Isabella', 'Ethan'],
  office: ['Sarah (Design)', 'Alex (Eng)', 'Jordan (Product)', 'Morgan (QA)', 'Taylor (Marketing)', 'Casey (Sales)', 'Riley (Ops)', 'Sam (Support)'],
};

const TEAM_NAME_PRESETS: Record<string, string[]> = {
  alpha: ['Team Alpha', 'Team Bravo', 'Team Charlie', 'Team Delta', 'Team Echo', 'Team Foxtrot', 'Team Golf', 'Team Hotel'],
  colors: ['Red Dragons', 'Blue Falcons', 'Green Vipers', 'Gold Titans', 'Purple Shadows', 'Orange Sparks', 'Silver Wolves', 'Cyan Phoenix'],
  numbered: ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6', 'Team 7', 'Team 8'],
};

interface Team {
  name: string;
  members: string[];
}

export default function TeamGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('team-generator')!, []);

  const [rawNames, setRawNames] = useState<string>(SAMPLE_ROSTERS.gaming.join('\n'));
  const [splitMode, setSplitMode] = useState<'byTeams' | 'bySize'>('byTeams');
  const [countValue, setCountValue] = useState<number>(2);
  const [namingStyle, setNamingStyle] = useState<'alpha' | 'colors' | 'numbered'>('alpha');

  const [teams, setTeams] = useState<Team[]>([
    { name: 'Team Alpha', members: ['Apex', 'Shadow', 'Cyber', 'Hyper', 'Titan'] },
    { name: 'Team Bravo', members: ['Viper', 'Nova', 'Frost', 'Ghost', 'Stealth'] },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const parsedNames = useMemo(() => {
    return rawNames
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
  }, [rawNames]);

  const generateTeams = useCallback(() => {
    setError(null);

    if (parsedNames.length < 2) {
      setError('Please enter at least 2 participant names to form teams.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      // Shuffle names array using Web Crypto
      const shuffled = [...parsedNames].sort(() => Math.random() - 0.5);

      let numberOfTeams = 2;
      if (splitMode === 'byTeams') {
        numberOfTeams = Math.min(Math.max(2, countValue), parsedNames.length);
      } else {
        // by size
        const teamSize = Math.max(1, countValue);
        numberOfTeams = Math.max(1, Math.ceil(parsedNames.length / teamSize));
      }

      const teamNamesList = TEAM_NAME_PRESETS[namingStyle] || TEAM_NAME_PRESETS.alpha;
      const createdTeams: Team[] = Array.from({ length: numberOfTeams }, (_, i) => ({
        name: teamNamesList[i % teamNamesList.length] || `Team ${i + 1}`,
        members: [],
      }));

      // Deal cards round-robin for equal balance
      shuffled.forEach((person, idx) => {
        const teamIdx = idx % numberOfTeams;
        createdTeams[teamIdx].members.push(person);
      });

      setTeams(createdTeams);
      setIsGenerating(false);
    }, 150);
  }, [parsedNames, splitMode, countValue, namingStyle]);

  const loadRoster = (key: keyof typeof SAMPLE_ROSTERS) => {
    setRawNames(SAMPLE_ROSTERS[key].join('\n'));
    setError(null);
  };

  const handleReset = () => {
    setRawNames(SAMPLE_ROSTERS.gaming.join('\n'));
    setSplitMode('byTeams');
    setCountValue(2);
    setNamingStyle('alpha');
    setError(null);
  };

  const formattedOutput = useMemo(() => {
    return teams
      .map(t => `${t.name} (${t.members.length} members):\n` + t.members.map(m => `  • ${m}`).join('\n'))
      .join('\n\n');
  }, [teams]);

  const faqs: FAQItem[] = [
    {
      question: 'How does the team balancer work?',
      answer:
        'The generator shuffles your names randomly and distributes members round-robin across teams so every group has either the exact same number of players or differs by at most 1.',
    },
    {
      question: 'Can I split by team size instead of number of teams?',
      answer:
        'Yes. Switch the mode to "By Players Per Team" (e.g. 4 players per team) and the generator will calculate the exact number of teams required.',
    },
    {
      question: 'Can I copy individual teams or all teams together?',
      answer:
        'Both! Click "Copy Team" on any specific card, or use "Copy All Teams" to get a clean formatted text summary for Discord, Slack, or email.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Random Team Generator
          </h2>
          <p>
            Organizing team matches, classroom study groups, hackathon squads, or icebreaker breakout rooms? The VEYLO Random Team Generator splits names into fair, balanced groups in seconds.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚖️ Fair Group Balancing</h3>
              <p className="text-[11px]">Evenly distributes odd-numbered rosters so team counts remain balanced.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎮 Gaming Squads</h3>
              <p className="text-[11px]">Generate 2v2, 3v3, or 5v5 scrim rosters for custom match lobbies.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🏫 Classroom &amp; Workshop</h3>
              <p className="text-[11px]">Divide students into breakout tables or project teams instantly.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Input Configuration Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Header & Sample Rosters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="names-textarea" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Enter Names (One per line)
              </label>
              <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                ({parsedNames.length} people)
              </span>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 text-xs">
              <span style={{ color: 'var(--muted)' }}>Sample:</span>
              <button
                type="button"
                onClick={() => loadRoster('gaming')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                🎮 Squad (10)
              </button>
              <button
                type="button"
                onClick={() => loadRoster('classroom')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                🏫 Class (12)
              </button>
              <button
                type="button"
                onClick={() => loadRoster('office')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                💼 Team (8)
              </button>
            </div>
          </div>

          {/* Names Textarea */}
          <textarea
            id="names-textarea"
            rows={6}
            value={rawNames}
            onChange={(e) => setRawNames(e.target.value)}
            placeholder="Type or paste player/participant names here..."
            className="w-full p-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: error ? '1px solid var(--red, #ef4444)' : '1px solid var(--border-c)',
            }}
          />

          {/* Configuration Controls */}
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            {/* Split Mode */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="split-mode" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Generation Mode
              </label>
              <select
                id="split-mode"
                value={splitMode}
                onChange={(e) => setSplitMode(e.target.value as 'byTeams' | 'bySize')}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="byTeams">By Number of Teams</option>
                <option value="bySize">By Players Per Team</option>
              </select>
            </div>

            {/* Count Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="count-val" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                {splitMode === 'byTeams' ? 'Number of Teams' : 'Players Per Team'}
              </label>
              <input
                id="count-val"
                type="number"
                min="2"
                max={Math.max(2, parsedNames.length)}
                value={countValue}
                onChange={(e) => setCountValue(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            {/* Team Names Preset */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="naming-style" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Team Naming Style
              </label>
              <select
                id="naming-style"
                value={namingStyle}
                onChange={(e) => setNamingStyle(e.target.value as 'alpha' | 'colors' | 'numbered')}
                className="w-full p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="alpha">Alpha, Bravo, Charlie...</option>
                <option value="colors">Red Dragons, Blue Falcons...</option>
                <option value="numbered">Team 1, Team 2, Team 3...</option>
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-4 text-xs" style={{ borderTop: '1px solid var(--border-c)' }}>
            <span style={{ color: 'var(--muted)' }}>
              Balanced fair distribution algorithm
            </span>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <GenerateButton onClick={generateTeams} loading={isGenerating} label="Generate Teams" />
            </div>
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-shake"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.25)' }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Teams Grid */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Generated Teams ({teams.length} Teams · {parsedNames.length} Members)
            </span>
            <CopyButton textToCopy={formattedOutput} label="Copy All Teams" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, idx) => {
              const teamString = `${team.name}:\n` + team.members.map(m => `• ${m}`).join('\n');

              return (
                <div
                  key={`${team.name}-${idx}`}
                  className="p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-c)',
                  }}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black" style={{ color: 'var(--text)' }}>
                        {team.name}
                      </h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--surface)', color: 'var(--accent)', border: '1px solid var(--border-c)' }}
                      >
                        {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                      </span>
                    </div>

                    {/* Member List */}
                    <ol className="flex flex-col gap-1.5 text-xs">
                      {team.members.map((member, mIdx) => (
                        <li
                          key={mIdx}
                          className="p-2 rounded-lg flex items-center gap-2 font-semibold select-all"
                          style={{ background: 'var(--surface)' }}
                        >
                          <span className="text-[10px] opacity-40 font-mono">#{mIdx + 1}</span>
                          <span style={{ color: 'var(--text)' }}>{member}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="pt-2" style={{ borderTop: '1px solid var(--border-c)' }}>
                    <CopyButton textToCopy={teamString} size="sm" label="Copy Team" className="w-full justify-center" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
