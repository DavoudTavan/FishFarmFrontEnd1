import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, RefreshCw, Key, Shield, UserX, Save 
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import Alert from './common/Alert';

interface User {
  id: number;
  username: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const { user, isAdmin } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Register form
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('user');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  
  // Reset password
  const [resetUsername, setResetUsername] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  
  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    if (!user || !isAdmin) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://8a74-141-11-246-161.ngrok-free.app/get_users?user_id=${user.user_id}`);
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data);
        setSuccess('لیست کاربران با موفقیت دریافت شد');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'خطا در دریافت کاربران');
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
      console.error('Get users error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (targetUserId: number) => {
    if (!user || !isAdmin) return;
    
    if (!confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://8a74-141-11-246-161.ngrok-free.app/delete_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, target_user_id: targetUserId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
        fetchUsers();
      } else {
        setError(data.message || 'خطا در حذف کاربر');
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
      console.error('Delete user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    
    if (!registerUsername || !registerPassword) {
      setRegisterError('لطفاً نام کاربری و رمز عبور را وارد کنید');
      return;
    }
    
    setIsLoading(true);
    setRegisterError(null);
    
    try {
      const response = await fetch('https://8a74-141-11-246-161.ngrok-free.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          username: registerUsername,
          password: registerPassword,
          role: registerRole
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRegisterSuccess(data.message);
        setRegisterUsername('');
        setRegisterPassword('');
        setRegisterRole('user');
        fetchUsers();
        setTimeout(() => setRegisterSuccess(null), 3000);
      } else {
        setRegisterError(data.message || 'خطا در ثبت کاربر');
      }
    } catch (error) {
      setRegisterError('خطا در ارتباط با سرور');
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    
    if (!resetUsername) {
      setResetError('لطفاً نام کاربری هدف را وارد کنید');
      return;
    }
    
    setIsLoading(true);
    setResetError(null);
    
    try {
      const response = await fetch('https://8a74-141-11-246-161.ngrok-free.app/reset_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          target_username: resetUsername
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetSuccess(data.message);
        setResetUsername('');
        setTimeout(() => setResetSuccess(null), 3000);
      } else {
        setResetError(data.message || 'خطا در ریست رمز عبور');
      }
    } catch (error) {
      setResetError('خطا در ارتباط با سرور');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    
    if (!currentPassword || !newPassword) {
      setChangeError('لطفاً هر دو رمز عبور را وارد کنید');
      return;
    }
    
    setIsLoading(true);
    setChangeError(null);
    
    try {
      const response = await fetch('https://8a74-141-11-246-161.ngrok-free.app/change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          current_password: currentPassword,
          new_password: newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setChangeSuccess(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setChangeSuccess(null), 3000);
      } else {
        setChangeError(data.message || 'خطا در تغییر رمز عبور');
      }
    } catch (error) {
      setChangeError('خطا در ارتباط با سرور');
      console.error('Change password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <Shield size={24} className="card-icon" />
        <h2>مدیریت کاربران</h2>
      </div>
      
      {/* User List */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Users size={20} className="text-primary ml-2" />
            <h3 className="text-lg font-bold">لیست کاربران</h3>
          </div>
          <button
            className="btn btn-primary flex items-center text-sm"
            onClick={fetchUsers}
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
                <th>نام کاربری</th>
                <th>نقش</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    هیچ کاربری یافت نشد
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>
                      {u.role === 'admin' ? (
                        <span className="badge badge-primary">مدیر</span>
                      ) : (
                        <span className="badge badge-secondary">کاربر</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger flex items-center text-sm px-3 py-1"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <UserX size={16} className="ml-1" />
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Register New User */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-4">
          <UserPlus size={20} className="text-primary ml-2" />
          <h3 className="text-lg font-bold">ثبت کاربر جدید</h3>
        </div>
        
        {registerError && <Alert type="danger" message={registerError} onClose={() => setRegisterError(null)} />}
        {registerSuccess && <Alert type="success" message={registerSuccess} onClose={() => setRegisterSuccess(null)} />}
        
        <form onSubmit={handleRegisterUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="input-group">
            <label htmlFor="registerUsername">نام کاربری</label>
            <input
              id="registerUsername"
              type="text"
              className="form-control"
              placeholder="نام کاربری"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="registerPassword">رمز عبور</label>
            <input
              id="registerPassword"
              type="password"
              className="form-control"
              placeholder="رمز عبور"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="registerRole">نقش</label>
            <select
              id="registerRole"
              className="form-control"
              value={registerRole}
              onChange={(e) => setRegisterRole(e.target.value)}
            >
              <option value="user">کاربر</option>
              <option value="admin">مدیر</option>
            </select>
          </div>
          
          <div className="md:col-span-3">
            <button
              type="submit"
              className="btn btn-success flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner ml-2"></span>
              ) : (
                <UserPlus size={18} className="ml-2" />
              )}
              ثبت کاربر
            </button>
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reset Password */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-4">
            <Key size={20} className="text-primary ml-2" />
            <h3 className="text-lg font-bold">ریست رمز عبور کاربر</h3>
          </div>
          
          {resetError && <Alert type="danger" message={resetError} onClose={() => setResetError(null)} />}
          {resetSuccess && <Alert type="success" message={resetSuccess} onClose={() => setResetSuccess(null)} />}
          
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="input-group">
              <label htmlFor="resetUsername">نام کاربری هدف</label>
              <input
                id="resetUsername"
                type="text"
                className="form-control"
                placeholder="نام کاربری هدف"
                value={resetUsername}
                onChange={(e) => setResetUsername(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner ml-2"></span>
              ) : (
                <Key size={18} className="ml-2" />
              )}
              ریست رمز
            </button>
          </form>
        </div>
        
        {/* Change Admin Password */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-4">
            <Save size={20} className="text-primary ml-2" />
            <h3 className="text-lg font-bold">تغییر رمز عبور مدیر</h3>
          </div>
          
          {changeError && <Alert type="danger" message={changeError} onClose={() => setChangeError(null)} />}
          {changeSuccess && <Alert type="success" message={changeSuccess} onClose={() => setChangeSuccess(null)} />}
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="input-group">
              <label htmlFor="currentPassword">رمز عبور فعلی</label>
              <input
                id="currentPassword"
                type="password"
                className="form-control"
                placeholder="رمز عبور فعلی"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="newPassword">رمز عبور جدید</label>
              <input
                id="newPassword"
                type="password"
                className="form-control"
                placeholder="رمز عبور جدید"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner ml-2"></span>
              ) : (
                <Save size={18} className="ml-2" />
              )}
              تغییر رمز
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;