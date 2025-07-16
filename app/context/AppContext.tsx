'use client';
import React, { Dispatch, useContext, useEffect, useState, useMemo } from 'react';
import { BookingResponse } from '../lib/mockTypes';
import { registerUnauthorizedSetter } from '../api/apiClient';
import { usePathname } from 'next/navigation';

type AppContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<boolean>;
  userDetails: {
    id: string | undefined;
    role: string | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
    privileges?: string[];
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
  unauthorized: boolean;
  setUnauthorized: Dispatch<boolean>;
  resetContext: () => void;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultUserDetails = useMemo(
    () => ({
      id: '',
      role: '',
      name: '',
      email: '',
      image: '',
      privileges: [],
    }),
    [],
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    id: string | undefined;
    role: string | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
    privileges?: string[];
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
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : systemDark);
    setIsDark(saved ? saved === 'dark' : systemDark);
  }, []);

  useEffect(() => {
    registerUnauthorizedSetter(setUnauthorized);
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

  const pathname = usePathname();

  useEffect(() => {
    setUnauthorized(false);
  }, [pathname]);

  const resetContext = () => {
    setUserDetails(defaultUserDetails);
    setIsSidebarOpen(false);
    setBookingDetails({
      display: false,
      data: null,
      isLoading: false,
      heading: '',
    });
    setUnauthorized(false);
    // Optionally clear other state here
  };

  if (typeof window !== 'undefined') {
    // @ts-expect-error: Expose resetContext for debugging and manual context reset in the browser
    window.__resetAppContext = resetContext;
  }

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
        unauthorized,
        setUnauthorized,
        resetContext,
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
