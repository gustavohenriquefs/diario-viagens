// src/user/user.context.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from './auth.context';

interface UserContextProps {
  userData: User | null;
}

const UserContext = createContext<UserContextProps>({ userData: null });

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    } else {
      setUserData(null);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ userData }}>
      {children}
    </UserContext.Provider>
  );
};