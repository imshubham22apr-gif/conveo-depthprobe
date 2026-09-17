import React, { useState } from 'react';
import { X, Copy, Check, Video, Award } from 'lucide-react';

interface LoomScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoomScriptModal: React.FC<LoomScriptModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const pitchScript = `Hi Meredith and the Conveo team!

When I read your engineering role, two lines resonated deeply: "default to building, not theorizing" and your core truth that "over 70% of qualitative insights come from AI-driven follow-up probing questions."

Rather than submitting a generic resume, I spent the last 36 hours building this targeted Proof of Concept: the Conveo DepthProbe Engine.

Here is how it works:
1. When a consumer gives a flat, superficial answer like "the export was slow"—which is where traditional surveys fail—our Information Density Heuristic immediately penalizes the brevity and detects the missing causality.
2. Instead of moving on, the engine triggers an adaptive Socratic follow-up probe: asking for the exact screen, the latency duration, and whether they had to resort to an offline workaround like Excel.
3. Once the density reaches 80%+, the state machine smoothly advances to the next hypothesis.
4. We also implemented Research Scope Guardrails: if the interviewee attempts prompt injection or derails into off-topic tangents, it gracefully re-anchors to the research goal without breaking persona.
5. At the end, it deterministically synthesizes the transcript into an executive report with friction severity, root causes, and verbatim quotes.

It's built on your exact stack: TypeScript, React, Tailwind, Deepgram Nova-2 speech streaming, and Socratic LLM orchestration.

I'm ready to ship real features from day one at Conveo. Let's build together!`;

  const coverNote = `Hi Conveo Team,

I am applying for the Engineering Internship at Conveo (Antwerp).

Rather than just theorizing about market research, I built a live Proof of Concept tailored to Conveo's core thesis ("70% of insights come from AI follow-up probing"):

Live Demo / Repo: Conveo DepthProbe Engine
• Problem Solved: Traditional surveys stop at 1-line answers ("The UI was slow"). DepthProbe uses a multi-dimensional Information Density Heuristic (Specificity, Causality, Emotion, Actionability) to trigger targeted Socratic follow-up probes.
• Research Scope Guard: Defends against prompt injection and conversation derailment while preserving interviewer persona.
• Stack Alignment: TypeScript, React, Tailwind, Deepgram Nova-2 STT streaming, and deterministic qualitative synthesis.

Check out the working prototype and code. I'd love to discuss how I can contribute to Conveo's fast-moving team!

Best regards,
Aashish`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-conveo-500/20 text-conveo-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Conveo Application Toolkit</h2>
              <p className="text-xs text-slate-400">60-Second Loom Pitch Script & Alignment Note</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          {/* Section 1: Loom Pitch Script */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Video className="w-3.5 h-3.5 text-conveo-400" />
                60-Second Video Demo Pitch (Word-for-Word)
              </span>
              <button
                onClick={() => handleCopy(pitchScript, 'pitch')}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-conveo-300 border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'pitch' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
              {pitchScript}
            </div>
          </div>

          {/* Section 2: Application Cover Note */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                WorkAtAStartup / Email Application Note
              </span>
              <button
                onClick={() => handleCopy(coverNote, 'cover')}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'cover' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Note</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
              {coverNote}
            </div>
          </div>

          {/* Section 3: Alignment Checklist */}
          <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Conveo JD Criteria Met
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>"Default to building, not theorizing"</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Deepgram Nova-2 Speech Streaming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>"70% of insights from follow-up probes"</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Prompt Injection & Scope Filter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>TypeScript / React / Tailwind</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Deterministic Schema Extraction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
