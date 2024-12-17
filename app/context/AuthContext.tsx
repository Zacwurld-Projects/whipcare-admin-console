'use client';
import React, { FunctionComponent, ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

export const AuthProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
