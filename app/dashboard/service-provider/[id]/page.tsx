'use client';
import Link from 'next/link';
import PageHeading from '../../components/PageHeading';
import BasicInfo from '../../components/profile/BasicInfo';
import ProfileOptions from '../../components/profile/ProfileOptions';
import { useState } from 'react';
// import ActivityTable from '../../components/tables/ActivityTable';
import HistoryTable from '../../components/tables/HistoryTable';
import Profile from './Profile';
import Payment from './Payment';
import Reviews from './Reviews';
import { useQuery } from '@tanstack/react-query';
import {
  fetchServiceProviderKpis,
  fetchServiceProviderOrders,
  fetchServiceProviderProfile,
} from '@/app/api/apiClient';
import PageLoader from '../../components/Loaders/PageLoader';
import SectionLoader from '../../components/Loaders/SectionLoader';

const ServiceProviderProfilePage = ({ params }: { params: { id: string } }) => {
  const [selectedPageOption, setSelectedPageOption] = useState('profile');
  const pageOptions = ['profile', 'orders'];

  const { data: kpisData, isLoading: isKpisLoading } = useQuery({
    queryKey: ['serviceProviderKpis'],
    queryFn: () => fetchServiceProviderKpis(params.id),
  });

  const { data: profileData, isLoading: isProfileDataLoading } = useQuery({
    queryKey: ['serviceProviderProfile'],
    queryFn: () => fetchServiceProviderProfile(params.id),
  });

  const { data: ordersData, isLoading: isOrdersDataLoading } = useQuery({
    queryKey: ['serviceProviderOrders'],
    queryFn: () => fetchServiceProviderOrders(params.id),
    enabled: selectedPageOption === 'orders',
  });

  return (
    <>
      <PageHeading page='Service Provider Profile' pageFilters />
      {isKpisLoading || isProfileDataLoading ? (
        <PageLoader />
      ) : (
        <>
          <div className='mt-4 flex items-center gap-[10px] text-[#27231f] dark:text-dark-tertiary'>
            <Link href={'/dashboard/service-provider/info'} className='text-medium font-medium'>
              Service provider Info
            </Link>
            <p className='text-medium font-medium'>{'>'}</p>
            <p className='heading-h5 font-medium'>
              {kpisData.userContact.firstName} {kpisData.userContact.lastName}
            </p>
          </div>
          <BasicInfo data={kpisData} />
          <ProfileOptions
            pageOptions={pageOptions}
            selectedPageOption={selectedPageOption}
            setSelectedPageOption={setSelectedPageOption}
          />
          {selectedPageOption === 'profile' && <Profile profileInfo={profileData} />}
          {selectedPageOption === 'orders' &&
            (isOrdersDataLoading ? (
              <SectionLoader height='300px' />
            ) : (
              <HistoryTable
                type='orders'
                userId={params.id}
                heading='Orders History'
                tableHeadings={[
                  'Order ID',
                  'Order Date',
                  'Car serviced',
                  'Address',
                  'Service type',
                  'Status',
                ]}
                tableContent={ordersData.data}
              />
            ))}
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
          {/* {selectedPageOption === 'activities' && (
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
          )} */}
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
      )}
    </>
  );
};
export default ServiceProviderProfilePage;
