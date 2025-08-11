'use client';
import BookingsIcon from '../../assets/bookingsIcon.svg';
import SpendingsIcon from '../../assets/spendingsIcon.svg';
import Image from 'next/image';
import KycVerification from './KycVerification';
import { useQuery } from '@tanstack/react-query';
import {
  fetchServiceProviderKyc,
  fetchServiceProviderPayments,
  fetchServiceProviderOrders,
} from '@/app/api/apiClient';
import { InfoIcon, Loader } from 'lucide-react';
import { useState } from 'react';

const BasicInfo = ({
  data: { userContact, totalBookings },
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
    totalSpendings?: number;
  };
}) => {
  const { data: kycData, isLoading: isKycLoading } = useQuery({
    queryKey: ['serviceProviderKyc', userContact._id],
    queryFn: () => fetchServiceProviderKyc(userContact._id),
  });

  // Fetch payment data to calculate total profit from CREDIT transactions
  const { data: paymentsData, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['serviceProviderPayments', userContact._id],
    queryFn: () => fetchServiceProviderPayments(userContact._id),
  });

  // Fetch orders data to calculate booking statistics
  const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['serviceProviderOrders', userContact._id],
    queryFn: () => fetchServiceProviderOrders(userContact._id, '', 1, 100), // Fetch up to 100 orders
  });

  // Calculate total profit from CREDIT transactions
  const totalProfit = paymentsData?.data
    ? paymentsData.data
        .filter((transaction: { type: string }) => transaction.type === 'CREDIT')
        .reduce((sum: number, transaction: { amount: number }) => sum + transaction.amount, 0)
    : 0;

  // Calculate booking statistics
  const bookingsData = [
    {
      title: 'Accepted Bookings',
      count: ordersData?.data
        ? ordersData.data.filter((order: { status: string }) => order.status === 'Payment').length
        : 0,
    },
    {
      title: 'Declined Bookings',
      count: ordersData?.data
        ? ordersData.data.filter((order: { status: string }) => order.status === 'Cancelled').length
        : 0,
    },
    {
      title: 'Ignored Bookings',
      count: ordersData?.data
        ? ordersData.data.filter((order: { status: string }) => order.status === 'Delivered').length
        : 0,
    },
  ];

  const [bookings, setBookings] = useState(false);

  const handleShowTotalBookings = () => {
    setBookings((prev) => !prev);
  };

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
      {isKycLoading || isPaymentsLoading || isOrdersLoading ? (
        <div className='flex flex-1 items-center justify-center'>
          <span className='animate-spin'>
            <Loader />
          </span>
        </div>
      ) : kycData?.data?.kycStatus !== 'Approved' ? (
        <KycVerification serviceProviderId={userContact._id} />
      ) : (
        <div className='flex flex-1 flex-col justify-between gap-2 px-6 py-[50px] pr-[66px] lg:flex-row'>
          <div className='relative flex gap-3'>
            <BookingsIcon />
            <div>
              <p className='text-large text-[#342f2a] dark:text-white'>Total Bookings</p>
              <p className='heading-h4 font-semibold text-[#342f2a] dark:text-dark-tertiary'>
                {totalBookings}
              </p>
            </div>
            <InfoIcon
              onClick={handleShowTotalBookings}
              className='text-[#711E00] dark:text-white'
            />
            {bookings && (
              <div className='absolute right-10 top-10 w-[250px] rounded-md border bg-white py-1 shadow-sm dark:bg-dark-primary'>
                {bookingsData.map((data) => (
                  <div
                    key={data.title}
                    className='flex items-center justify-between gap-10 px-5 py-2 text-sm'
                  >
                    <h1 className='text-gray-400'>{data.title}</h1>
                    <p className='text-[#711E00] dark:text-dark-accent'>{data.count}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='hidden h-full border-r border-[#eceae8] dark:border-gray-200 lg:block'></div>
          <div className='flex gap-3'>
            <SpendingsIcon />
            <div>
              <p className='text-large text-gray-700 dark:text-white'>Total Profit</p>
              <p className='heading-h4 font-semibold text-gray-700 dark:text-dark-tertiary'>
                ₦{totalProfit.toLocaleString('en-NG')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default BasicInfo;
