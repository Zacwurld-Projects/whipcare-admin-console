'use client';
import React, { Dispatch, useContext, useEffect, useState } from 'react';

type AppContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<boolean>;
  userDetails: {
    id: string | undefined;
    role: string | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  };
  setUserDetails: Dispatch<{
    id: string | undefined;
    role: string | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  }>;
  defaultUserDetails: {
    id: string;
    role: string;
    name: string;
    email: string;
    image: string;
  };
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultUserDetails = {
    id: '',
    role: '',
    name: '',
    email: '',
    image: '',
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    id: string | undefined;
    role: string | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  }>(() => {
    if (typeof window !== undefined) {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : defaultUserDetails;
    }
    return defaultUserDetails;
  });

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(userDetails));
  }, [userDetails]);

  return (
    <AppContext.Provider
      value={{ isSidebarOpen, setIsSidebarOpen, userDetails, setUserDetails, defaultUserDetails }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within an AppProvider');
  }
  return context;
};

export default AppProvider;
