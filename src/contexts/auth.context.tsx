// src/auth/auth.context.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, onIdTokenChanged, User, getIdToken } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextProps {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const unsubscribeAuthState = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const token = await getIdToken(user);
        setToken(token);
        localStorage.setItem('token', token);
      } else {
        setToken(null);
        localStorage.removeItem('token');
      }
    });

    const unsubscribeIdToken = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        setToken(token);
        localStorage.setItem('token', token);
      } else {
        setToken(null);
        localStorage.removeItem('token');
      }
    });

    return () => {
      unsubscribeAuthState();
      unsubscribeIdToken();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};