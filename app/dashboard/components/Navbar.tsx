'use client';
import LightModeIcon from '../assets/lightModeIcon.svg';
import ChevronDownIcon from '../assets/chevronDown.svg';
import NigeriaFlag from '../assets/NigeriaFlag.svg';
import SouthAfricaFlag from '../assets/SouthAfricaFlag.svg';
import NotificationsIcon from '../assets/notificationIcon.svg';
import SettingsIcon from '../assets/settingsIcon.svg';
import LogoutIcon from '../assets/LogoutIcon.svg';
import { useRef, useState } from 'react';
import Link from 'next/link';
import useMenu from '@/app/hooks/useMenu';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import HamburgerIcon from '../assets/hamburgerMenuIcon.svg';
import EmptyNotificationsIcon from '../assets/EmptyNotificationsIcon.svg';
import { doLogout } from '@/app/actions/authActions';
import { useGlobalContext } from '@/app/context/AppContext';
import Image from 'next/image';
import LogoutModal from './modals/LogoutModal';
import { useMutation } from '@tanstack/react-query';

const mockNotifications: {
  heading: string;
  content: string;
  timeStamp: number;
  status: string;
}[] = [
  // {
  //   heading: 'Booking, a service',
  //   content: 'Isaac booked a mechanic for a car repair',
  //   timeStamp: Date.now() - 2 * 60 * 1000,
  //   status: 'unread',
  // },
];

const Navbar = () => {
  const {
    setIsSidebarOpen,
    isSidebarOpen,
    userDetails,
    setUserDetails,
    defaultUserDetails,
    isDark,
    toggleTheme,
    selectedCountry,
    setSelectedCountry,
  } = useGlobalContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuBtnRef = useRef<HTMLButtonElement>(null);
  const { isMenuOpen: isUserMenuOpen, setIsMenuOpen: setIsUserMenuOpen } = useMenu(
    userMenuBtnRef,
    userMenuRef,
  );

  const notificationsMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuBtnRef = useRef<HTMLButtonElement>(null);
  const { isMenuOpen: isNotificationsMenuOpen, setIsMenuOpen: setIsNotificationsMenuOpen } =
    useMenu(notificationsMenuBtnRef, notificationsMenuRef);

  // Country selector dropdown
  const countryMenuRef = useRef<HTMLDivElement>(null);
  const countryMenuBtnRef = useRef<HTMLButtonElement>(null);
  const { isMenuOpen: isCountryMenuOpen, setIsMenuOpen: setIsCountryMenuOpen } = useMenu(
    countryMenuBtnRef,
    countryMenuRef,
  );

  const useLogUserOut = useMutation({
    mutationKey: ['logUserOut'],
    mutationFn: async () => doLogout(),
    onSuccess: () => setUserDetails(defaultUserDetails),
  });

  return (
    <>
      <nav
        className={`sticky top-0 z-50 flex h-[83px] w-full items-center justify-between bg-white px-[15px] shadow-sm dark:bg-dark-secondary`}
      >
        <div className='flex items-center gap-4'>
          <button
            className={`block min-[1100px]:hidden`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <HamburgerIcon className='*:fill-gray-800 dark:*:stroke-white' />
          </button>
          <div className='flex items-center gap-[12px]'>
            <button
              onClick={toggleTheme}
              className='center-grid peer size-[32px] rounded-full bg-primary-50'
            >
              <LightModeIcon />
            </button>
            <div className='tooltip center-grid relative w-fit rounded-[4px] bg-primary-900 px-[8px] py-[8px] pl-[10px] text-white opacity-0 shadow-[0px_5.18px_10.36px_-3.98px_rgba(0,0,0,0.25)] transition-opacity duration-200 ease-in peer-hover:opacity-100 dark:bg-dark-accent'>
              <div
                className={`absolute left-[-12px] size-[0px] rotate-[270deg] ${isDark ? '[border-color:transparent_transparent_#ff6e4a_transparent]' : '[border-color:transparent_transparent_#711e00_transparent]'} [border-width:0_15px_12px_15px]`}
              ></div>
              <p className='text-xsmall'>{isDark ? 'Dark' : 'Light'} Mode</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-4 pr-[25px]'>
          <div className='relative'>
            <button
              className='flex items-center gap-2'
              aria-label='country selector'
              ref={countryMenuBtnRef}
              onClick={() => {
                setIsUserMenuOpen(false);
                setIsNotificationsMenuOpen(false);
                setIsCountryMenuOpen(!isCountryMenuOpen);
              }}
            >
              {selectedCountry === 'Nigeria' ? (
                <NigeriaFlag className='size-[20px]' />
              ) : (
                <SouthAfricaFlag className='size-[20px]' />
              )}
              <ChevronDownIcon className='dark:*:stroke-white' />
            </button>
            {/* Country dropdown */}
            {isCountryMenuOpen && (
              <div
                className='absolute left-0 mt-2 w-[180px] rounded-lg bg-white shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)] dark:bg-dark-secondary'
                ref={countryMenuRef}
              >
                <button
                  className={`flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-primary ${selectedCountry === 'Nigeria' ? 'bg-gray-100 dark:bg-dark-primary' : ''}`}
                  onClick={() => {
                    setSelectedCountry('Nigeria');
                    setIsCountryMenuOpen(false);
                  }}
                >
                  <NigeriaFlag className='size-[20px]' />
                  <span className='text-small dark:text-white'>Nigeria</span>
                </button>
                <button
                  className={`flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-primary ${selectedCountry === 'South Africa' ? 'bg-gray-100 dark:bg-dark-primary' : ''}`}
                  onClick={() => {
                    setSelectedCountry('South Africa');
                    setIsCountryMenuOpen(false);
                  }}
                >
                  <SouthAfricaFlag className='size-[20px]' />
                  <span className='text-small dark:text-white'>South Africa</span>
                </button>
              </div>
            )}
          </div>
          <div className='relative'>
            <button
              aria-label='notifications'
              className={`center-grid size-[32px] rounded-full ${isNotificationsMenuOpen ? 'bg-primary-900 dark:bg-dark-accent' : ''}`}
              ref={notificationsMenuBtnRef}
              onClick={() => setIsNotificationsMenuOpen(!isNotificationsMenuOpen)}
            >
              <NotificationsIcon
                className={`${isNotificationsMenuOpen ? 'fill-white *:*:fill-white *:fill-white' : 'dark:*:fill-white'}`}
              />
            </button>
            {isNotificationsMenuOpen && (
              <div
                className='absolute right-[0px] top-[120%] w-[500px] rounded-lg bg-white shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)] dark:bg-dark-secondary'
                ref={notificationsMenuRef}
              >
                <h5 className='heading-h5 mb-4 border-b border-gray-100 py-[12px] text-center font-medium text-gray-800 dark:border-transparent dark:text-white'>
                  Notifications
                </h5>
                {mockNotifications.length > 0 ? (
                  <>
                    <ul className='flex-column gap-3'>
                      {mockNotifications.map((notification, index) => (
                        <li
                          key={index}
                          className={`flex items-start justify-between p-6 ${notification.status === 'unread' ? 'bg-gray-100 dark:bg-dark-primary' : ''}`}
                        >
                          <div>
                            <p className='text-medium font-medium text-[#333] dark:text-white'>
                              {notification.heading}
                            </p>
                            <p className='text-small text-[#7c7c7c] dark:text-white'>
                              {notification.content}
                            </p>
                          </div>
                          <p className='text-xsmall text-[#a0a0a0] dark:text-white'>
                            {timeAgo(notification.timeStamp)}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className='center-grid mb-10 mt-4 w-full'>
                      <button className='center-grid text-small w-[70%] rounded-lg border border-primary-900 px-6 py-3 font-medium text-primary-900 dark:border-dark-accent dark:text-dark-accent'>
                        See All
                      </button>
                    </div>
                  </>
                ) : (
                  <div className='center-grid h-[400px] w-full'>
                    <div className='flex-column -mt-10 items-center gap-3 text-center'>
                      <EmptyNotificationsIcon />
                      <h6 className='heading-h6 -mt-3 font-medium text-gray-900 dark:text-white'>
                        No Notifications Yet
                      </h6>
                      <p className='text-medium text-[#797979] dark:text-white'>
                        All notifcations will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='relative'>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className='flex items-center gap-2'
              ref={userMenuBtnRef}
            >
              {userDetails?.image ? (
                <Image
                  src={userDetails.image}
                  alt={userDetails.name + 'image'}
                  height={40}
                  width={40}
                  className='size-10 rounded-full object-cover'
                />
              ) : (
                <div className='center-grid relative size-[40px] rounded-full bg-primary-50'>
                  <p className='text-small font-semibold text-[#f56630]'>
                    {userDetails?.name
                      ?.split(' ')
                      .map((item) => <span key={item}>{item.slice(0, 1).toUpperCase()}</span>)}
                  </p>
                </div>
              )}
              <ChevronDownIcon className='dark:*:stroke-white' />
            </button>
            {isUserMenuOpen && (
              <div
                ref={userMenuRef}
                className='absolute right-[0px] top-[120%] w-fit min-w-[210px] rounded bg-white py-[10px] shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)] dark:bg-dark-primary'
              >
                <div className='mb-2 flex items-center gap-1 px-2'>
                  {userDetails?.image ? (
                    <Image
                      src={userDetails.image}
                      alt={userDetails.name + 'image'}
                      height={40}
                      width={40}
                      className='size-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='center-grid relative size-[40px] rounded-full bg-primary-50'>
                      <p className='text-small font-semibold text-[#f56630]'>
                        {userDetails?.name
                          ?.split(' ')
                          .map((item) => <div key={item}>{item.slice(0, 1).toUpperCase()}</div>)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className='text-small font-medium text-gray-800 dark:text-white'>
                      {userDetails?.name}
                    </p>
                    <p className='text-xsmall text-gray-500 dark:text-[#a0a0b2]'>
                      {userDetails?.email}
                    </p>
                  </div>
                </div>
                <Link
                  href={'/dashboard/settings'}
                  className='text-small flex items-center gap-3 bg-[#e7f6ec] px-4 py-[6px] text-[#099137]'
                >
                  <SettingsIcon />
                  <p>Settings</p>
                </Link>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsLoggingOut(true);
                  }}
                  className='w-full'
                >
                  <button
                    className='text-small flex w-full items-center gap-3 px-4 py-[6px]'
                    type='submit'
                  >
                    <LogoutIcon className='dark:*:stroke-[#cb1a14]' />
                    <p className='dark:text-white'>Log Out</p>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </nav>
      {isLoggingOut && (
        <LogoutModal useLogUserOut={useLogUserOut} exitFunction={() => setIsLoggingOut(false)} />
      )}
    </>
  );
};
export default Navbar;
