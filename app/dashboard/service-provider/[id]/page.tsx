/* eslint-disable @typescript-eslint/no-unused-vars */
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
  fetchServiceProviderKyc,
  deactivateServiceProvider,
} from '@/app/api/apiClient';
import PageLoader from '../../components/Loaders/PageLoader';
import SectionLoader from '../../components/Loaders/SectionLoader';
import ActivityTable from '../../components/tables/ActivityTable';
import VerifyIcon from '@/app/dashboard/assets/verify.svg';

const ServiceProviderProfilePage = ({ params }: { params: { id: string } }) => {
  const [selectedPageOption, setSelectedPageOption] = useState('profile');
  const pageOptions = ['profile', 'orders', 'payment', 'activities', 'reviews'];
  const [isDeactivating, setIsDeactivating] = useState(false);

  const { data: kpisData, isLoading: isKpisLoading } = useQuery({
    queryKey: ['serviceProviderKpis'],
    queryFn: () => fetchServiceProviderKpis(params.id),
  });

  // Map _id into userContact for KYC
  const mappedKpisData = kpisData
    ? {
        ...kpisData,
        userContact: {
          _id: kpisData._id || params.id,
          firstName: kpisData.userContact?.firstName || kpisData.firstName,
          lastName: kpisData.userContact?.lastName || kpisData.lastName,
          email: kpisData.userContact?.email || kpisData.email,
          phone: kpisData.userContact?.phone || kpisData.phone,
          image: kpisData.userContact?.image || kpisData.image,
        },
      }
    : null;

  const { data: profileData, isLoading: isProfileDataLoading } = useQuery({
    queryKey: ['serviceProviderProfile'],
    queryFn: () => fetchServiceProviderProfile(params.id),
  });

  const { data: ordersData, isLoading: isOrdersDataLoading } = useQuery({
    queryKey: ['serviceProviderOrders'],
    queryFn: () => fetchServiceProviderOrders(params.id),
    enabled: selectedPageOption === 'orders',
  });

  const { data: kycData, isLoading: isKycLoading } = useQuery({
    queryKey: ['serviceProviderKyc', params.id],
    queryFn: () => fetchServiceProviderKyc(params.id),
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
          <BasicInfo data={mappedKpisData} />
          <ProfileOptions
            pageOptions={pageOptions}
            selectedPageOption={selectedPageOption}
            setSelectedPageOption={setSelectedPageOption}
          />
          {selectedPageOption === 'profile' && (
            <Profile profileInfo={profileData} kycStatus={kycData?.data?.kycStatus} />
          )}
          {selectedPageOption === 'orders' &&
            (kycData?.data?.kycStatus === 'Approved' ? (
              isOrdersDataLoading ? (
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
              )
            ) : (
              <div className='flex min-h-[300px] flex-col items-center justify-center gap-2'>
                <VerifyIcon />

                <h1 className='text-xl dark:text-white'>No info yet</h1>
                <p className='text-base text-gray-500 dark:text-white'>
                  The user has to be verified
                </p>
              </div>
            ))}
          {selectedPageOption === 'payment' &&
            (kycData?.data?.kycStatus === 'Approved' ? (
              isOrdersDataLoading ? (
                <SectionLoader height='300px' />
              ) : (
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
              )
            ) : (
              <div className='flex min-h-[300px] flex-col items-center justify-center gap-2'>
                <VerifyIcon />
                <h1 className='text-xl dark:text-white'>No info yet</h1>
                <p className='text-base text-gray-500 dark:text-white'>
                  The user has to be verified
                </p>
              </div>
            ))}
          {/* {selectedPageOption === 'activities' &&
            (kycData?.data?.kycStatus === 'Approved' ? (
              isOrdersDataLoading ? (
                <SectionLoader height='300px' />
              ) : (
                <ActivityTable
                  tableHeadings={[
                    'Activity Type',
                    'Description',
                    'Date & time added',
                    'Status',
                    '',
                  ]}
                  tableContent={{
                    data: Array.from({ length: 63 }, () => ({
                      activityType: 'Starting a Service',
                      description: 'Started a mechanic for car repair',
                      createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
                      updatedAt: Date.now(),
                      email: 'example@example.com',
                      data: 'Service started successfully',
                      _id: Math.random().toString(36).slice(2),
                    })),
                    totalCount: 63,
                  }}
                  currentPage={1}
                  setCurrentPage={() => {}}
                />
              )
            ) : (
              <div className='flex min-h-[300px] flex-col items-center justify-center gap-2'>
                <VerifyIcon />
                <h1 className='text-xl dark:text-white'>No info yet</h1>
                <p className='text-base text-gray-500 dark:text-white'>
                  The user has to be verified
                </p>
              </div>
            ))} */}
          {selectedPageOption === 'reviews' &&
            (kycData?.data?.kycStatus === 'Approved' ? (
              isOrdersDataLoading ? (
                <SectionLoader height='300px' />
              ) : (
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
              )
            ) : (
              <div className='flex min-h-[300px] flex-col items-center justify-center gap-2'>
                <VerifyIcon />
                <h1 className='text-xl dark:text-white'>No info yet</h1>
                <p className='text-base text-gray-500 dark:text-white'>
                  The user has to be verified
                </p>
              </div>
            ))}
          {kycData?.data?.kycStatus === 'Approved' && (
            <div className='ml-auto mt-6 flex w-fit gap-4'>
              <button className='text-small w-fit self-end rounded-[32px] border border-[#cdc8c2] px-8 py-[10px] font-medium text-[#983504] dark:border-dark-accent dark:text-dark-accent'>
                Delete account
              </button>
              <button
                className='text-small w-fit self-end rounded-[32px] bg-[#983504] px-8 py-[10px] font-medium text-[#f9f8f7] dark:bg-dark-accent'
                onClick={async () => {
                  setIsDeactivating(true);
                  try {
                    await deactivateServiceProvider(params.id);
                    alert('Account deactivated successfully');
                  } catch (error) {
                    alert('Failed to deactivate account');
                  } finally {
                    setIsDeactivating(false);
                  }
                }}
                disabled={isDeactivating}
              >
                {isDeactivating ? 'Deactivating...' : 'Deactivate'}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default ServiceProviderProfilePage;
