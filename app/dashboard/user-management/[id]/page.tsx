'use client';
import Link from 'next/link';
import { useState } from 'react';
import Profile from './Profile';
// import HistoryTable from '../../components/tables/HistoryTable';
import ActivityTable from '../../components/tables/ActivityTable';
// import BasicInfo from '../../components/profile/BasicInfo';
import ProfileOptions from '../../components/profile/ProfileOptions';

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
          href={'/dashboard/user-management/info'}
          className='text-medium font-medium text-[#27231f]'
        >
          Users Info
        </Link>
        <p className='text-medium font-medium text-[#27231f]'>{'>'}</p>
        <p className='heading-h5 font-medium text-[#27231f]'>Isaac Zacwurld</p>
      </div>
      {/* <BasicInfo /> */}
      <ProfileOptions
        pageOptions={pageOptions}
        selectedPageOption={selectedPageOption}
        setSelectedPageOption={setSelectedPageOption}
      />
      {selectedPageOption === 'profile' && <Profile userProfile={userProfile} />}
      {/* {selectedPageOption === 'bookings' && (
        <HistoryTable
          type='users'
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
      )} */}
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
