import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Header from './Header';
import UserManagement from './UserManagement';
import CommandSection from './CommandSection';
import TasksSection from './TasksSection';
import TaskStatusModal from './TaskStatusModal';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isAdmin } = useUser();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [refreshTasks, setRefreshTasks] = useState(0);
  
  const openTaskModal = (taskId: number, status: string) => {
    setCurrentTaskId(taskId);
    setCurrentStatus(status);
    setShowTaskModal(true);
  };
  
  const closeTaskModal = () => {
    setShowTaskModal(false);
    setCurrentTaskId(null);
    setCurrentStatus('');
  };
  
  const handleTaskUpdate = () => {
    setRefreshTasks(prev => prev + 1);
    closeTaskModal();
  };

  // Check server on load
  useEffect(() => {
    const checkServer = async () => {
      try {
        await fetch('https://8a74-141-11-246-161.ngrok-free.app/login');
        console.log('Server connection: OK');
      } catch (error) {
        console.error('Server connection failed:', error);
      }
    };
    
    checkServer();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="app-container">
      <Header />
      
      {isAdmin && (
        <>
          <UserManagement />
          <CommandSection onCommandSubmit={() => setRefreshTasks(prev => prev + 1)} />
        </>
      )}
      
      <TasksSection 
        refreshCounter={refreshTasks}
        onUpdateTask={openTaskModal}
      />
      
      <TaskStatusModal
        isOpen={showTaskModal}
        taskId={currentTaskId}
        status={currentStatus}
        onClose={closeTaskModal}
        onUpdate={handleTaskUpdate}
      />
    </div>
  );
};

export default Dashboard;