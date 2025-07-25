'use client';
// import mockUserImage from '../../assets/mockUserImg.png';
import BookingsIcon from '../../assets/bookingsIcon.svg';
import SpendingsIcon from '../../assets/spendingsIcon.svg';
import Image from 'next/image';
import { useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchServiceProviderKyc } from '@/app/api/apiClient';
// import PageLoader from '../Loaders/PageLoader';
// import { Loader } from 'lucide-react';

const BasicInfo = ({
  data: { userContact, totalBookings, transactions, totalSpendings },
}: {
  data: {
    status: boolean;
    userContact: {
      image: null | string;
      firstName: string;
      lastName: string;
      email: string;
      phone: null | string;
      _id: string;
      kycStatus?: string;
    };
    totalBookings: number;
    transactions?: { totalAmount: number; type: 'DEBIT' | 'CREDIT' }[];
    totalSpendings?: number;
  };
}) => {
  // const {
  //   isLoading,
  //   // error,
  // } = useQuery({
  //   queryKey: ['serviceProviderKyc', userContact._id],
  //   queryFn: () => fetchServiceProviderKyc(userContact._id),
  // });

  useEffect(() => {
    // console.log('userContact._id:', userContact._id);
    // console.log('userContact:', userContact);
    // console.log('KYC Status:', userContact.kycStatus);
  }, [userContact]);

  return (
    <div className='mt-6 flex w-full items-stretch gap-[18px] *:rounded-[5px] *:bg-white dark:*:bg-dark-primary'>
      <div className='flex w-[43%] flex-wrap items-center px-[47.5px] py-8 [column-gap:32px] [row-gap:4px]'>
        {userContact.image ? (
          <Image
            src={userContact.image}
            alt='User Image'
            height={79}
            width={79}
            className='rounded-full'
          />
        ) : (
          <div className='center-grid size-[79px] rounded-full bg-primary-50'>
            <p className='w-fit text-2xl font-semibold text-[#f56630] dark:text-dark-accent'>
              {userContact.firstName.slice(0, 1)}
              {userContact.lastName.slice(0, 1)}
            </p>
          </div>
        )}
        <div>
          <p className='heading-h5 font-semibold text-gray-800 dark:text-white'>
            {userContact.firstName} {userContact.lastName}
          </p>
          <p className='font-medium text-[#413b35] dark:text-dark-tertiary'>{userContact.email}</p>
          {userContact.phone && (
            <p className='font-medium text-[#5a524a] dark:text-dark-tertiary'>
              {userContact.phone}
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-between gap-2 px-6 py-[50px] pr-[66px] lg:flex-row'>
        <div className='flex gap-3'>
          <BookingsIcon />
          <div>
            <p className='text-large text-[#342f2a] dark:text-white'>Total Bookings</p>
            <p className='heading-h4 font-semibold text-[#342f2a] dark:text-dark-tertiary'>
              {totalBookings}
            </p>
          </div>
        </div>
        <div className='hidden h-full border-r border-[#eceae8] dark:border-gray-200 lg:block'></div>
        <div className='flex gap-3'>
          <SpendingsIcon />
          <div>
            <p className='text-large text-gray-700 dark:text-white'>
              {transactions && !totalSpendings ? 'Total Profit' : 'Total Spendings'}
            </p>
            <p className='heading-h4 font-semibold text-gray-700 dark:text-dark-tertiary'>
              ₦
              {transactions && !totalSpendings
                ? transactions[0]?.totalAmount?.toLocaleString('en-US') || 0
                : totalSpendings?.toLocaleString('en-US') || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BasicInfo;
