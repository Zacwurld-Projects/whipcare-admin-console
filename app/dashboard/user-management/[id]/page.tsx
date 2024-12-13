'use client';
import Link from 'next/link';
import mockUserImage from '../../assets/mockUserImg.png';
import BookingsIcon from '../../assets/bookingsIcon.svg';
import SpendingsIcon from '../../assets/spendingsIcon.svg';
import Image from 'next/image';
import { useState } from 'react';
import Profile from './Profile';
import HistoryTable from '../../components/tables/HistoryTable';
import ActivityTable from '../../components/tables/ActivityTable';

const userProfile = {
  name: 'Isaac Zacwurld',
  email: '',
  phone: '',
  userInfo: {
    'Sign up date': Date.now() - 30 * 24 * 60 * 60 * 1000,
    'Last login date': Date.now() - 24 * 60 * 60 * 1000,
    Nationality: 'nigeria',
    Language: 'english',
  },
  userAddress: {
    home: '290 m near Grand Play Lekki Lagos',
    work: '290 m near Grand Play Lekki Lagos',
    other: '290 m near Grand Play Lekki Lagos',
  },
  cars: ['BMW M6 Coupe LCI 2014', 'Audi Convertible 2009', 'Lexus Rx 350 2023'],
  reviews: Array(12).fill({
    rating: 4,
    content:
      ' John was fantastic! He arrived on time, explained everything clearly, and did a great job changing my oil. I will definitely be using him again.',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
  }) as Array<{
    rating: number;
    content: string;
    timestamp: number;
  }>,
};

const UserProfilePage = () => {
  const pageOptions = ['profile', 'bookings', 'activities'];
  const [selectedPageOption, setSelectedPageOption] = useState('profile');

  return (
    <>
      <h3 className='heading-h3 font-medium text-gray-800'>User Profile</h3>
      <div className='mt-4 flex items-center gap-[10px]'>
        <Link
          href={'/dashboard/user-management'}
          className='text-medium font-medium text-[#27231f]'
        >
          Users Info
        </Link>
        <p className='text-medium font-medium text-[#27231f]'>{'>'}</p>
        <p className='heading-h5 font-medium text-[#27231f]'>Isaac Zacwurld</p>
      </div>
      <div className='mt-6 flex w-full items-stretch gap-[18px] *:rounded-[5px] *:bg-white'>
        <div className='flex w-[43%] items-center gap-8 px-[47.5px] py-8'>
          <Image
            src={mockUserImage}
            alt='Isaac Zacwurlds image'
            height={79}
            width={79}
            className='rounded-full'
          />
          <div>
            <p className='heading-h5 font-semibold text-gray-800'>Isaac Zacwurld</p>
            <p className='font-medium text-[#413b35]'>Isaaczac@gmail.com</p>
            <p className='font-medium text-[#5a524a]'>+1 453 6780 690</p>
          </div>
        </div>
        <div className='flex flex-1 justify-between px-6 py-[50px] pr-[66px]'>
          <div className='flex gap-3'>
            <BookingsIcon />
            <div>
              <p className='text-large text-[#342f2a]'>Total Bookings</p>
              <p className='heading-h4 font-semibold text-[#342f2a]'>48</p>
            </div>
          </div>
          <div className='h-full border-r border-[#eceae8]'></div>
          <div className='flex gap-3'>
            <SpendingsIcon />
            <div>
              <p className='text-large text-gray-700'>Total Spendings</p>
              <p className='heading-h4 font-semibold text-gray-700'>$1240</p>
            </div>
          </div>
        </div>
      </div>
      <div className='text-small my-6 flex w-fit gap-2 rounded-[56px] bg-[#f9f8f7] p-1 font-medium text-gray-500'>
        {pageOptions.map((item) => (
          <button
            key={item}
            onClick={() => setSelectedPageOption(item)}
            className={`rounded-[56px] px-4 py-2 capitalize ${selectedPageOption === item ? 'bg-[#983504] text-white' : ''}`}
          >
            {item}
          </button>
        ))}
      </div>
      {selectedPageOption === 'profile' && <Profile userProfile={userProfile} />}
      {selectedPageOption === 'bookings' && (
        <HistoryTable
          heading='Bookings History'
          tableHeadings={[
            'Booking ID',
            'Booking Date',
            'Phone Number',
            'Location',
            'Service Fee',
            'Status',
          ]}
          tableContent={Array.from({ length: 12 }, (_, i) => {
            return {
              id: '12346WXYZ',
              bookingDate: Date.now() - 20 * 30 * 60 * 60 * 1000,
              phoneNo: '+1 356 786 3732',
              location: '290 m near Grand Play Lekki Lagos',
              status: i > 2 ? 'completed' : 'pending',
              bookingStatus: i > 2 ? 'completed' : '',
              car: 'BMW M6',
              service: 'Mechanic Service',
              serviceType: 'Pick Up Service',
              serviceProvider: 'James Fox',
              brakeServices: '2',
              total: '2.49',
            };
          })}
        />
      )}
      {selectedPageOption === 'activities' && (
        <ActivityTable
          tableHeadings={['Activity Type', 'Description', 'Date & time added', 'Status', '']}
          tableContent={Array.from({ length: 63 }, () => {
            return {
              type: 'Booking a Service',
              description: 'Booked a mechanic for car repair',
              timeStamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
            };
          })}
        />
      )}
    </>
  );
};
export default UserProfilePage;
