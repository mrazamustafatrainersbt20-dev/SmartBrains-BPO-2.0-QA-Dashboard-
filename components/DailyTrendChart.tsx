import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Switched to top-level imports for date-fns to resolve module export errors.
import { format, parseISO } from 'date-fns';
import type { QALog, Theme } from '../types';

interface DailyTrendChartProps {
  logs: QALog[];
  theme: Theme;
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({ logs, theme }) => {
  const chartData = useMemo(() => {
    const dailyData: { [key: string]: { date: string; callsAudited: number; violationsCaught: number } } = {};

    logs.forEach(log => {
      const dateStr = format(parseISO(log.date), 'yyyy-MM-dd');
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { date: dateStr, callsAudited: 0, violationsCaught: 0 };
      }
      dailyData[dateStr].callsAudited += log.callsAudited;
      dailyData[dateStr].violationsCaught += log.violationsCaught;
    });

    return Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  const tickColor = theme === 'dark' ? '#e2e8f0' : '#64748b'; // slate-200 for dark, slate-500 for light

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e0e0e0'} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(str) => format(parseISO(str), 'MMM d')}
            angle={-20}
            textAnchor="end"
            height={50}
            tick={{fontSize: 12, fill: tickColor}}
          />
          <YAxis yAxisId="left" stroke="#3b82f6" tick={{fontSize: 12, fill: tickColor}} />
          <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{fontSize: 12, fill: tickColor}} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: theme === 'dark' ? '#334155' : '#e0e0e0'
            }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}} />
          <Line yAxisId="left" type="monotone" dataKey="callsAudited" name="Calls Audited" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line yAxisId="right" type="monotone" dataKey="violationsCaught" name="Violations Caught" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};