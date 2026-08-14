import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { fetchApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  inactivityLoggedOut: boolean;
  dismissInactivityNotice: () => void;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateProfile: (data: Record<string, any>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inactivity timeout: 15 minutes (in milliseconds)
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [inactivityLoggedOut, setInactivityLoggedOut] = useState<boolean>(false);

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
          if (res && res.user) {
            setUser(res.user);
            localStorage.setItem('auth_user', JSON.stringify(res.user));
          }
        })
        .catch((err: any) => {
          const isUnauthenticated =
            err?.status === 401 ||
            (err?.message && (err.message.includes('401') || err.message.includes('Unauthenticated')));

          if (isUnauthenticated) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Multi-tab logout synchronization via Storage Event & Auth Broadcast
  useEffect(() => {
    const syncAuthState = () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      if (!storedToken || !storedUser) {
        setToken(null);
        setUser(null);
      } else {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'auth_user' || e.key === null) {
        syncAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth_state_changed', syncAuthState);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth_state_changed', syncAuthState);
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.dispatchEvent(new Event('auth_state_changed'));
    }
  }, []);

  // Automatic Inactivity Auto-Logout Mechanism
  useEffect(() => {
    if (!user) return;

    let timerId: ReturnType<typeof setTimeout>;

    const handleInactivityLogout = () => {
      logout();
      setInactivityLoggedOut(true);
    };

    const resetTimer = () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Start initial timer
    resetTimer();

    return () => {
      if (timerId) clearTimeout(timerId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout]);

  const login = (newToken: string, newUser: User) => {
    setInactivityLoggedOut(false);
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const updateProfile = async (data: Record<string, any>) => {
    const res = await fetchApi<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    setUser(res.user);
    localStorage.setItem('auth_user', JSON.stringify(res.user));
    window.dispatchEvent(new Event('auth_state_changed'));
  };

  const dismissInactivityNotice = () => {
    setInactivityLoggedOut(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        inactivityLoggedOut,
        dismissInactivityNotice,
        login,
        logout,
        updateProfile,
      }}
    >
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
