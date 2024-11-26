'use client';
// import Image from 'next/image';
import LogoIcon from '../assets/logo.svg';
import OverviewIcon from '../assets/overviewIcon.svg';
import ActivityIcon from '../assets/activityIcon.svg';
import AnalyticsIcon from '../assets/analyticIcon.svg';
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
    icon: AnalyticsIcon,
    title: 'Analytics',
    link: '/analytics',
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className='relative left-0 top-0 h-[100vh] w-[268px]'>
      <div className='center-grid h-[131px] w-full bg-primary-900'>
        {/* <Image
          src={'/images/png/logo.png'}
          alt='Whipcare logo'
          height={268}
          width={131}
          className='border object-contain'
        /> */}
        <LogoIcon />
      </div>
      <div className='flex-column ml-auto mt-4 w-[248px] gap-[7px]'>
        {links.map((item, index) => (
          <Link
            href={`/dashboard${item.link}`}
            key={index}
            className={`group flex w-full items-center gap-[10px] rounded-l-[8px] px-6 py-3 text-gray-500 ${pathname.split('/').includes(item.link.split('/')[1]) ? 'bg-primary-900 text-primary-50' : 'hover:bg-gray-200'}`}
          >
            {item.alternateIcon ? (
              pathname.split('/').includes(item.link.split('/')[1]) ? (
                <item.alternateIcon />
              ) : (
                <item.icon />
              )
            ) : (
              <item.icon
                className={`${pathname.split('/').includes(item.link.split('/')[1]) ? 'fill-primary-50 *:*:fill-primary-50 *:fill-primary-50' : ''}`}
              />
            )}
            <p className='text-medium'>{item.title}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;
