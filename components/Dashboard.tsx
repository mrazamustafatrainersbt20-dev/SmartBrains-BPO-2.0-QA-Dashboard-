import React, { useMemo, useState } from 'react';
import type { QALog, Filters, Theme, Employee } from '../types';
import { KpiCard } from './KpiCard';
import { DailyTrendChart } from './DailyTrendChart';
import { EmployeeLeaderboard } from './EmployeeLeaderboard';
import { generateQASummary } from '../services/geminiService';
// FIX: Switched to a top-level import for 'format' from 'date-fns' to fix module resolution errors.
import { format } from 'date-fns';

interface DashboardProps {
  filteredLogs: QALog[];
  allLogs: QALog[];
  employees: Employee[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  theme: Theme;
}

const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L14.39 8.36L21 9.27L16.5 13.91L18.18 21L12 17.27L5.82 21L7.5 13.91L3 9.27L9.61 8.36L12 2z"/>
  </svg>
);

export const Dashboard: React.FC<DashboardProps> = ({ filteredLogs, employees, filters, setFilters, theme }) => {
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const kpiData = useMemo(() => {
    const totalCalls = filteredLogs.reduce((sum, log) => sum + log.callsAudited, 0);
    const totalViolations = filteredLogs.reduce((sum, log) => sum + log.violationsCaught, 0);
    const totalSessions = filteredLogs.reduce((sum, log) => sum + log.sessionsConducted, 0);
    const totalWarnings = filteredLogs.reduce((sum, log) => sum + log.warningLettersIssued, 0);
    const violationRate = totalCalls > 0 ? (totalViolations / totalCalls) * 100 : 0;
    
    const entriesWithViolations = filteredLogs.filter(log => log.callsAudited > 0 && log.violationsCaught > 0).length;
    const entriesWithAudits = filteredLogs.filter(log => log.callsAudited > 0).length;
    const violationEntryRate = entriesWithAudits > 0 ? (entriesWithViolations / entriesWithAudits) * 100 : 0;

    return { totalCalls, totalViolations, totalSessions, totalWarnings, violationRate, violationEntryRate };
  }, [filteredLogs]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name.includes('Date') ? new Date(value) : value,
    }));
  };
  
  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    setAiSummary('');
    const summary = await generateQASummary(filteredLogs, filters.employee);
    setAiSummary(summary);
    setIsLoadingSummary(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-brand-dark-200 p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Start Date</label>
            <input type="date" name="startDate" id="startDate" value={format(filters.startDate, 'yyyy-MM-dd')} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-slate-300">End Date</label>
            <input type="date" name="endDate" id="endDate" value={format(filters.endDate, 'yyyy-MM-dd')} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Employee</label>
            <select name="employee" id="employee" value={filters.employee} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-brand-dark-200 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
              <option>All</option>
              {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="Calls Audited" value={kpiData.totalCalls.toLocaleString()} />
        <KpiCard title="Violations Caught" value={kpiData.totalViolations.toLocaleString()} />
        <KpiCard title="Coaching Sessions" value={kpiData.totalSessions.toLocaleString()} />
        <KpiCard title="Warning Letters" value={kpiData.totalWarnings.toLocaleString()} />
        <KpiCard title="Violation Rate" value={`${kpiData.violationRate.toFixed(2)}%`} />
        <KpiCard title="% Audits w/ Violation" value={`${kpiData.violationEntryRate.toFixed(2)}%`} />
      </div>

       <div className="bg-white dark:bg-brand-dark-200 p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-brand-dark dark:text-white">AI Performance Summary</h3>
          <button
            onClick={handleGenerateSummary}
            disabled={isLoadingSummary || filteredLogs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
          >
            <SparkleIcon className="w-5 h-5" />
            {isLoadingSummary ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>
        {isLoadingSummary && <div className="text-center p-8 text-slate-500 dark:text-slate-400">Loading AI summary...</div>}
        {aiSummary && (
          <div className="prose dark:prose-invert max-w-none p-4 bg-slate-50 dark:bg-brand-dark rounded-md border border-slate-200 dark:border-slate-700">
            {aiSummary.split('\n').map((line, i) => {
              if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')) {
                return <p key={i} className="my-1">{line}</p>;
              }
              if(line.trim() === '') return null;
              return <p key={i}>{line}</p>;
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-brand-dark-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-brand-dark dark:text-white mb-4">Daily Trends</h3>
          <DailyTrendChart logs={filteredLogs} theme={theme} />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-brand-dark-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-brand-dark dark:text-white mb-4">Employee Leaderboard</h3>
          <EmployeeLeaderboard logs={filteredLogs} theme={theme} />
        </div>
      </div>
    </div>
  );
};