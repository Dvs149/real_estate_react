'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { fetchApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // ignore
        }
      }

      // Verify token with backend
      fetchApi<{ user: User }>('/auth/me')
        .then((res) => {
          setUser(res.user);
          localStorage.setItem('auth_user', JSON.stringify(res.user));
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    const res = await fetchApi<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    setUser(res.user);
    localStorage.setItem('auth_user', JSON.stringify(res.user));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
