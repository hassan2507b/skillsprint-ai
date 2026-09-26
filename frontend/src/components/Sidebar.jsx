import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Files,
  Users,
  Briefcase,
  Grid3X3,
  Sparkles,
  ShieldCheck,
  GitCompare,
  Inbox,
  CheckCircle,
  RefreshCw,
  BarChart3,
  FileCode2,
  History,
  Settings as SettingsIcon,
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const isEmployee = currentUser?.role === 'employee';

  const adminLinks = [
    { to: '/', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/documents', label: 'Company Documents', icon: Files },
    { to: '/roles', label: 'Role Management', icon: Briefcase },
    { to: '/matrix', label: 'Role Requirement Matrix', icon: Grid3X3 },
    { to: '/employees', label: 'Employees Directory', icon: Users },
    { to: '/generate', label: 'Generate Onboarding', icon: Sparkles, highlight: true },
    { to: '/validation', label: 'Python Validation', icon: ShieldCheck },
    { to: '/comparison', label: 'Comparison Engine', icon: GitCompare },
    { to: '/reviews', label: 'Human Review Queue', icon: Inbox },
    { to: '/approved-plans', label: 'Approved Plans', icon: CheckCircle },
    { to: '/policy-updates', label: 'Policy Updates & Impact', icon: RefreshCw },
    { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/prompts', label: 'Prompt Templates', icon: FileCode2 },
    { to: '/audit', label: 'Audit Trail', icon: History },
    { to: '/settings', label: 'System Settings', icon: SettingsIcon },
  ];

  const employeeLinks = [
    { to: '/employee', label: 'My Onboarding Journey', icon: GraduationCap, highlight: true },
    { to: '/documents', label: 'Reference Policies', icon: Files },
    { to: '/reports', label: 'My Progress Report', icon: BarChart3 },
  ];

  const links = isEmployee ? employeeLinks : adminLinks;

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 p-4 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : link.highlight
                    ? 'text-indigo-400 hover:bg-indigo-950/40 hover:text-indigo-300'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* System Status Pill */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-medium">Dual-Pipeline Active</span>
          </div>
          <span className="text-slate-500">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
