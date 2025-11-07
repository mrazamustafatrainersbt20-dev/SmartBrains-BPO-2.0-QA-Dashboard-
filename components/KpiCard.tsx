
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-brand-dark-200 p-4 rounded-lg shadow-sm text-center border border-slate-200 dark:border-slate-700">
      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</h4>
      <p className="text-3xl font-bold text-brand-primary dark:text-brand-secondary mt-1">{value}</p>
    </div>
  );
};