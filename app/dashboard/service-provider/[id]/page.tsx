'use client';
import Link from 'next/link';
import PageHeading from '../../components/PageHeading';
import BasicInfo from '../../components/profile/BasicInfo';
import ProfileOptions from '../../components/profile/ProfileOptions';
import { useState } from 'react';
import ActivityTable from '../../components/tables/ActivityTable';
import HistoryTable from '../../components/tables/HistoryTable';
import Profile from './Profile';
import mockServiceImage from '../../assets/mockServiceImage.png';
import Payment from './Payment';
import Reviews from './Reviews';

const serviceProviderData = {
  name: 'Isaac Zacwurld',
  email: '',
  status: 'verified',
  phone: '',
  userInfo: {
    'Sign up date': Date.now() - 30 * 24 * 60 * 60 * 1000,
    'Last login date': Date.now() - 24 * 60 * 60 * 1000,
    Nationality: 'nigeria',
    NIN: '123456789',
    Language: 'english',
  },
  userAddress: {
    work: '290 m near Grand Play Lekki Lagos',
  },
  servicesProvided: {
    type: 'Mechanics',
    brand: 'All Car Brands',
    services: Array.from({ length: 3 }, () => {
      return {
        image: mockServiceImage,
        price: '12,000',
        title: 'Brake services',
        type: 'mechanic service',
        distance: '10 km',
        time: '10 mins',
      };
    }),
  },
};

const ServiceProviderProfilePage = () => {
  const [selectedPageOption, setSelectedPageOption] = useState('profile');
  const pageOptions = ['profile', 'orders', 'payment', 'activities', 'reviews'];

  return (
    <>
      <PageHeading page='Service Provider Profile' pageFilters />
      <div className='mt-4 flex items-center gap-[10px]'>
        <Link
          href={'/dashboard/service-provider/info'}
          className='text-medium font-medium text-[#27231f]'
        >
          Service provider Info
        </Link>
        <p className='text-medium font-medium text-[#27231f]'>{'>'}</p>
        <p className='heading-h5 font-medium text-[#27231f]'>Isaac Zacwurld</p>
      </div>
      <BasicInfo />
      <ProfileOptions
        pageOptions={pageOptions}
        selectedPageOption={selectedPageOption}
        setSelectedPageOption={setSelectedPageOption}
      />
      {selectedPageOption === 'profile' && <Profile profileInfo={serviceProviderData} />}
      {selectedPageOption === 'orders' && (
        <HistoryTable
          type='orders'
          heading='Orders History'
          tableHeadings={[
            'Order ID',
            'Order Date',
            'Car serviced',
            'Address',
            'Service type',
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
      {selectedPageOption === 'payment' && (
        <Payment
          paymentInfo={{
            accountName: 'Isaac Whipcare',
            accountNo: '100678934',
            bank: 'Opay',
            recentTransactions: Array.from({ length: 6 }, () => {
              return {
                title: 'Order #000085752257',
                type: 'Order Payment',
                amount: 326.8,
                date: Date.now() - 30 * 24 * 60 * 60 * 1000,
              };
            }),
          }}
        />
      )}
      {selectedPageOption === 'activities' && (
        <ActivityTable
          tableHeadings={['Activity Type', 'Description', 'Date & time added', 'Status', '']}
          tableContent={Array.from({ length: 63 }, () => {
            return {
              type: 'Starting a Service',
              description: 'Started a mechanic for car repair',
              timeStamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
            };
          })}
        />
      )}
      {selectedPageOption === 'reviews' && (
        <Reviews
          reviewData={Array.from({ length: 8 }, () => {
            return {
              rating: 4,
              booking: {
                id: '12346WXYZ',
                bookingDate: Date.now() - 20 * 30 * 60 * 60 * 1000,
                phoneNo: '+1 356 786 3732',
                location: '290 m near Grand Play Lekki Lagos',
                status: 'completed',
                bookingStatus: 'completed',
                car: 'BMW M6',
                service: 'Mechanic Service',
                serviceType: 'Pick Up Service',
                serviceProvider: 'James Fox',
                brakeServices: '2',
                total: '2.49',
              },
              date: Date.now() - 2 * 24 * 60 * 60 * 1000,
              content:
                "The service provider was professional and completed the work quickly. However, they didn't explain the additional charges beforehand",
              user: 'Mary Smith',
            };
          })}
        />
      )}
    </>
  );
};
export default ServiceProviderProfilePage;
