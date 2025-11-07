
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { QALog, Theme } from '../types';

interface EmployeeLeaderboardProps {
  logs: QALog[];
  theme: Theme;
}

export const EmployeeLeaderboard: React.FC<EmployeeLeaderboardProps> = ({ logs, theme }) => {
  const leaderboardData = useMemo(() => {
    const employeeData: { [key: string]: { name: string; callsAudited: number; violationsCaught: number } } = {};

    logs.forEach(log => {
      const name = log.employeeName;
      if (!employeeData[name]) {
        employeeData[name] = { name, callsAudited: 0, violationsCaught: 0 };
      }
      employeeData[name].callsAudited += log.callsAudited;
      employeeData[name].violationsCaught += log.violationsCaught;
    });

    return Object.values(employeeData)
      .sort((a, b) => b.callsAudited - a.callsAudited)
      .slice(0, 10);
  }, [logs]);

  const tickColor = theme === 'dark' ? '#e2e8f0' : '#64748b'; // slate-200 for dark, slate-500 for light

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={leaderboardData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e0e0e0'} />
          <XAxis type="number" tick={{fontSize: 12, fill: tickColor}} />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={80} 
            tick={{fontSize: 12, fill: tickColor}}
            />
          <Tooltip 
             contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: theme === 'dark' ? '#334155' : '#e0e0e0'
            }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}} />
          <Bar dataKey="callsAudited" name="Calls Audited" fill="#3b82f6" />
          <Bar dataKey="violationsCaught" name="Violations Caught" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
