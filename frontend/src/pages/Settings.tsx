import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Settings as SettingsIcon, User, Key, Bell, Shield, 
  Volume2, Globe, Cpu, Sun, Moon, Database, CheckCircle2
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, backendUrl, setBackendUrl } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [apiKey, setApiKey] = useState('AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxx');
  const [dbPath, setDbPath] = useState('./vector_store/chroma.db');
  const [lang, setLang] = useState('en');
  const [alerts, setAlerts] = useState(true);
  const [voiceAssist, setVoiceAssist] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {savedMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs rounded-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          Settings parameters successfully synchronized.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <h3 className="text-xs font-bold text-slate-200 mb-4 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Operator Profile
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Operator Name</label>
              <input
                type="text"
                disabled
                value={user?.name || 'Administrator'}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-850 rounded-lg text-slate-400 outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Email Coordinates</label>
              <input
                type="text"
                disabled
                value={user?.email || 'admin@indusmind.ai'}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-850 rounded-lg text-slate-400 outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Operational Role Permissions</label>
              <input
                type="text"
                disabled
                value={user?.role || 'Safety Officer'}
                className="w-full px-3 py-2 text-xs bg-indigo-500/10 border border-indigo-550/20 rounded-lg text-indigo-400 font-semibold outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI API Keys Config */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <h3 className="text-xs font-bold text-slate-200 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" /> Gemini API & Vector Indexing Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Google Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-850 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">This key is passed to the FastAPI RAG model service to run inferences.</p>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">ChromaDB / FAISS Database Path</label>
              <div className="relative">
                <input
                  type="text"
                  value={dbPath}
                  onChange={(e) => setDbPath(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-950 border border-slate-850 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <Database className="absolute left-3 top-2 w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        {/* System Settings (Theme, Language, Voice) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <h3 className="text-xs font-bold text-slate-200 mb-4 uppercase tracking-wider flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-indigo-400" /> System Preferences
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Theme selector */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Display Theme</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold ${
                    theme === 'dark' 
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-455' 
                      : 'bg-slate-950 border-slate-850 text-slate-450'
                  }`}
                >
                  <Moon className="w-4 h-4" /> Dark Mode
                </button>
                <button
                  type="button"
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold ${
                    theme === 'light' 
                      ? 'bg-indigo-650/15 border-indigo-550/30 text-indigo-400' 
                      : 'bg-slate-950 border-slate-850 text-slate-455'
                  }`}
                >
                  <Sun className="w-4 h-4" /> Light Mode
                </button>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Interface Language</label>
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-850 rounded-lg text-slate-200 outline-none focus:border-indigo-500 appearance-none font-semibold"
                >
                  <option value="en">English (US)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                </select>
                <Globe className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-850 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5"><Bell className="w-4 h-4 text-indigo-400" /> Real-time Alerts</span>
                <span className="text-[10px] text-slate-500 block">Flag high-severity failure indicators.</span>
              </div>
              <input
                type="checkbox"
                checked={alerts}
                onChange={(e) => setAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </div>

            {/* Voice dictate */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-850 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5"><Volume2 className="w-4 h-4 text-indigo-400" /> Voice Assistance</span>
                <span className="text-[10px] text-slate-500 block">Activate hands-free mic checklist checker.</span>
              </div>
              <input
                type="checkbox"
                checked={voiceAssist}
                onChange={(e) => setVoiceAssist(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-lg shadow-lg shadow-indigo-650/20 transition-all"
          >
            Apply Configurations
          </button>
        </div>
      </form>
    </div>
  );
};
