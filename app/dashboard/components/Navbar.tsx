'use client';
import LightModeIcon from '../assets/lightModeIcon.svg';
import ChevronDownIcon from '../assets/chevronDown.svg';
import FlagIcon from '../assets/FlagIcon.svg';
import NotificationsIcon from '../assets/notificationIcon.svg';
import SettingsIcon from '../assets/settingsIcon.svg';
import LogoutIcon from '../assets/LogoutIcon.svg';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useMenu from '@/app/hooks/useMenu';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import HamburgerIcon from '../assets/hamburgerMenuIcon.svg';
import EmptyNotificationsIcon from '../assets/EmptyNotificationsIcon.svg';
import { doLogout } from '@/app/actions/authActions';
import { useGlobalContext } from '@/app/context/AppContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { User } from 'next-auth';

const mockNotifications = [
  {
    heading: 'Booking, a service',
    content: 'Isaac booked a mechanic for a car repair',
    timeStamp: Date.now() - 2 * 60 * 1000,
    status: 'unread',
  },
  {
    heading: 'Loging to the app',
    content: 'Jane logged into account via mobile app',
    timeStamp: Date.now() - 120 * 60 * 1000,
    status: 'unread',
  },
  {
    heading: 'Accepting coupons',
    content: 'John accepted 10% off coupon for service',
    timeStamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    status: 'read',
  },
  {
    heading: 'Brake service order completed',
    content: 'Isaac booked a mechanic for a car repair',
    timeStamp: Date.now() - 13 * 24 * 60 * 60 * 1000,
    status: 'read',
  },
];

const Navbar = () => {
  const { data: session } = useSession({
    required: true, // redirects to login if no session
    onUnauthenticated() {
      window.location.href = '/auth/login';
    },
  });

  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    if (session) {
      setUserDetails(session.user);
    }
  }, [session, setUserDetails]);

  const { setIsSidebarOpen, isSidebarOpen } = useGlobalContext();
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

  const logUserOut = async (e: FormEvent) => {
    e.preventDefault();
    await doLogout();
  };

  return (
    <nav
      className={`sticky top-0 z-50 flex h-[83px] w-full items-center justify-between bg-white px-[15px] shadow-sm`}
    >
      <div className='flex items-center gap-4'>
        <button
          className={`block min-[1100px]:hidden`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <HamburgerIcon className='*:fill-gray-800' />
        </button>
        <div className='flex items-center gap-[12px]'>
          <button className='center-grid peer size-[32px] rounded-full bg-primary-50'>
            <LightModeIcon />
          </button>
          <div className='tooltip center-grid relative w-fit rounded-[4px] bg-primary-900 px-[8px] py-[8px] pl-[10px] text-white opacity-0 shadow-[0px_5.18px_10.36px_-3.98px_rgba(0,0,0,0.25)] transition-opacity duration-200 ease-in peer-hover:opacity-100'>
            <div className='absolute left-[-12px] size-[0px] rotate-[270deg] [border-color:transparent_transparent_#711e00_transparent] [border-width:0_15px_12px_15px]'></div>
            <p className='text-xsmall'>Light Mode</p>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-4 pr-[25px]'>
        <div>
          <button className='flex items-center gap-2'>
            <FlagIcon />
            <ChevronDownIcon />
          </button>
        </div>
        <div className='relative'>
          <button
            aria-label='notifications'
            className={`center-grid size-[32px] rounded-full ${isNotificationsMenuOpen ? 'bg-primary-900' : ''}`}
            ref={notificationsMenuBtnRef}
            onClick={() => setIsNotificationsMenuOpen(!isNotificationsMenuOpen)}
          >
            <NotificationsIcon
              className={`${isNotificationsMenuOpen ? 'fill-white *:*:fill-white *:fill-white' : ''}`}
            />
          </button>
          {isNotificationsMenuOpen && (
            <div
              className='fixed right-[20px] top-[83px] w-[500px] rounded-lg bg-white shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)]'
              ref={notificationsMenuRef}
            >
              <h5 className='heading-h5 mb-4 border-b border-gray-100 py-[12px] text-center font-medium text-gray-800'>
                Notifications
              </h5>
              {mockNotifications.length > 0 ? (
                <>
                  <ul className='flex-column gap-3'>
                    {mockNotifications.map((notification, index) => (
                      <li
                        key={index}
                        className={`flex items-start justify-between p-6 ${notification.status === 'unread' ? 'bg-gray-100' : ''}`}
                      >
                        <div>
                          <p className='text-medium font-medium text-[#333]'>
                            {notification.heading}
                          </p>
                          <p className='text-small text-[#7c7c7c]'>{notification.content}</p>
                        </div>
                        <p className='text-xsmall text-[#a0a0a0]'>
                          {timeAgo(notification.timeStamp)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className='center-grid mb-10 mt-4 w-full'>
                    <button className='center-grid text-small w-[70%] rounded-lg border border-primary-900 px-6 py-3 font-medium text-primary-900'>
                      See All
                    </button>
                  </div>
                </>
              ) : (
                <div className='center-grid h-[400px] w-full'>
                  <div className='flex-column -mt-10 items-center gap-3 text-center'>
                    <EmptyNotificationsIcon />
                    <h6 className='heading-h6 -mt-3 font-medium text-gray-900'>
                      No Notifications Yet
                    </h6>
                    <p className='text-medium text-[#797979]'>All notifcations will appear here</p>
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
            <div className='center-grid relative size-[40px] rounded-full bg-primary-50'>
              <p className='text-small font-semibold text-[#f56630]'>
                {session?.user.name?.slice(0, 2).toUpperCase()}
              </p>
            </div>
            <ChevronDownIcon />
          </button>
          {isUserMenuOpen && (
            <div
              ref={userMenuRef}
              className='fixed right-[20px] top-[74px] rounded bg-white py-[10px] shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)]'
            >
              <div className='mb-2 flex items-center gap-1 px-2'>
                {userDetails?.image ? (
                  <Image
                    src={userDetails.image}
                    alt={userDetails.name + 'image'}
                    height={40}
                    width={40}
                    className='rounded-full'
                  />
                ) : (
                  <div className='center-grid relative size-[40px] rounded-full bg-primary-50'>
                    <p className='text-small font-semibold text-[#f56630]'>
                      {userDetails?.name?.slice(0, 2).toUpperCase()}
                    </p>
                  </div>
                )}
                <div>
                  <p className='text-small font-medium text-gray-800'>{userDetails?.name}</p>
                  <p className='text-xsmall text-gray-500'>{userDetails?.email}</p>
                </div>
              </div>
              <Link
                href={'/dashboard/settings'}
                className='text-small flex items-center gap-3 bg-[#e7f6ec] px-4 py-[6px] text-[#099137]'
              >
                <SettingsIcon />
                <p>Settings</p>
              </Link>
              <form onSubmit={logUserOut}>
                <button className='text-small flex items-center gap-3 px-4 py-[6px]' type='submit'>
                  <LogoutIcon />
                  <p>Log Out</p>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
