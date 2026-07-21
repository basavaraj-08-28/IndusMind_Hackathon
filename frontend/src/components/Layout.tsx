import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';

export const Layout: React.FC = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login page (unless it is the root landing page)
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/verify-email';
  if (!user && !isPublicPage) {
    return <Navigate to="/" replace />;
  }

  // Find current header title
  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Plant Executive Dashboard';
    if (path.startsWith('/documents')) return 'Document Ingestion & Extract';
    if (path.startsWith('/graph')) return 'Industrial Relation Graph';
    if (path.startsWith('/chat')) return 'Industrial AI Chat Interface';
    if (path.startsWith('/maintenance')) return 'Predictive Maintenance Analytics';
    if (path.startsWith('/compliance')) return 'Statutory Compliance Center';
    if (path.startsWith('/incidents')) return 'Safety Incident Investigator';
    if (path.startsWith('/analytics')) return 'Plant Analytics Engine';
    if (path.startsWith('/reports')) return 'Regulatory Audit Reports';
    if (path.startsWith('/settings')) return 'Enterprise System Settings';
    return 'Industrial Operations Panel';
  };

  // If public auth page, render without Sidebar / Header
  if (isPublicPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Panel Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          onOpenSearch={() => setSearchOpen(true)}
          title={getPageTitle(location.pathname)}
        />
        
        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-950">
          <Outlet />
        </main>
      </div>

      {/* Global Cmd+K Search Overlay */}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
