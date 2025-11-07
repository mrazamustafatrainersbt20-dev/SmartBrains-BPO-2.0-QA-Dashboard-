import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DataView } from './components/DataView';
import { ShareModal } from './components/ShareModal';
import { EmployeeManagement } from './components/EmployeeManagement';
import type { QALog, Filters, UserRole, Theme, SharedUser, Employee } from './types';
import { mockLogs, mockEmployees, mockRoles, mockCampaigns } from './constants';
// FIX: Consolidated date-fns imports to resolve module loading errors.
import { format, startOfMonth, endOfMonth } from 'date-fns';

const App: React.FC = () => {
  const [qaLogs, setQaLogs] = useState<QALog[]>(mockLogs);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [roles, setRoles] = useState<string[]>(mockRoles);
  const [campaigns, setCampaigns] = useState<string[]>(mockCampaigns);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Manager');
  const [theme, setTheme] = useState<Theme>('light');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
    { email: 'manager@example.com', role: 'Manager' },
    { email: 'qa.specialist@example.com', role: 'QA' },
  ]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);
  
  const today = new Date();
  const [filters, setFilters] = useState<Filters>({
    startDate: startOfMonth(today),
    endDate: endOfMonth(today),
    employee: 'All',
  });

  const filteredLogs = useMemo(() => {
    return qaLogs.filter(log => {
      const logDate = new Date(log.date);
      const isAfterStartDate = logDate >= filters.startDate;
      const isBeforeEndDate = logDate <= filters.endDate;
      const isEmployeeMatch = filters.employee === 'All' || log.employeeName === filters.employee;
      return isAfterStartDate && isBeforeEndDate && isEmployeeMatch;
    });
  }, [qaLogs, filters]);

  const addLog = (newLog: Omit<QALog, 'id' | 'timestamp'>) => {
    const logWithTimestamp: QALog = {
      ...newLog,
      id: qaLogs.length > 0 ? Math.max(...qaLogs.map(l => l.id)) + 1 : 1,
      timestamp: new Date().toISOString(),
    };
    setQaLogs(prevLogs => [...prevLogs, logWithTimestamp]);
  };

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    if (employees.some(emp => emp.name.toLowerCase() === employee.name.toLowerCase())) {
        alert('An employee with this name already exists.');
        return;
    }
    const newEmployee: Employee = {
      ...employee,
      id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    }
    setEmployees(prev => [...prev, newEmployee].sort((a,b) => a.name.localeCompare(b.name)));
  };

  const removeEmployee = (id: number) => {
    // Find the employee from the current state to get their name.
    // This is critical to ensure we remove the correct logs associated with them.
    const employeeData = employees.find(emp => emp.id === id);
  
    // If the employee doesn't exist (e.g., due to a rapid double-click on the delete button),
    // prevent errors by stopping the function execution gracefully.
    if (!employeeData) {
      console.error(`Attempted to remove employee with ID ${id}, but they were not found.`);
      alert("Deletion failed: The employee could not be found.");
      return;
    }
    
    const nameToDelete = employeeData.name;
  
    // Use functional updates for both state setters. This is React best practice
    // to prevent race conditions by ensuring each update is based on the most recent state.
    
    // 1. Update the list of employees to remove the selected one.
    setEmployees(currentEmployees => currentEmployees.filter(emp => emp.id !== id));
    
    // 2. Update the QA logs to remove all entries associated with the deleted employee's name.
    setQaLogs(currentLogs => currentLogs.filter(log => log.employeeName !== nameToDelete));
  
    // 3. Finally, notify the user that the operation was successful.
    alert(`Successfully removed employee "${nameToDelete}" and all associated logs.`);
  };


  const addRole = (role: string) => {
    if (roles.includes(role)) return;
    setRoles(prev => [...prev, role].sort());
  };

  const addCampaign = (campaign: string) => {
    if (campaigns.includes(campaign)) return;
    setCampaigns(prev => [...prev, campaign].sort());
  };

  const addUser = (user: SharedUser) => {
    if (sharedUsers.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      alert('A user with this email already exists.');
      return;
    }
    setSharedUsers(prev => [...prev, user]);
  };

  const removeUser = (email: string) => {
    setSharedUsers(prev => prev.filter(u => u.email !== email));
  };


  const handleExport = () => {
    if (filteredLogs.length === 0) {
      alert("No data to export for the selected filters.");
      return;
    }
    const headers = ["ID", "Date", "Employee Name", "Tasks Performed", "Calls Audited", "Violations Caught", "Sessions Conducted", "Warning Letters Issued", "Timestamp"];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.id,
        log.date,
        `"${log.employeeName}"`,
        `"${log.tasksPerformed.replace(/"/g, '""')}"`,
        log.callsAudited,
        log.violationsCaught,
        log.sessionsConducted,
        log.warningLettersIssued,
        log.timestamp
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const employeeFilePart = filters.employee === 'All' ? 'All_Employees' : filters.employee.replace(/\s+/g, '_');
    const dateFilePart = `${format(filters.startDate, 'yyyyMMdd')}_to_${format(filters.endDate, 'yyyyMMdd')}`;
    link.setAttribute("download", `QA_Report_${employeeFilePart}_${dateFilePart}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header 
        theme={theme}
        setTheme={setTheme}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
        onExport={handleExport}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />
      <main className="p-4 sm:p-6 lg:p-8 space-y-8">
        {currentUserRole !== 'QA' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Manager's Dashboard</h2>
            <Dashboard
                filteredLogs={filteredLogs}
                allLogs={qaLogs}
                employees={employees}
                filters={filters}
                setFilters={setFilters}
                theme={theme}
              />
          </div>
        )}

        {currentUserRole === 'Manager' && (
             <div className="mt-8">
                <EmployeeManagement 
                    employees={employees}
                    roles={roles}
                    campaigns={campaigns}
                    onAddEmployee={addEmployee}
                    onRemoveEmployee={removeEmployee}
                    onAddRole={addRole}
                    onAddCampaign={addCampaign}
                />
            </div>
        )}
        
        {currentUserRole !== 'Viewer' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">QA Log Data & Entry</h2>
            <DataView 
              logs={qaLogs} 
              employees={employees} 
              onAddLog={addLog}
              currentUserRole={currentUserRole}
            />
          </div>
        )}
      </main>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        users={sharedUsers}
        onAddUser={addUser}
        onRemoveUser={removeUser}
      />
    </div>
  );
};

export default App;
