import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 
  | 'Plant Manager' 
  | 'Maintenance Engineer' 
  | 'Safety Officer' 
  | 'Quality Engineer' 
  | 'Administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  setBackendUrl: (url: string) => void;
  backendUrl: string;
  isBackendConnected: boolean;
  checkBackendConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [backendUrl, setBackendUrlState] = useState<string>(() => {
    return localStorage.getItem('backend_url') || 'http://localhost:8000';
  });
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const setBackendUrl = (url: string) => {
    setBackendUrlState(url);
    localStorage.setItem('backend_url', url);
  };

  const checkBackendConnection = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/health`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        setIsBackendConnected(true);
        return true;
      }
    } catch {
      // Failed to connect, fall back silently to mock
    }
    setIsBackendConnected(false);
    return false;
  };

  useEffect(() => {
    // Check backend health periodically
    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 15000);

    // Load user session from local storage
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user_session');
      }
    }
    setLoading(false);
    return () => clearInterval(interval);
  }, [backendUrl]);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (response.ok) {
        const data = await response.json();
        const loggedUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          token: data.access_token,
          isVerified: data.user.is_verified,
        };
        setUser(loggedUser);
        localStorage.setItem('user_session', JSON.stringify(loggedUser));
        setIsBackendConnected(true);
        return true;
      }
    } catch {
      // Backend is offline, perform simulated login
    }

    // Mock Fallback Login
    const mockUser: User = {
      id: 'mock-user-123',
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      token: 'mock-jwt-token-xxxx-yyyy-zzzz',
      isVerified: true,
    };
    setUser(mockUser);
    localStorage.setItem('user_session', JSON.stringify(mockUser));
    return true;
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (response.ok) {
        // Automatically login after successful registration
        return await login(email, password, role);
      }
    } catch {
      // Fallback
    }

    // Mock Register Fallback
    const mockUser: User = {
      id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      token: 'mock-jwt-token-xxxx-yyyy-zzzz',
      isVerified: false, // Start unverified to show email verification flow
    };
    setUser(mockUser);
    localStorage.setItem('user_session', JSON.stringify(mockUser));
    return true;
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    if (user) {
      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);
      localStorage.setItem('user_session', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Simulated forgot password trigger
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        verifyEmail,
        forgotPassword,
        setBackendUrl,
        backendUrl,
        isBackendConnected,
        checkBackendConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
