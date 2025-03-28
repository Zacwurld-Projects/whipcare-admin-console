'use client';

import { fetchFeedbackStats } from '@/app/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FeeedbackNav = () => {
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { title: 'ratings', count: 0, path: 'ratings' },
    { title: 'reviews', count: 0, path: 'reviews' },
    { title: 'complaint', count: 0, path: 'complaints' },
    { title: 'suggestion', count: 0, path: 'suggestions' },
  ]);

  const getCurrentPage = () => {
    const routes = pathname.split('/');
    console.log(routes[3] || 'ratings');
    return routes[3] || 'ratings';
  };

  const useFetchFeedbackStats = useQuery({
    queryKey: ['fetchFeedbackStats'],
    queryFn: fetchFeedbackStats,
  });

  useEffect(() => {
    if (!useFetchFeedbackStats.isLoading && useFetchFeedbackStats.data) {
      const { data } = useFetchFeedbackStats.data;

      setStats((prev) =>
        prev.map((item) => {
          return {
            ...item,
            count: data[`${item.title}Count`] || 0,
          };
        }),
      );
    }
  }, [useFetchFeedbackStats.data, useFetchFeedbackStats.isLoading]);

  return (
    <nav className='mt-5 flex items-center gap-3'>
      {stats.map((item) => (
        <Link
          className={`flex items-center gap-2 rounded-md border p-3 font-medium ${getCurrentPage() === item.path ? 'border-primary-75 bg-[#983504] text-white dark:border-[#2c2c3c] dark:bg-dark-accent' : 'border-gray-300 bg-gray-100 text-gray-700 dark:border-[#2c2c3c] dark:bg-dark-primary dark:text-white'}`}
          key={item.title}
          href={`/dashboard/feedbacks${item.path === 'ratings' ? '' : `/${item.path}`}`}
        >
          <p className='text-small capitalize'>{item.title}</p>
          <p
            className={`text-xsmall rounded-xl px-2 dark:text-dark-secondary ${getCurrentPage() === item.path ? 'bg-[#f56630] dark:bg-white' : 'bg-gray-200 dark:bg-white'}`}
          >
            {item.count}
          </p>
        </Link>
      ))}
    </nav>
  );
};
export default FeeedbackNav;
