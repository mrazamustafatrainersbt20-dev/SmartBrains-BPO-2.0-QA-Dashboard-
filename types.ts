
export interface QALog {
  id: number;
  date: string;
  employeeName: string;
  tasksPerformed: string;
  callsAudited: number;
  violationsCaught: number;
  sessionsConducted: number;
  warningLettersIssued: number;
  timestamp: string;
}

export interface Filters {
  startDate: Date;
  endDate: Date;
  employee: string;
}

export type UserRole = 'Manager' | 'QA' | 'Viewer';
export type Theme = 'light' | 'dark';

export interface SharedUser {
  email: string;
  role: UserRole;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  campaign: string;
}
