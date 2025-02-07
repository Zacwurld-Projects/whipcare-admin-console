'use client';

import Image from 'next/image';
import Link from 'next/link';
import ChevronRightIcon from '../../assets/chevronRight.svg';

const RecentProviders = ({
  recentServiceProviders,
}: {
  recentServiceProviders: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    email: string;
  }[];
}) => {
  return (
    <div className='my-8'>
      <div className='flex items-center justify-between'>
        <p className='text-large font-semibold text-gray-900 dark:text-white'>
          Waitlist Service Provider
        </p>
        <button className='text-small flex items-center gap-2 rounded-[6px] bg-[#eb5017] px-3 py-2 font-semibold text-white'>
          <p>Check Spreadsheet</p>
          <ChevronRightIcon className='*:fill-white' />
        </button>
      </div>
      <div className='mt-4 overflow-x-auto rounded-[10px] border border-gray-100 bg-white px-10 py-6 scrollbar dark:border-transparent dark:bg-dark-primary'>
        <ul className='flex w-max min-w-full justify-between gap-8'>
          {recentServiceProviders.map((item, index) => (
            <li key={index}>
              <Link
                href={`/service-provider/${item._id}`}
                className='flex-column items-center gap-2'
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    height={48}
                    width={48}
                    className='rounded-full'
                    alt={`${item.firstName} photo`}
                  />
                ) : (
                  <p className='center-grid size-12 rounded-full bg-primary-50 text-center text-[18px] font-semibold uppercase text-gray-700 dark:text-dark-accent'>
                    {item.firstName.slice(0, 1)}
                    {item.lastName.slice(0, 1)}
                  </p>
                )}
                <div className='text-center'>
                  <p className='text-xsmall font-semibold text-gray-900 dark:text-white'>
                    {item.firstName} {item.lastName}
                  </p>
                  <p className='text-xsmall text-[#98a2b3] dark:text-dark-tertiary'>{item.email}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default RecentProviders;
