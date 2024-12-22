import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import AppProvider from './context/AppContext';
import TanstackProvider from './context/TanstackContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Whipcare Admin Console',
  description: 'The console application for Whipcare',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.variable} max-h-screen font-inter antialiased scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-400 scrollbar-w-[6px] scrollbar-h-[6px]`}
      >
        <AuthProvider>
          <TanstackProvider>
            <AppProvider>
              <Toaster richColors position='top-right' />
              {children}
            </AppProvider>
          </TanstackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
