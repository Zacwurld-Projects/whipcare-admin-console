'use client';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import { useEffect, useMemo, useState } from 'react';

const fallbackData = [
  {
    title: 'Service completion time',
    value: 8000,
  },
  {
    title: 'Repeat service rate',
    value: 5420,
  },
  {
    title: 'Service cancellation rate',
    value: 3320,
  },
  {
    title: 'Customer satisfaction score',
    value: 2102,
  },
];

type ProgressItem = { title: string; value: number };

const ProgressBarChart = ({
  heading,
  timestamp,
  data,
  isLoading,
}: {
  heading: string;
  timestamp: number | string;
  data?: ProgressItem[];
  isLoading?: boolean;
}) => {
  const items = useMemo<ProgressItem[]>(() => (data && data.length ? data : fallbackData), [data]);
  const orderedData = useMemo(() => [...items].sort((a, b) => b.value - a.value), [items]);

  // Hydration fix: Only show formatted date on client
  const [clientDate, setClientDate] = useState<string | null>(null);
  useEffect(() => {
    setClientDate(timeAgo(timestamp));
  }, [timestamp]);

  return (
    <div className='rounded-lg bg-white p-4 dark:bg-dark-primary'>
      <div className='mb-3 flex w-full items-center justify-between border-b border-gray-800 pb-3 dark:border-white'>
        <p className='text-medium font-semibold text-gray-800 dark:text-white'>{heading}</p>
        <p className='text-xsmall text-gray-600 dark:text-white'>
          {clientDate ? `Last updated: ${clientDate}` : ''}
        </p>
      </div>
      <ul className='flex-column mb-6 mt-8 w-[80%] gap-8'>
        {orderedData.map((row) => (
          <li key={row.title} className='flex justify-between px-1'>
            <p className='text-small text-gray-800 dark:text-white'>
              {isLoading ? (
                <span className='inline-block h-[12px] w-[180px] animate-pulse rounded bg-gray-200 dark:bg-gray-700' />
              ) : (
                row.title
              )}
            </p>
            <div className='flex items-center gap-3'>
              {isLoading ? (
                <span className='inline-block h-[8px] w-[120px] animate-pulse rounded bg-[#f0d2c2] dark:bg-[#3a2419]' />
              ) : (
                <div
                  style={{ width: `${row.value / 100}px` }}
                  className={`w-[${row.value / 100}px] block h-[6px] rounded-md bg-[#983504]`}
                ></div>
              )}
              <p className='text-medium font-bold text-gray-900 dark:text-white'>
                {isLoading ? (
                  <span className='inline-block h-[14px] w-[40px] animate-pulse rounded bg-gray-200 dark:bg-gray-700' />
                ) : (
                  row.value
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProgressBarChart;
