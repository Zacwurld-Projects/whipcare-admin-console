'use client';
import { timeAgo } from '@/app/accessoryFunctions';

const CustomerMapping = () => {
  return (
    <div className='rounded-lg bg-white p-4'>
      <div className='mb-3 flex w-full items-center justify-between border-b border-gray-800 pb-3'>
        <p className='text-medium font-semibold text-gray-800'>Customer Mapping</p>
        <p className='text-xsmall text-gray-600'>
          Last updated: {timeAgo(Date.now() - 30 * 24 * 60 * 60 * 1000)}
        </p>
      </div>
    </div>
  );
};
export default CustomerMapping;
