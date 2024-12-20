'use client';
import React, { Dispatch, useContext, useState } from 'react';

type AppContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<boolean>;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AppContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
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
