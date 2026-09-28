import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChallenge } from '../../context/ChallengeContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  ScrollText,
  Layers,
  LogOut,
  X,
  Shield,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { currentChallenge } = useChallenge();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Trades', path: '/trades', icon: ArrowLeftRight },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'Rules', path: '/rules', icon: ScrollText },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - Sophisticated Deep Dark Navy */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0b1736] text-slate-100 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/60">
            <NavLink
              to="/dashboard"
              onClick={handleNavClick}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 p-[1px] shadow-[0_0_15px_rgba(37,99,235,0.35)]">
                <div className="w-full h-full bg-[#0b1736] rounded-[11px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white font-mono">
                  TRADE<span className="text-blue-400">VAULT</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-semibold">
                  Prop Terminal
                </span>
              </div>
            </NavLink>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Challenge Quick Switcher Card */}
          <div className="p-4">
            <NavLink
              to="/challenges"
              onClick={handleNavClick}
              className="block p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-750 hover:border-blue-500/40 transition-all duration-200 group shadow-sm"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  Simulated Account
                </span>
                <span className="text-[10px] text-blue-400 group-hover:underline">Switch</span>
              </div>
              <div className="text-sm font-bold font-mono text-white flex items-center justify-between">
                <span>
                  {currentChallenge?.accountSize
                    ? `${formatCurrency(currentChallenge.accountSize, 0)} Tier`
                    : 'Select Account'}
                </span>
                {currentChallenge?.currentStep && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#060d1f] border border-slate-700 text-slate-300 font-mono">
                    Step {currentChallenge.currentStep}
                  </span>
                )}
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            <div className="pt-2">
              <NavLink
                to="/challenges"
                onClick={handleNavClick}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/challenges'
                    ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-5 h-5 text-slate-400" />
                <span>All Challenges</span>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs uppercase flex-shrink-0">
                {user?.email ? user.email.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.email}</p>
                <p className="text-[10px] text-emerald-400 font-mono">Trader ID Verified</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

