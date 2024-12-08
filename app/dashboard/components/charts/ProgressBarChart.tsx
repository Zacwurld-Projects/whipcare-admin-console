'use client';
import { timeAgo } from '@/app/lib/accessoryFunctions';

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

  return (
    <div className='rounded-lg bg-white p-4'>
      <div className='mb-3 flex w-full items-center justify-between border-b border-gray-800 pb-3'>
        <p className='text-medium font-semibold text-gray-800'>{heading}</p>
        <p className='text-xsmall text-gray-600'>Last updated: {timeAgo(timestamp)}</p>
      </div>
      <ul className='flex-column mb-6 mt-8 w-[80%] gap-8'>
        {orderedData.map((data) => (
          <li key={data.title} className='flex justify-between px-1'>
            <p className='text-small text-gray-800'>{data.title}</p>
            <div className='flex items-center gap-3'>
              <div
                style={{ width: `${data.value / 100}px` }}
                className={`w-[${data.value / 100}px] block h-[6px] rounded-md bg-[#983504]`}
              ></div>
              <p className='text-medium font-bold text-gray-900'>{data.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProgressBarChart;
