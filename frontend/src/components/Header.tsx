import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, Sun, Moon, Search, Wifi, WifiOff, Settings, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onOpenSearch: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  onOpenSearch,
  title 
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isBackendConnected, backendUrl, setBackendUrl, checkBackendConnection } = useAuth();
  const [showBackendModal, setShowBackendModal] = useState(false);
  const [tempUrl, setTempUrl] = useState(backendUrl);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'Boiler B202 Critical Risk', desc: 'Overpressure valve inspection is overdue.', time: '10m ago', unread: true },
    { id: '2', title: 'New SOP Processed', desc: 'SOP-Pump-P101-Maint.pdf successfully ingested.', time: '1h ago', unread: true },
    { id: '3', title: 'Near Miss Incident Resolved', desc: 'LOTO safety checklist retraining completed.', time: '1d ago', unread: false },
  ];

  const handleSaveBackendUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendUrl(tempUrl);
    setShowBackendModal(false);
    setTimeout(() => {
      checkBackendConnection();
    }, 500);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b bg-slate-900/80 dark:bg-slate-950/80 border-slate-200/10 dark:border-slate-800/80 backdrop-blur-md">
      {/* Sidebar toggle for mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg lg:hidden text-slate-400 hover:bg-slate-800"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4">
        {/* Ctrl+K Search Bar */}
        <button 
          onClick={onOpenSearch}
          className="hidden md:flex items-center justify-between w-64 px-3 py-1.5 text-xs text-slate-400 bg-slate-800/50 border border-slate-700/60 rounded-lg hover:border-indigo-500/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            Search Everywhere...
          </span>
          <span className="px-1 py-0.5 rounded bg-slate-700 font-mono text-[9px]">Ctrl K</span>
        </button>

        {/* Backend Connection Indicator */}
        <button
          onClick={() => {
            setTempUrl(backendUrl);
            setShowBackendModal(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isBackendConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}
          title="Click to configure backend host"
        >
          {isBackendConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Active Server</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulated Offline</span>
            </>
          )}
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 dark:text-slate-300 hover:bg-slate-200/40 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-indigo-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 dark:text-slate-300 hover:bg-slate-200/40 dark:hover:bg-slate-800/60 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2.5 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 text-slate-300 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                  <span className="font-semibold text-sm">Notifications</span>
                  <span className="text-[10px] bg-indigo-600/35 text-indigo-400 font-semibold px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="divide-y divide-slate-800/65 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-800/40 transition-colors flex gap-2.5">
                      <div className="mt-0.5 flex-shrink-0">
                        {n.title.includes('Critical') ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Bell className="w-4 h-4 text-indigo-400" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-xs text-slate-100 truncate">{n.title}</span>
                          <span className="text-[9px] text-slate-500 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backend Settings Modal */}
      {showBackendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Configure Backend Endpoint</h3>
            <p className="text-xs text-slate-400 mb-4">
              IndusMind AI attempts to route operations (JWT authentication, real document chunking, live Gemini queries) to your FastAPI server. Set the correct URL below.
            </p>
            <form onSubmit={handleSaveBackendUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">FastAPI Server URL</label>
                <input
                  type="url"
                  required
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBackendModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                >
                  Apply Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
