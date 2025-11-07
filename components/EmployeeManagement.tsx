import React, { useState } from 'react';
import type { Employee } from '../types';
import { ConfirmationModal } from './ConfirmationModal';

interface EmployeeManagementProps {
    employees: Employee[];
    roles: string[];
    campaigns: string[];
    onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
    onRemoveEmployee: (id: number) => void;
    onAddRole: (role: string) => void;
    onAddCampaign: (campaign: string) => void;
}

const UserPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="17" y1="11" x2="23" y2="11"></line>
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);


const initialState = { name: '', role: '', campaign: '' };

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ 
    employees, 
    roles, 
    campaigns, 
    onAddEmployee, 
    onRemoveEmployee, 
    onAddRole, 
    onAddCampaign 
}) => {
    const [newEmployee, setNewEmployee] = useState(initialState);
    const [newRole, setNewRole] = useState('');
    const [newCampaign, setNewCampaign] = useState('');
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    const handleEmployeeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEmployee.name.trim() && newEmployee.role && newEmployee.campaign) {
            onAddEmployee(newEmployee);
            setNewEmployee(initialState);
        } else {
            alert('Please fill out all fields for the new employee.');
        }
    };

    const handleRoleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newRole.trim()){
            onAddRole(newRole.trim());
            setNewRole('');
        }
    };

    const handleCampaignSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newCampaign.trim()){
            onAddCampaign(newCampaign.trim());
            setNewCampaign('');
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({ ...prev, [name]: value }));
    };

    const promptRemoveEmployee = (employee: Employee) => {
        setEmployeeToDelete(employee);
    };

    const handleConfirmDelete = () => {
        if (employeeToDelete) {
            onRemoveEmployee(employeeToDelete.id);
            setEmployeeToDelete(null);
        }
    };

    return (
        <div className="bg-white dark:bg-brand-dark-200 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-brand-dark dark:text-white mb-6">Employee & Campaign Management</h2>
            
            {/* Section for adding Roles and Campaigns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Manage Roles</h3>
                     <form onSubmit={handleRoleSubmit} className="flex gap-2">
                        <input type="text" placeholder="New role name" value={newRole} onChange={e => setNewRole(e.target.value)} className="flex-grow input"/>
                        <button type="submit" className="btn-primary">Add Role</button>
                    </form>
                    <div className="list-container mt-2">
                       {roles.map(r => <div key={r} className="list-item">{r}</div>)}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Manage Campaigns</h3>
                     <form onSubmit={handleCampaignSubmit} className="flex gap-2">
                        <input type="text" placeholder="New campaign name" value={newCampaign} onChange={e => setNewCampaign(e.target.value)} className="flex-grow input"/>
                        <button type="submit" className="btn-primary">Add Campaign</button>
                    </form>
                    <div className="list-container mt-2">
                        {campaigns.map(c => <div key={c} className="list-item">{c}</div>)}
                    </div>
                </div>
            </div>

            {/* Section for adding and viewing employees */}
            <div>
                 <h3 className="font-semibold text-slate-800 dark:text-white mb-3 text-lg">Manage Employees</h3>
                <form onSubmit={handleEmployeeSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-brand-dark mb-6">
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="label">Employee Name</label>
                        <input id="name" name="name" type="text" placeholder="Full name" value={newEmployee.name} onChange={handleInputChange} className="input" required/>
                    </div>
                    <div>
                        <label htmlFor="role" className="label">Role</label>
                        <select id="role" name="role" value={newEmployee.role} onChange={handleInputChange} className="input" required>
                            <option value="" disabled>Select a role</option>
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="campaign" className="label">Campaign</label>
                        <select id="campaign" name="campaign" value={newEmployee.campaign} onChange={handleInputChange} className="input" required>
                             <option value="" disabled>Select a campaign</option>
                             {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div className="md:col-span-4 flex justify-end">
                         <button type="submit" className="btn-primary flex items-center gap-2"><UserPlusIcon className="w-5 h-5"/> Add Employee</button>
                     </div>
                </form>

                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Current Employee Roster ({employees.length})</h3>
                <div className="max-h-80 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-800">
                            <tr>
                                <th className="th">Name</th>
                                <th className="th">Role</th>
                                <th className="th">Campaign</th>
                                <th className="th">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-brand-dark-200 divide-y divide-gray-200 dark:divide-slate-700">
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td className="td font-medium">{employee.name}</td>
                                    <td className="td">{employee.role}</td>
                                    <td className="td">{employee.campaign}</td>
                                    <td className="td text-center">
                                        <button onClick={() => promptRemoveEmployee(employee)} className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* FIX: Removed invalid 'jsx' prop from style tag. This is not a Next.js app. */}
            <style>{`
                .input {
                    display: block;
                    width: 100%;
                    border-radius: 0.375rem;
                    border-color: #d1d5db; /* gray-300 */
                    background-color: #ffffff; /* white */
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                }
                .dark .input {
                    border-color: #4b5563; /* slate-600 */
                    background-color: #334155; /* brand-dark-200 */
                }
                .label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #4b5563; /* gray-700 */
                    margin-bottom: 0.25rem;
                }
                .dark .label {
                    color: #d1d5db; /* slate-300 */
                }
                .btn-primary {
                    padding: 0.5rem 1rem;
                    background-color: #1e3a8a; /* brand-primary */
                    color: white;
                    font-weight: 600;
                    border-radius: 0.375rem;
                }
                .btn-primary:hover {
                    background-color: #3b82f6; /* brand-secondary */
                }
                .btn-danger {
                    padding: 0.25rem 0.75rem;
                    background-color: #dc2626; /* red-600 */
                    color: white;
                    font-weight: 500;
                    border-radius: 0.375rem;
                }
                .btn-danger:hover {
                    background-color: #ef4444; /* red-500 */
                }
                .btn-danger:disabled {
                    background-color: #9ca3af; /* slate-400 */
                    cursor: not-allowed;
                }
                .list-container {
                    max-height: 8rem;
                    overflow-y: auto;
                    border-radius: 0.375rem;
                    border: 1px solid #e5e7eb; /* slate-200 */
                    padding: 0.5rem;
                    background-color: #f9fafb; /* slate-50 */
                }
                .dark .list-container {
                    border-color: #4b5563; /* slate-700 */
                    background-color: #1e293b; /* brand-dark */
                }
                .list-item {
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                }
                .th {
                    padding: 0.75rem 1rem;
                    text-align: left;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #6b7280; /* gray-500 */
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .dark .th {
                    color: #9ca3af; /* gray-400 */
                }
                .td {
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    color: #111827; /* gray-900 */
                }
                .dark .td {
                    color: #d1d5db; /* slate-300 */
                }
            `}</style>

            {employeeToDelete && (
                <ConfirmationModal
                    isOpen={!!employeeToDelete}
                    onClose={() => setEmployeeToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Confirm Deletion"
                >
                    <p>Are you sure you want to delete this user?</p>
                    <p className="font-semibold text-center my-2">{employeeToDelete.name}</p>
                </ConfirmationModal>
            )}
        </div>
    );
};
