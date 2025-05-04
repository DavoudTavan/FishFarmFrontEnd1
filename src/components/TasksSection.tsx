import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Alert from './common/Alert';

interface Task {
  id: number;
  text: string;
  status: string;
  assigned_to: number;
  notes: string | null;
}

interface User {
  id: number;
  username: string;
  role: string;
}

interface TasksSectionProps {
  refreshCounter: number;
  onUpdateTask: (taskId: number, status: string) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({ refreshCounter, onUpdateTask }) => {
  const { user, isAdmin } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch users (for admin to see usernames)
  const fetchUsers = useCallback(async () => {
    if (!user || !isAdmin) return;
    
    try {
      const response = await fetch(`https://8a74-141-11-246-161.ngrok-free.app/get_users?user_id=${user.user_id}`);
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Get users error:', error);
    }
  }, [user, isAdmin]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://8a74-141-11-246-161.ngrok-free.app/get_tasks?user_id=${user.user_id}&role=${user.role}`);
      const data = await response.json();
      
      if (response.ok) {
        setTasks(data);
        setSuccess('لیست وظایف با موفقیت دریافت شد');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'خطا در دریافت وظایف');
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
      console.error('Get tasks error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Get username from id
  const getUsernameById = (id: number) => {
    const foundUser = users.find(u => u.id === id);
    return foundUser ? foundUser.username : id.toString();
  };

  // Get status text in Persian
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در انتظار';
      case 'completed':
        return 'تکمیل شده';
      case 'unable':
        return 'قادر به انجام نیست';
      default:
        return status;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'completed':
        return 'badge-success';
      case 'unable':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchTasks();
      if (isAdmin) {
        fetchUsers();
      }
    }
  }, [user, isAdmin, fetchTasks, fetchUsers]);

  // Refresh when counter changes
  useEffect(() => {
    if (refreshCounter > 0) {
      fetchTasks();
    }
  }, [refreshCounter, fetchTasks]);

  if (!user) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <ClipboardList size={24} className="card-icon" />
        <h2>وظایف</h2>
      </div>
      
      <div className="flex justify-end mb-4">
        <button
          className="btn btn-primary flex items-center"
          onClick={fetchTasks}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={`ml-1 ${isLoading ? 'animate-spin' : ''}`} />
          به‌روزرسانی
        </button>
      </div>
      
      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>متن</th>
              <th>وضعیت</th>
              <th>اختصاص به</th>
              <th>توضیحات</th>
              {!isAdmin && <th>عملیات</th>}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 6} className="text-center py-4 text-gray-500">
                  هیچ وظیفه‌ای یافت نشد
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const isLocked = task.status === 'completed' || task.status === 'unable';
                
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td>{task.id}</td>
                    <td>{task.text}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </td>
                    <td>{getUsernameById(task.assigned_to)}</td>
                    <td>{task.notes || '—'}</td>
                    {!isAdmin && (
                      <td>
                        {isLocked ? (
                          <span className="text-gray-400 text-sm">وضعیت نهایی شده</span>
                        ) : (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              className="btn btn-success text-sm px-3 py-1"
                              onClick={() => onUpdateTask(task.id, 'completed')}
                            >
                              تکمیل
                            </button>
                            <button
                              className="btn btn-danger text-sm px-3 py-1"
                              onClick={() => onUpdateTask(task.id, 'unable')}
                            >
                              قادر به انجام نیست
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksSection;