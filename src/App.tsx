import React, { useState, useEffect } from 'react';
import { Fish } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { UserProvider } from './context/UserContext';
import './App.css';

function App() {
  const [pageTitle, setPageTitle] = useState('مدیریت مزرعه ماهی');

  useEffect(() => {
    document.title = pageTitle;
    // Set the title in the HTML
    const titleElement = document.querySelector('title');
    if (titleElement) {
      titleElement.textContent = pageTitle;
    }
  }, [pageTitle]);

  return (
    <UserProvider>
      <div className="app-container">
        <Dashboard />
        <LoginPage />
      </div>
    </UserProvider>
  );
}

export default App;