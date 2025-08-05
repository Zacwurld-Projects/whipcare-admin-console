/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Link from 'next/link';
import PageHeading from '../../components/PageHeading';
import BasicInfo from '../../components/profile/BasicInfoProvider';
import ProfileOptions from '../../components/profile/ProfileOptions';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ActivityTable from '../../components/tables/ActivityTable';
import HistoryTable from '../../components/tables/HistoryTable';
import Profile from './Profile';
import Payment from './Payment';
import { useQuery } from '@tanstack/react-query';
import {
  fetchServiceProviderKpis,
  fetchServiceProviderOrders,
  fetchServiceProviderProfile,
  fetchServiceProviderKyc,
  deactivateServiceProvider,
  fetchServiceProvidersActivities,
  fetchServiceProviderReviews,
} from '@/app/api/apiClient';
import PageLoader from '../../components/Loaders/PageLoader';
import SectionLoader from '../../components/Loaders/SectionLoader';
import VerifyIcon from '@/app/dashboard/assets/verify.svg';
import { PaymentInfo } from '@/app/lib/mockTypes';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import ReviewsPage from './Reviews';

dayjs.extend(relativeTime);

type Reviews = {
  _id: string;
  rating: number;
  review: string;
  createdAt: string;
  customerFirstName: string;
  customerLastName: string;
  customerImage: string | null;
  bookingId?: string;
};

type ReviewsData = {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: Reviews[];
};

const ServiceProviderProfilePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPageOption, setSelectedPageOption] = useState('profile');
  const pageOptions = ['profile', 'orders', 'payment', 'activities', 'reviews'];
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // Update URL when search changes
  const updateSearchInURL = (searchValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle search changes
  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
    setCurrentPage(1);
    updateSearchInURL(searchValue);
  };

  const { data: kpisData, isLoading: isKpisLoading } = useQuery({
    queryKey: ['serviceProviderKpis', params.id],
    queryFn: () => fetchServiceProviderKpis(params.id),
  });

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
    queryKey: ['serviceProviderProfile', params.id],
    queryFn: () => fetchServiceProviderProfile(params.id),
  });

  const { data: ordersData, isLoading: isOrdersDataLoading } = useQuery({
    queryKey: ['serviceProviderOrders', params.id, search, currentPage],
    queryFn: () => fetchServiceProviderOrders(params.id, search, currentPage, 10),
    enabled: selectedPageOption === 'orders',
  });

  const { data: kycData } = useQuery({
    queryKey: ['serviceProviderKyc', params.id],
    queryFn: () => fetchServiceProviderKyc(params.id),
  });

  const { data: activitiesData, isLoading: isActivitiesDataLoading } = useQuery({
    queryKey: ['serviceProviderActivities', params.id, currentPage],
    queryFn: () => fetchServiceProvidersActivities(params.id),
    enabled: selectedPageOption === 'activities',
  });

  const { data: reviewsData, isLoading: isReviewsDataLoading } = useQuery({
    queryKey: ['serviceProviderReviews', params.id, currentPage],
    queryFn: () => fetchServiceProviderReviews(params.id),
    enabled: selectedPageOption === 'reviews',
  });

  const paymentInfo: PaymentInfo = profileData?.user?.accountDetails?.[0]
    ? {
        accountName: profileData.user.accountDetails[0].accountName,
        accountNo: profileData.user.accountDetails[0].accountNumber,
        bank: 'Unknown',
        recentTransactions: Array.from({ length: 6 }, () => ({
          title: 'Order #000085752257',
          type: 'Order Payment',
          amount: 326.8,
          date: Date.now() - 30 * 24 * 60 * 60 * 1000,
        })),
      }
    : {
        accountName: 'N/A',
        accountNo: 'N/A',
        bank: 'N/A',
        recentTransactions: [],
      };

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
              {kpisData?.userContact?.firstName} {kpisData?.userContact?.lastName}
            </p>
          </div>
          <BasicInfo data={mappedKpisData} />
          <ProfileOptions
            pageOptions={pageOptions}
            selectedPageOption={selectedPageOption}
            setSelectedPageOption={setSelectedPageOption}
          />
          {selectedPageOption === 'profile' && (
            <Profile
              profileInfo={profileData}
              kycStatus={kycData?.data?.kycStatus}
              providerId={params.id}
            />
          )}
          {selectedPageOption === 'orders' &&
            (kycData?.data?.kycStatus === 'Approved' ? (
              isOrdersDataLoading ? (
                <SectionLoader height='300px' />
              ) : (
                <HistoryTable
                  tableHeadings={[
                    'Order ID',
                    'Order Date',
                    'Car services',
                    'Address',
                    'Service type',
                    'Status',
                  ]}
                  userId={kpisData?.userContact?._id || params.id}
                  heading='Orders History'
                  tableContent={ordersData?.data}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalCount={ordersData?.totalCount}
                  contentPerPage={10}
                  search={search}
                  setSearch={handleSearch}
                  searchInput={search}
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
                <Payment paymentInfo={paymentInfo} />
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
          {selectedPageOption === 'activities' &&
            (kycData?.data?.kycStatus === 'Approved' ? (
              isActivitiesDataLoading ? (
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
                  tableContent={activitiesData || { data: [], totalCount: 0 }}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  isLoading={isActivitiesDataLoading}
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
          {selectedPageOption === 'reviews' &&
            (kycData?.data?.kycStatus === 'Approved' ? (
              isReviewsDataLoading ? (
                <SectionLoader height='300px' />
              ) : (
                <ReviewsPage
                  serviceProviderId={params.id}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
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
