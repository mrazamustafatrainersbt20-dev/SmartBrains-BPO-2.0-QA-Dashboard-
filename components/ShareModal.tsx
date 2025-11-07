
import React, { useState } from 'react';
import type { SharedUser, UserRole } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: SharedUser[];
  onAddUser: (user: SharedUser) => void;
  onRemoveUser: (email: string) => void;
}

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);


export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, users, onAddUser, onRemoveUser }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Viewer');

  if (!isOpen) return null;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onAddUser({ email, role });
      setEmail('');
      setRole('Viewer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-brand-dark-200 rounded-lg shadow-xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Share Dashboard</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleAddUser} className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Add people and groups</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-grow block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm"
              required
            />
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm"
            >
              <option>Viewer</option>
              <option>QA</option>
              <option>Manager</option>
            </select>
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-secondary transition-colors">
            Add User
          </button>
        </form>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-3">People with access</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.map(user => (
              <div key={user.email} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{user.email}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user.role}</p>
                </div>
                <button onClick={() => onRemoveUser(user.email)} className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
