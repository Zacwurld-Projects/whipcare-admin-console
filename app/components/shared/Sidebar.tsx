'use client';
import { ApplicationRoutes } from '@/app/constants/applicationRoutes';
import { Icons } from '@/app/components/ui/icons';
import Link from 'next/link';
import React from 'react';
import images from '@/public/images';
import { usePathname } from 'next/navigation';
import CustomImage from '@/app/components/ui/image';

const Sidebar = () => {
  const sidebar = [
    {
      icon: <Icons.DashboardIcon />,
      title: 'Dashboard',
      paths: [ApplicationRoutes.Dashboard],
    },
  ];

  const pathname = usePathname();

  return (
    <aside className='w-[20%] overflow-hidden rounded-xl bg-[#0A0A0A]'>
      <div className='thinScrollbar flex h-[calc(100vh_-_16px)] min-w-fit flex-col overflow-y-auto overflow-x-hidden px-6 py-8'>
        <div className='relative mb-16 mt-3 min-h-12 min-w-24'>
          <CustomImage src={images.logo} alt='Logo' className='object-contain' />
        </div>
        <ul className='mb-32 flex w-fit flex-col gap-6'>
          {sidebar.map((navLink) => {
            const isActiveLink = pathname == navLink.paths[0] || navLink.paths.includes(pathname);

            return (
              <li
                key={navLink.title}
                className={`flex items-center justify-between text-white opacity-70 hover:opacity-100 ${isActiveLink ? '!opacity-100' : ''}`}
              >
                <Link
                  href={navLink.paths[0]}
                  className={`flex items-center gap-4 px-2 ${isActiveLink ? 'w-[170px] rounded-xl bg-primary p-2 pr-4 font-normal text-white' : 'bg-transparent'} `}
                >
                  {navLink.icon}
                  <span> {navLink.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
