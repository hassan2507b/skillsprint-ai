import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USERS = {
  admin: { id: 1, username: 'admin', name: 'Admin User', role: 'admin', department: 'People Operations & HR', avatar: 'AU' },
  reviewer: { id: 2, username: 'reviewer', name: 'Reviewer Hassan', role: 'reviewer', department: 'Training & Quality', avatar: 'RH' },
  manager: { id: 3, username: 'manager', name: 'Training Manager', role: 'training_manager', department: 'Corporate L&D', avatar: 'TM' },
  employee: { id: 4, username: 'employee_abdul', name: 'Abdul Raheem', role: 'employee', department: 'Engineering & IT Support', avatar: 'AR' },
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('skillsprint_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillsprint_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('skillsprint_user');
    }
  }, [currentUser]);

  const login = async (username, password) => {
    // Intercept login for our 4 default test users
    const mockUsers = {
      'admin@test.com': DEFAULT_USERS.admin,
      'reviewer@test.com': DEFAULT_USERS.reviewer,
      'manager@test.com': DEFAULT_USERS.manager,
      'employee@test.com': DEFAULT_USERS.employee,
    };

    if (mockUsers[username] && password === 'password123') {
      const user = mockUsers[username];
      setCurrentUser(user);
      return { success: true, user: user };
    }

    // Fallback to backend API
    try {
      const res = await authService.login(username, password);
      setCurrentUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Invalid email or password' };
    }
  };

  const switchRole = (roleKey) => {
    if (DEFAULT_USERS[roleKey]) {
      setCurrentUser(DEFAULT_USERS[roleKey]);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, switchRole, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
