'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from './shared/Sidebar';
import CustomImage from './ui/image';
import images from '@/public/images';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { initializeIcons, loadTheme } from '@fluentui/react';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [loaderIsVisible, setLoaderIsVisible] = useState(true);
  const iswindow = typeof window !== 'undefined' ? true : false;
  const { push } = useRouter();

  const isLoginPage = pathname === '/login';
  const isResetPasswordPage = pathname === '/reset-password';
  const isForgotPasswordPage = pathname === '/forgot-password';
  const authPages = isLoginPage || isResetPasswordPage || isForgotPasswordPage;

  // Load fluent UI icons
  loadTheme({
    palette: {
      themePrimary: '#f26528',
      themeLighterAlt: '#fef9f6',
      themeLighter: '#fde5db',
      themeLight: '#fbcfbd',
      themeTertiary: '#f7a17c',
      themeSecondary: '#f47742',
      themeDarkAlt: '#da5b25',
      themeDark: '#b84d1f',
      themeDarker: '#883917',
      neutralLighterAlt: '#faf9f8',
      neutralLighter: '#f3f2f1',
      neutralLight: '#edebe9',
      neutralQuaternaryAlt: '#e1dfdd',
      neutralQuaternary: '#d0d0d0',
      neutralTertiaryAlt: '#c8c6c4',
      neutralTertiary: '#a19f9d',
      neutralSecondary: '#605e5c',
      neutralSecondaryAlt: '#8a8886',
      neutralPrimaryAlt: '#3b3a39',
      neutralPrimary: '#323130',
      neutralDark: '#201f1e',
      black: '#000000',
      white: '#ffffff',
    },
    defaultFontStyle: { fontFamily: 'Josefin Sans' },
  });

  // Initialize icons
  initializeIcons();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set a timeout to hide the loader after 2 seconds
      const timeout = setTimeout(() => {
        setLoaderIsVisible(false);
      }, 2000);

      // Cleanup function to clear the timeout if the component unmounts or dependencies change
      return () => clearTimeout(timeout);
    }
  }, [iswindow]);

  useEffect(() => {
    if (status === 'unauthenticated' && !isResetPasswordPage && !isForgotPasswordPage) {
      push('/login');
    }
    // fetchUserProfileInformation();
  }, [status, session, isResetPasswordPage, isResetPasswordPage, push]);

  return (
    <>
      {!loaderIsVisible && (
        <div
          className={`${
            authPages && '!overflow-y-hidden !p-0'
          } flex flex-row items-start gap-8 p-2 pr-4`}
        >
          {!pathname.includes('/login') &&
            !pathname.includes('/forgot-password') &&
            !pathname.includes('/reset-password') && <Sidebar />}

          <div
            className={`${
              authPages && '!h-screen !overflow-y-hidden !py-0'
            } hideScrollbar flex h-[calc(100vh_-_16px)] w-full flex-col overflow-y-auto py-4`}
          >
            {/* <Toaster
                                position='bottom-center'
                                richColors
                                closeButton
                                toastOptions={{
                                    duration: 3000,
                                    unstyled: false,
                                }}
                            /> */}
            {children}
          </div>
        </div>
      )}

      {loaderIsVisible && (
        <div className='grid h-[100vh] min-h-[100vh] w-[100vw] place-items-center bg-primary'>
          <div className='relative h-20 w-40 animate-pulse object-contain transition-all duration-150 ease-in-out'>
            <CustomImage src={images.logo} alt='logo' />
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
