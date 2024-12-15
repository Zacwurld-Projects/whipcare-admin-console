import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';

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
        className={`${inter.variable} font-inter antialiased scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-w-[6px]`}
      >
        <AuthProvider>
          <Toaster richColors position='top-right' />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
