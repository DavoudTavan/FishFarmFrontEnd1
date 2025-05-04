import React, { useState } from 'react';
import { Terminal, Send } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Alert from './common/Alert';

interface CommandSectionProps {
  onCommandSubmit: () => void;
}

const CommandSection: React.FC<CommandSectionProps> = ({ onCommandSubmit }) => {
  const { user, isAdmin } = useUser();
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [debug, setDebug] = useState<string | null>(null);

  const handleSubmitCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !isAdmin) return;
    
    if (!command) {
      setError('لطفاً دستور را وارد کنید');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setDebug(null);
    
    try {
      const response = await fetch('https://8a74-141-11-246-161.ngrok-free.app/submit_command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
        setCommand('');
        onCommandSubmit();
        
        if (data.debug) {
          setDebug(JSON.stringify(data, null, 2));
        }
      } else {
        setError(data.message || 'خطا در ارسال دستور');
        
        if (data.debug) {
          setDebug(JSON.stringify(data, null, 2));
        }
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
      console.error('Submit command error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <Terminal size={24} className="card-icon" />
        <h2>ثبت دستور</h2>
      </div>
      
      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <form onSubmit={handleSubmitCommand} className="mb-4">
        <div className="input-group">
          <label htmlFor="command">دستور</label>
          <div className="flex">
            <input
              id="command"
              type="text"
              className="form-control"
              placeholder="مثال: به احمد بگو آکواریم شماره 5 را آب پرکنه"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary mr-2 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner ml-2"></span>
              ) : (
                <Send size={18} className="ml-2" />
              )}
              ارسال
            </button>
          </div>
        </div>
      </form>
      
      {debug && (
        <details className="mb-4">
          <summary className="cursor-pointer text-primary mb-2">نمایش جزئیات</summary>
          <div className="debug">{debug}</div>
        </details>
      )}
    </div>
  );
};

export default CommandSection;