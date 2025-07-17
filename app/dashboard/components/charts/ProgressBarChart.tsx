'use client';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import { useEffect, useState } from 'react';

const data = [
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

const ProgressBarChart = ({
  heading,
  timestamp,
}: {
  heading: string;
  timestamp: number | string;
}) => {
  const orderedData = data.sort((a, b) => b.value - a.value);

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
        {orderedData.map((data) => (
          <li key={data.title} className='flex justify-between px-1'>
            <p className='text-small text-gray-800 dark:text-white'>{data.title}</p>
            <div className='flex items-center gap-3'>
              <div
                style={{ width: `${data.value / 100}px` }}
                className={`w-[${data.value / 100}px] block h-[6px] rounded-md bg-[#983504]`}
              ></div>
              <p className='text-medium font-bold text-gray-900 dark:text-white'>{data.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProgressBarChart;
