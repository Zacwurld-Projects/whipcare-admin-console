'use client';
// import Image from 'next/image';
import LogoIcon from '../assets/logo.svg';
import OverviewIcon from '../assets/overviewIcon.svg';
import CronIcon from '../assets/cronIcon.svg';
import ActivityIcon from '../assets/activityIcon.svg';
import AlternateCronIcon from '../assets/alternativeCronIcon.svg';
import CarMgtIcon from '../assets/carMgtIcon.svg';
import FeedbackIcon from '../assets/feedbackIcon.svg';
import FinancialIcon from '../assets/financialIcon.svg';
import MarketIcon from '../assets/marketIcon.svg';
import ServiceBookIcon from '../assets/serviceBookIcon.svg';
import ServiceProIcon from '../assets/serviceProIcon.svg';
import UserMgtIcon from '../assets/userMgtIcon.svg';
import AlternateMarketIcon from '../assets/alternateMarketing.svg';
import AlternateServiceBookIcon from '../assets/alternateServiceIcon.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/app/context/AppContext';
import { useEffect, useRef } from 'react';

const links = [
  {
    icon: OverviewIcon,
    title: 'Overview',
    link: '/',
  },
  {
    icon: UserMgtIcon,
    title: 'User Management',
    link: '/user-management',
  },
  {
    icon: ServiceProIcon,
    title: 'Service Provider',
    link: '/service-provider',
  },
  {
    icon: ServiceBookIcon,
    alternateIcon: AlternateServiceBookIcon,
    title: 'Service Bookings',
    link: '/service-bookings',
  },
  {
    icon: CarMgtIcon,
    title: 'Car Management',
    link: '/car-management',
  },
  {
    icon: ActivityIcon,
    title: 'Activities',
    link: '/activities',
  },
  {
    icon: FeedbackIcon,
    title: 'Feedbacks',
    link: '/feedbacks',
  },
  {
    icon: MarketIcon,
    alternateIcon: AlternateMarketIcon,
    title: 'Marketing',
    link: '/marketing',
  },
  {
    icon: FinancialIcon,
    title: 'Financials',
    link: '/financials',
  },
  {
    icon: CronIcon,
    alternateIcon: AlternateCronIcon,
    title: 'CRON',
    link: '/cron',
  },
];

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useGlobalContext();
  const pathname = usePathname();

  const checkCurrentPage = (path: string) => {
    if (path !== '/') return pathname.split('/').includes(path.split('/')[1]);
    else if (pathname === '/dashboard') return true;
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkClick = (e: MouseEvent) => {
      if (!sidebarRef.current?.contains(e.target as Node)) setIsSidebarOpen(false);
    };

    if (isSidebarOpen) {
      document.addEventListener('click', checkClick);
    }

    return () => document.removeEventListener('click', checkClick);
  }, [sidebarRef, isSidebarOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`sticky right-0 top-0 z-[200] h-screen w-[268px] bg-white transition-transform scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-300 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-w-1 max-[1100px]:fixed max-[1100px]:left-0 ${isSidebarOpen ? 'max-[1100px]:translate-x-[0]' : 'max-[1100px]:-translate-x-[120%]'}`}
    >
      <div className='center-grid h-[131px] w-full bg-primary-900'>
        <LogoIcon />
      </div>
      <div className='mt-4 h-[calc(100vh-140px)] overflow-y-auto scrollbar'>
        <div className='flex-column ml-auto w-[248px] gap-[7px] pb-2'>
          {links.map((item, index) => (
            <Link
              href={`/dashboard${item.link}`}
              key={index}
              className={`group flex w-full items-center gap-[10px] rounded-l-[8px] px-6 py-3 text-gray-500 ${checkCurrentPage(item.link) ? 'bg-primary-900 text-primary-50' : 'hover:bg-gray-200'}`}
            >
              {item.alternateIcon ? (
                checkCurrentPage(item.link) ? (
                  <item.alternateIcon />
                ) : (
                  <item.icon />
                )
              ) : (
                <item.icon
                  className={`${checkCurrentPage(item.link) ? 'fill-primary-50 *:*:fill-primary-50 *:fill-primary-50' : ''}`}
                />
              )}
              <p className='text-medium'>{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
