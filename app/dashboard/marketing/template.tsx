'use client';
import { usePathname } from 'next/navigation';
import PageHeading from '../components/PageHeading';
import Link from 'next/link';
import { ReactNode } from 'react';

const pages = [{ page: '', title: 'Email List' }];

const MarketingTemplate = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const checkActive = (page: string | undefined) => {
    const currentPage = pathname.split('/')[3];
    return currentPage === page;
  };

  return (
    <>
      <PageHeading page='Marketing' />
      <div className='mb-8 mt-2 flex'>
        {pages.map((item, index) => (
          <Link
            className={`relative p-4 text-sm font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:border-b ${checkActive(item.page || undefined) ? 'text-[#f56630] after:border-[#f56630]' : 'text-gray-500 after:border-gray-200'}`}
            key={index}
            href={`/dashboard/marketing/${item.page}`}
          >
            {item.title}
          </Link>
        ))}
      </div>
      {children}
    </>
  );
};
export default MarketingTemplate;
