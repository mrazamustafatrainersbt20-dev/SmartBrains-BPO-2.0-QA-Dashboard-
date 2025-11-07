import React, { useState } from 'react';
import type { QALog, UserRole, Employee } from '../types';
// FIX: Switched to top-level imports for date-fns to resolve module export errors.
import { format, parseISO } from 'date-fns';

interface DataViewProps {
  logs: QALog[];
  employees: Employee[];
  onAddLog: (newLog: Omit<QALog, 'id' | 'timestamp'>) => void;
  currentUserRole: UserRole;
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const initialState: Omit<QALog, 'id' | 'timestamp'> = {
  date: format(new Date(), 'yyyy-MM-dd'),
  employeeName: '',
  tasksPerformed: '',
  callsAudited: 0,
  violationsCaught: 0,
  sessionsConducted: 0,
  warningLettersIssued: 0,
};

export const DataView: React.FC<DataViewProps> = ({ logs, employees, onAddLog, currentUserRole }) => {
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState<Omit<QALog, 'id' | 'timestamp'>>(initialState);
  const isQA = currentUserRole === 'QA';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewLog(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLog.employeeName) {
      const logToSubmit = { ...newLog, date: format(new Date(), 'yyyy-MM-dd') };
      onAddLog(logToSubmit);
      setNewLog(initialState);
      setShowForm(false);
    } else {
      alert("Please select an employee.");
    }
  };

  return (
    <div className="bg-white dark:bg-brand-dark-200 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-brand-dark dark:text-white">QA Log Data</h2>
        {isQA && (
            <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
            <PlusIcon className="w-5 h-5"/>
            {showForm ? 'Cancel' : 'Add New Entry'}
            </button>
        )}
      </div>

      {isQA && showForm && (
        <form onSubmit={handleSubmit} className="p-4 mb-6 border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-brand-dark grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Date</label>
            <input type="date" name="date" value={newLog.date} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-slate-200 dark:bg-slate-600" required disabled />
          </div>
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Employee</label>
            <select name="employeeName" value={newLog.employeeName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200" required>
              <option value="" disabled>Select Employee</option>
              {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
          <div className="col-span-1 md:col-span-2">
             <label htmlFor="tasksPerformed" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Tasks Performed</label>
             <textarea name="tasksPerformed" value={newLog.tasksPerformed} onChange={handleInputChange} rows={1} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200"></textarea>
          </div>
          <div>
             <label htmlFor="callsAudited" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Calls Audited</label>
             <input type="number" name="callsAudited" value={newLog.callsAudited} onChange={handleInputChange} min="0" className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200"/>
          </div>
          <div>
             <label htmlFor="violationsCaught" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Violations Caught</label>
             <input type="number" name="violationsCaught" value={newLog.violationsCaught} onChange={handleInputChange} min="0" className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200"/>
          </div>
          <div>
             <label htmlFor="sessionsConducted" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Sessions Conducted</label>
             <input type="number" name="sessionsConducted" value={newLog.sessionsConducted} onChange={handleInputChange} min="0" className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200"/>
          </div>
          <div>
             <label htmlFor="warningLettersIssued" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Warnings Issued</label>
             <input type="number" name="warningLettersIssued" value={newLog.warningLettersIssued} onChange={handleInputChange} min="0" className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200"/>
          </div>
          <div className="col-span-full flex justify-end">
            <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary transition-colors">Save Entry</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tasks Performed</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Calls Audited</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Violations</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sessions</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warnings</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-brand-dark-200 divide-y divide-gray-200 dark:divide-slate-700">
              {[...logs].reverse().map(log => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{format(parseISO(log.date), 'MM/dd/yyyy')}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{log.employeeName}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-slate-300 max-w-sm truncate" title={log.tasksPerformed}>{log.tasksPerformed}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 text-center">{log.callsAudited}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 text-center">{log.violationsCaught}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 text-center">{log.sessionsConducted}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 text-center">{log.warningLettersIssued}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};