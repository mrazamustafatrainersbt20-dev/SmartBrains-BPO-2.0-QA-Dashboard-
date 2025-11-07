import type { QALog, Employee } from './types';
// FIX: Switched to a top-level import for 'format' from 'date-fns' to fix module resolution errors.
import { format } from 'date-fns';

export const mockRoles: string[] = ['QA Specialist', 'Senior QA', 'Team Lead'];
export const mockCampaigns: string[] = ['Project Alpha', 'Project Beta', 'Project Gamma'];

export const mockEmployees: Employee[] = [
  { id: 1, name: 'Alice Johnson', role: 'Senior QA', campaign: 'Project Alpha' },
  { id: 2, name: 'Bob Williams', role: 'QA Specialist', campaign: 'Project Beta' },
  { id: 3, name: 'Charlie Brown', role: 'QA Specialist', campaign: 'Project Alpha' },
  { id: 4, name: 'Diana Miller', role: 'Team Lead', campaign: 'Project Gamma' },
  { id: 5, name: 'Ethan Davis', role: 'QA Specialist', campaign: 'Project Beta' },
];


const today = new Date();
const generateRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return format(date, 'yyyy-MM-dd');
};

const getRandomEmployee = (): string => mockEmployees[Math.floor(Math.random() * mockEmployees.length)].name;
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const mockLogs: QALog[] = Array.from({ length: 150 }, (_, i) => {
  const callsAudited = getRandomInt(10, 30);
  const violationsCaught = Math.random() > 0.7 ? getRandomInt(1, 5) : 0;
  const entryDate = generateRandomDate(new Date(today.getFullYear(), today.getMonth() - 2, 1), today)
  return {
    id: i + 1,
    date: entryDate,
    employeeName: getRandomEmployee(),
    tasksPerformed: 'Standard call auditing and feedback session.',
    callsAudited,
    violationsCaught,
    sessionsConducted: getRandomInt(1, 4),
    warningLettersIssued: violationsCaught > 3 ? 1 : 0,
    timestamp: new Date(entryDate).toISOString(),
  };
}).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());