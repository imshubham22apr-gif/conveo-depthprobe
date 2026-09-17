import React, { useState, useEffect } from 'react';
import { X, Key, Check, Volume2 } from 'lucide-react';
import { ApiConfig } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSaveConfig: (newConfig: ApiConfig) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [deepgramKey, setDeepgramKey] = useState(config.deepgramApiKey || '');
  const [openaiKey, setOpenaiKey] = useState(config.openaiApiKey || '');
  const [model, setModel] = useState(config.model || 'gpt-4o-mini');
  const [autoSpeak, setAutoSpeak] = useState(config.autoSpeak ?? true);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setDeepgramKey(config.deepgramApiKey || '');
    setOpenaiKey(config.openaiApiKey || '');
    setModel(config.model || 'gpt-4o-mini');
    setAutoSpeak(config.autoSpeak ?? true);
  }, [config]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      deepgramApiKey: deepgramKey.trim(),
      openaiApiKey: openaiKey.trim(),
      model,
      autoSpeak,
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-conveo-400" />
            <h2 className="text-base font-bold text-white">API & Audio Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className="bg-conveo-500/10 border border-conveo-500/20 rounded-xl p-3 text-slate-300 leading-relaxed">
            <p className="font-semibold text-conveo-400 mb-0.5">Zero-Config Offline Mode Enabled</p>
            You can use this app immediately without any API keys. Adding keys enables live cloud Deepgram Nova-2 STT & OpenAI GPT-4o inference.
          </div>

          {/* Deepgram API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span>Deepgram API Key (STT)</span>
              <span className="text-[10px] text-slate-400 font-normal">Optional</span>
            </label>
            <input
              type="password"
              value={deepgramKey}
              onChange={(e) => setDeepgramKey(e.target.value)}
              placeholder="Leave blank to use Browser Web Speech API"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-conveo-500 font-mono text-xs"
            />
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span>OpenAI API Key (LLM)</span>
              <span className="text-[10px] text-slate-400 font-normal">Optional</span>
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="Leave blank to use Local Socratic Heuristics"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-conveo-500 font-mono text-xs"
            />
          </div>

          {/* OpenAI Model */}
          {openaiKey && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">OpenAI Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-conveo-500"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Fast & Cost Effective)</option>
                <option value="gpt-4o">gpt-4o (High Reasoning)</option>
              </select>
            </div>
          )}

          {/* Audio TTS toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-conveo-400" />
              <div>
                <p className="font-semibold text-slate-200">AI Researcher Voice (TTS)</p>
                <p className="text-[11px] text-slate-400">Moderator speaks follow-up questions aloud</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="w-4 h-4 accent-conveo-500 rounded cursor-pointer"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-conveo-600 to-sky-500 hover:from-conveo-500 hover:to-sky-400 text-white font-semibold text-xs transition-all shadow-md shadow-conveo-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedMessage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Settings Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
