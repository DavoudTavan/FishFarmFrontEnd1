import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useUser } from '../context/UserContext';

const LoginPage: React.FC = () => {
  const { user, setUser, isAuthenticated } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('لطفاً نام کاربری و رمز عبور را وارد کنید');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://8a74-141-11-246-161.ngrok-free.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const userData = {
          username,
          user_id: data.user_id,
          role: data.role
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setSuccess(data.message);
        setUsername('');
        setPassword('');
      } else {
        setError(data.message || 'خطا در ورود');
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="card max-w-md w-full space-y-8 p-8">
        <div className="card-header justify-center">
          <LogIn size={32} className="card-icon" />
          <h2 className="text-center">ورود به سیستم مدیریت مزرعه ماهی</h2>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">نام کاربری</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="form-control"
              placeholder="نام کاربری خود را وارد کنید"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">رمز عبور</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-control"
              placeholder="رمز عبور خود را وارد کنید"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner mr-2"></span>
              ) : (
                <LogIn size={18} className="btn-icon" />
              )}
              ورود
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;