import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AccountStatusBar } from '../common/AccountStatusBar';
import { AuroraBackground } from '../common/AuroraBackground';
import { Menu, Shield } from 'lucide-react';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuroraBackground className="flex min-h-screen">
      {/* Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        
        {/* Mobile Top Navigation */}
        <header className="lg:hidden h-16 bg-[#fbfcfd]/95 backdrop-blur-xl border-b border-slate-200/90 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-bold font-mono text-slate-900 text-sm tracking-wider">
                TRADE<span className="text-aurora">VAULT</span>
              </span>
            </div>
          </div>
        </header>

        {/* Persistent Account Status Bar */}
        <div className="sticky top-0 lg:top-0 z-20">
          <AccountStatusBar />
        </div>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </AuroraBackground>
  );
};

export default AppLayout;
