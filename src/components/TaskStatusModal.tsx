import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface TaskStatusModalProps {
  isOpen: boolean;
  taskId: number | null;
  status: string;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskStatusModal: React.FC<TaskStatusModalProps> = ({
  isOpen,
  taskId,
  status,
  onClose,
  onUpdate
}) => {
  const { user } = useUser();
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNotes('');
      setError(null);
    }
  }, [isOpen]);

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'تکمیل';
      case 'unable':
        return 'قادر به انجام نیست';
      default:
        return status;
    }
  };

  const handleUpdateStatus = async () => {
    if (!user || !taskId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://8a74-141-11-246-161.ngrok-free.app/update_task_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, status, notes })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onUpdate();
      } else {
        setError(data.message || 'خطا در به‌روزرسانی وضعیت');
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
      console.error('Update task error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="flex items-center">
            {status === 'completed' ? (
              <Check size={20} className="text-success ml-2" />
            ) : (
              <AlertTriangle size={20} className="text-danger ml-2" />
            )}
            به‌روزرسانی وضعیت
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <p className="text-lg mb-2">
            وضعیت جدید: 
            <span className={`badge ${status === 'completed' ? 'badge-success' : 'badge-danger'} mr-2`}>
              {getStatusText()}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            {status === 'completed' 
              ? 'در صورت تکمیل وظیفه، می‌توانید توضیحات اضافی وارد کنید.'
              : 'لطفاً دلیل عدم امکان انجام را توضیح دهید.'}
          </p>
        </div>
        
        <div className="input-group">
          <label htmlFor="notes">توضیحات {status === 'unable' && <span className="text-danger">*</span>}</label>
          <textarea
            id="notes"
            className="form-control"
            rows={4}
            placeholder={status === 'completed' ? 'توضیحات (اختیاری)' : 'دلیل عدم امکان انجام'}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required={status === 'unable'}
          ></textarea>
        </div>
        
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={16} className="ml-1" />
            لغو
          </button>
          <button
            className={`btn ${status === 'completed' ? 'btn-success' : 'btn-danger'}`}
            onClick={handleUpdateStatus}
            disabled={isLoading || (status === 'unable' && !notes)}
          >
            {isLoading ? (
              <span className="spinner ml-2"></span>
            ) : status === 'completed' ? (
              <Check size={16} className="ml-1" />
            ) : (
              <AlertTriangle size={16} className="ml-1" />
            )}
            تأیید
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusModal;