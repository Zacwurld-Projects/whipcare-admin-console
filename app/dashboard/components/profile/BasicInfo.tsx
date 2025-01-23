'use client';
import mockUserImage from '../../assets/mockUserImg.png';
import BookingsIcon from '../../assets/bookingsIcon.svg';
import SpendingsIcon from '../../assets/spendingsIcon.svg';
import Image from 'next/image';

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
    };
    totalBookings: number;
    transactions?: { totalAmount: number; type: 'DEBIT' | 'CREDIT' }[];
    totalSpendings?: number;
  };
}) => {
  return (
    <div className='mt-6 flex w-full items-stretch gap-[18px] *:rounded-[5px] *:bg-white'>
      <div className='flex w-[43%] flex-wrap items-center px-[47.5px] py-8 [column-gap:32px] [row-gap:4px]'>
        {userContact.image ? (
          <Image
            src={mockUserImage}
            alt='Isaac Zacwurlds image'
            height={79}
            width={79}
            className='rounded-full'
          />
        ) : (
          <div className='center-grid size-[79px] rounded-full bg-primary-50'>
            <p className='w-fit text-2xl font-semibold text-[#f56630]'>
              {userContact.firstName.slice(0, 1)}
              {userContact.lastName.slice(0, 1)}
            </p>
          </div>
        )}
        <div>
          <p className='heading-h5 font-semibold text-gray-800'>
            {userContact.firstName} {userContact.lastName}
          </p>
          <p className='font-medium text-[#413b35]'>{userContact.email}</p>
          {userContact.phone && <p className='font-medium text-[#5a524a]'>{userContact.phone}</p>}
        </div>
      </div>
      <div className='flex flex-1 flex-col justify-between gap-2 px-6 py-[50px] pr-[66px] lg:flex-row'>
        <div className='flex gap-3'>
          <BookingsIcon />
          <div>
            <p className='text-large text-[#342f2a]'>Total Bookings</p>
            <p className='heading-h4 font-semibold text-[#342f2a]'>{totalBookings}</p>
          </div>
        </div>
        <div className='hidden h-full border-r border-[#eceae8] lg:block'></div>
        <div className='flex gap-3'>
          <SpendingsIcon />
          <div>
            <p className='text-large text-gray-700'>
              {transactions && !totalSpendings ? 'Total Profit' : 'Total Spendings'}
            </p>
            <p className='heading-h4 font-semibold text-gray-700'>
              ₦
              {transactions && !totalSpendings
                ? transactions[0].totalAmount.toLocaleString('en-US')
                : totalSpendings?.toLocaleString('en-US')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BasicInfo;
