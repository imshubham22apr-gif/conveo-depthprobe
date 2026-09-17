import React from 'react';
import { Sparkles, Video, Settings, Layers } from 'lucide-react';
import { StudyTopic } from '../types';
import { PRESET_STUDIES } from '../data/presetStudies';

interface HeaderProps {
  currentStudy: StudyTopic;
  onSelectStudy: (study: StudyTopic) => void;
  onOpenSettings: () => void;
  onOpenLoomScript: () => void;
  onSynthesize: () => void;
  sessionActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStudy,
  onSelectStudy,
  onOpenSettings,
  onOpenLoomScript,
  onSynthesize,
  sessionActive,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-conveo-600 via-conveo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-conveo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  Conveo <span className="text-conveo-400 font-semibold">DepthProbe</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-conveo-500/10 border border-conveo-500/30 text-conveo-400 font-mono font-medium">
                  YC S24 PoC
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Socratic Interview Engine with APEX-Guard Invariants
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenLoomScript}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700 hover:bg-slate-700"
            >
              Pitch
            </button>
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Study Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center">
          <div className="relative flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/80 shadow-inner w-full sm:w-auto">
            <Layers className="w-3.5 h-3.5 text-conveo-400 ml-2 mr-1 hidden sm:block" />
            <select
              value={currentStudy.id}
              onChange={(e) => {
                const found = PRESET_STUDIES.find((s) => s.id === e.target.value);
                if (found) onSelectStudy(found);
              }}
              className="bg-transparent text-xs text-slate-200 font-medium pl-1 pr-6 py-1 focus:outline-none cursor-pointer w-full sm:w-auto"
            >
              {PRESET_STUDIES.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                  [{s.badge}] {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={onOpenLoomScript}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-conveo-500/10 border border-conveo-500/30 text-conveo-300 hover:bg-conveo-500/20 transition-colors text-xs font-semibold"
            title="View 60-Second Pitch Script & Conveo Alignment"
          >
            <Video className="w-3.5 h-3.5 text-conveo-400" />
            <span>60s Loom Pitch</span>
          </button>

          {sessionActive && (
            <button
              onClick={onSynthesize}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-conveo-600 to-sky-500 hover:from-conveo-500 hover:to-sky-400 text-white transition-all text-xs font-semibold shadow-md shadow-conveo-600/30 hover:shadow-conveo-500/40 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Synthesize Insights</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors text-xs"
            title="Configure Deepgram / OpenAI Keys"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">API Config</span>
          </button>
        </div>
      </div>
    </header>
  );
};
