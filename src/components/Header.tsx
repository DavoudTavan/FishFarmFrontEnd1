import React from 'react';
import { Fish, LogOut, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useUser();

  if (!user) return null;

  return (
    <header className="card mb-6">
      <div className="flex justify-between items-center">
        <div className="logo">
          <Fish size={32} className="logo-icon" />
          <h1 className="text-xl sm:text-2xl">مدیریت مزرعه ماهی</h1>
        </div>
        
        <div className="user-info">
          <div className="flex flex-col items-end mr-2">
            <span className="user-name font-medium">{user.username}</span>
            <span className="text-sm text-gray-500">
              {isAdmin ? (
                <span className="badge badge-primary">مدیر</span>
              ) : (
                <span className="badge badge-secondary">کاربر</span>
              )}
            </span>
          </div>
          <User size={20} className="text-primary mr-1" />
          <button
            onClick={logout}
            className="btn btn-danger mr-4 flex items-center text-sm px-3 py-1"
          >
            <LogOut size={16} className="ml-1" />
            خروج
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;