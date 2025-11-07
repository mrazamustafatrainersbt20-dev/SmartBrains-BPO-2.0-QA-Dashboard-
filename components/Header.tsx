
import React from 'react';
import type { UserRole, Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  currentUserRole: UserRole;
  setCurrentUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  onExport: () => void;
  onOpenShareModal: () => void;
}

const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const UserPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>
);

export const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  currentUserRole,
  setCurrentUserRole,
  onExport,
  onOpenShareModal,
}) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white dark:bg-brand-dark-200 shadow-sm p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-primary dark:text-white">Smart Brains BPO 2.0 QA Dashboard</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Manager-specific controls */}
        {currentUserRole === 'Manager' && (
            <>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Export as CSV"
                >
                    <DownloadIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Export</span>
                </button>
                <div className="flex items-center gap-2">
                    <label htmlFor="role-select" className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden md:block">View as:</label>
                    <select
                        id="role-select"
                        value={currentUserRole}
                        onChange={e => setCurrentUserRole(e.target.value as UserRole)}
                        className="rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200 text-sm focus:ring-brand-secondary focus:border-brand-secondary"
                    >
                        <option>Manager</option>
                        <option>QA</option>
                        <option>Viewer</option>
                    </select>
                </div>
            </>
        )}
        
        {/* General controls */}
        <div className="flex items-center gap-2 sm:gap-4 border-l border-slate-200 dark:border-slate-700 pl-2 sm:pl-4">
            {currentUserRole === 'Manager' && (
                <button
                    onClick={onOpenShareModal}
                    className="flex items-center gap-2 p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Share"
                >
                    <UserPlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Share</span>
                </button>
            )}
            <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
        </div>
      </div>
    </header>
  );
};
