import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { users, getUserByEmail, addUser } from '../database/users';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// Variable global para almacenar usuarios dinámicos
let dynamicUsers: User[] = [];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('unmsm_user');
    const savedDynamicUsers = localStorage.getItem('unmsm_dynamic_users');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedDynamicUsers) {
      dynamicUsers = JSON.parse(savedDynamicUsers);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: User['role']): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check password (all users use "123456")
    if (password !== '123456') {
      setIsLoading(false);
      return false;
    }
    
    // Buscar en usuarios mock y dinámicos
    const allUsers = [...users, ...dynamicUsers];
    const foundUser = allUsers.find(u => u.email === email && u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('unmsm_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unmsm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Función para agregar usuarios dinámicamente (usada por el admin)
export const addDynamicUser = (user: User) => {
  addUser(user);
  dynamicUsers.push(user); // Mantener compatibilidad
  localStorage.setItem('unmsm_dynamic_users', JSON.stringify(dynamicUsers));
};