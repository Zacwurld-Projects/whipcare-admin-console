'use client';
import Link from 'next/link';
import PlusIcon from '../assets/plusIcon.svg';
import { usePathname } from 'next/navigation';
import React from 'react';

const pages = [
  { page: '', title: 'Push Notifications' },
  { page: 'rewards', title: 'Reward Center' },
  { page: 'service-provider', title: 'Service Provider Activities' },
  { page: 'campaign', title: 'Customer Retargeting' },
  { page: 'maintenance', title: 'App Maintenance' },
];

const CronTemplate = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const checkActive = (page: string | undefined) => {
    const currentPage = pathname.split('/')[3];
    return currentPage === page;
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-black dark:text-white'>CRON Panel</h2>
        <button className='flex items-center gap-[10px] rounded-[6px] bg-[#eb5017] px-3 py-2'>
          <PlusIcon />
          <p className='text-sm font-semibold text-white'>Use Template</p>
        </button>
      </div>
      <div className='mb-4 mt-2 flex'>
        {pages.map((item, index) => (
          <Link
            className={`relative p-4 text-sm font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:border-b ${checkActive(item.page || undefined) ? 'text-[#f56630] after:border-[#f56630]' : 'text-gray-500 after:border-gray-200'}`}
            key={index}
            href={`/dashboard/cron/${item.page}`}
          >
            {item.title}
          </Link>
        ))}
      </div>
      {children}
    </>
  );
};
export default CronTemplate;
