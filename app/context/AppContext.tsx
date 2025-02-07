'use client';
import React, { Dispatch, useContext, useEffect, useState } from 'react';
import { BookingResponse } from '../lib/mockTypes';

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
  bookingDetails: {
    display: boolean;
    data: BookingResponse | null;
    isLoading: boolean;
    heading: string;
  };
  isDark: boolean;
  toggleTheme: () => void;
  setBookingDetails: Dispatch<AppContextType['bookingDetails']>;
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
  }>(defaultUserDetails);

  const [bookingDetails, setBookingDetails] = useState<{
    display: boolean;
    data: BookingResponse | null;
    isLoading: boolean;
    heading: string;
  }>({
    display: false,
    data: null,
    isLoading: false,
    heading: '',
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : systemDark);
    setIsDark(saved ? saved === 'dark' : systemDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      if (user) {
        setUserDetails(JSON.parse(user));
      }
    }
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      JSON.stringify(userDetails) !== JSON.stringify(defaultUserDetails)
    ) {
      localStorage.setItem('currentUser', JSON.stringify(userDetails));
    } else if (JSON.stringify(userDetails) === JSON.stringify(defaultUserDetails)) {
      localStorage.removeItem('currentUser');
    }
  }, [userDetails]);
  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleTheme,
        isSidebarOpen,
        setIsSidebarOpen,
        userDetails,
        setUserDetails,
        defaultUserDetails,
        bookingDetails,
        setBookingDetails,
      }}
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
