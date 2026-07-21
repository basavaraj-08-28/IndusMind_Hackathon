import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  FileText, 
  GitFork, 
  MessageSquareCode, 
  Wrench, 
  ShieldCheck, 
  Skull, 
  BarChart3, 
  Download, 
  Settings, 
  LogOut,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Document Intelligence', path: '/documents', icon: FileText },
    { name: 'Knowledge Graph', path: '/graph', icon: GitFork },
    { name: 'Industrial AI Chat', path: '/chat', icon: MessageSquareCode },
    { name: 'Maintenance Intelligence', path: '/maintenance', icon: Wrench },
    { name: 'Compliance Center', path: '/compliance', icon: ShieldCheck },
    { name: 'Incident Intelligence', path: '/incidents', icon: ShieldAlert },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: Download },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-between`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-bold text-lg shadow-md shadow-indigo-500/20">
            IM
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-wide uppercase">IndusMind AI</h1>
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Knowledge Engine</span>
          </div>
        </div>

        {/* Nav List */}
        <nav className="px-4 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500 shadow-sm shadow-indigo-600/5'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Session profile info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-slate-300 uppercase flex-shrink-0">
              {user?.name ? user.name.slice(0, 2) : 'US'}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'Operator'}</h2>
              <p className="text-xs text-indigo-400/90 truncate font-mono">{user?.role || 'Guest Mode'}</p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out Session</span>
        </button>
      </div>
    </aside>
  );
};
