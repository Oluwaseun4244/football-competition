import React, { createContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  teamName: string;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamName, setTeamName] = useState('');

  const login = (email: string, password: string) => {
    // Simulate API call
    if (email === 'admin@example.com') {
      setIsAdmin(true);
      setTeamName('');
    } else if (email === 'team@example.com') {
      setIsAdmin(false);
      setTeamName('Arsenal'); // For demo purposes
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setTeamName('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, teamName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 