'use client';
import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import Profile from './Profile';
import ActivityTable from '../../components/tables/ActivityTable';
import ProfileOptions from '../../components/profile/ProfileOptions';
import { useQuery } from '@tanstack/react-query';
import {
  fetchUserActivity,
  fetchUserKpis,
  fetchUserProfile,
  fetchUserBookings,
} from '@/app/api/apiClient';
import PageLoader from '../../components/Loaders/PageLoader';
import SectionLoader from '../../components/Loaders/SectionLoader';
import BasicInfo from '../../components/profile/BasicInfoUser';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import BookingsTable from '../../components/tables/components/BookingsTable';

dayjs.extend(advancedFormat);

const DisplayPageOption = ({
  isLoading,
  PageOption,
}: {
  isLoading: boolean;
  PageOption: ReactNode;
}) => {
  if (isLoading) {
    return <SectionLoader height='40vh' spin />;
  }

  return <>{PageOption}</>;
};

const UserProfilePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const pageOptions = ['profile', 'bookings', 'activities'];
  const [selectedPageOption, setSelectedPageOption] = useState('profile');
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const [currentBookingsPage, setCurrentBookingsPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDates, setSelectedDates] = useState<{ minDate: string; maxDate: string }>({
    minDate: '',
    maxDate: '',
  });

  // Sync selectedDates with URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setSelectedDates({
        minDate: params.get('minDate') || '',
        maxDate: params.get('maxDate') || '',
      });
    }
  }, []);

  // Update URL when selectedDates changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (selectedDates.minDate) url.searchParams.set('minDate', selectedDates.minDate);
      else url.searchParams.delete('minDate');
      if (selectedDates.maxDate) url.searchParams.set('maxDate', selectedDates.maxDate);
      else url.searchParams.delete('maxDate');
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [selectedDates, router]);

  const useFetchUserKpis = useQuery({
    queryKey: ['fetchUserKpis', params.id],
    queryFn: () => fetchUserKpis(params.id),
  });

  const useFetchUserProfile = useQuery({
    queryKey: ['fetchUserProfile', params.id],
    queryFn: () => fetchUserProfile(params.id),
    enabled: selectedPageOption === 'profile',
  });

  const useFetchUserActivity = useQuery({
    queryKey: ['fetchUserActivity', params.id, currentActivityPage],
    queryFn: () => fetchUserActivity(params.id, 6, currentActivityPage),
    enabled: selectedPageOption === 'activities',
  });

  const useFetchUserBookings = useQuery({
    queryKey: ['fetchUserBookings', params.id, selectedDates.minDate, selectedDates.maxDate],
    queryFn: () => fetchUserBookings(params.id),
    enabled: selectedPageOption === 'bookings',
  });

  if (useFetchUserKpis.isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <h3 className='heading-h3 font-medium text-gray-800 dark:text-white'>User Profile</h3>
      <div className='mt-4 flex items-center gap-[10px]'>
        <Link
          href={'/dashboard/user-management/info'}
          className='text-medium font-medium text-[#27231f] dark:text-dark-tertiary'
        >
          Users Info
        </Link>
        <p className='text-medium font-medium text-[#27231f] dark:text-dark-tertiary'>{'>'}</p>
        <p className='heading-h5 font-medium text-[#27231f] dark:text-dark-tertiary'>
          {useFetchUserKpis.data?.userContact.firstName}{' '}
          {useFetchUserKpis.data?.userContact.lastName}
        </p>
      </div>
      <BasicInfo data={useFetchUserKpis.data} />
      <ProfileOptions
        pageOptions={pageOptions}
        selectedPageOption={selectedPageOption}
        setSelectedPageOption={setSelectedPageOption}
      />
      {selectedPageOption === 'profile' && (
        <DisplayPageOption
          isLoading={useFetchUserProfile.isLoading}
          PageOption={<Profile userProfile={useFetchUserProfile.data} />}
        />
      )}
      {selectedPageOption === 'bookings' && (
        <DisplayPageOption
          isLoading={useFetchUserBookings.isLoading}
          PageOption={
            <BookingsTable
              heading='Bookings History'
              tableHeadings={[
                'Booking ID',
                'Booking Date',
                'Phone Number',
                'Location',
                'Service Fee',
                'Status',
              ]}
              tableContent={useFetchUserBookings.data?.data || []}
              currentPage={currentBookingsPage}
              setCurrentPage={setCurrentBookingsPage}
              totalCount={useFetchUserBookings.data?.totalCount || 0}
              contentPerPage={useFetchUserBookings.data?.pageSize || 10}
              userId={params.id}
              search={searchTerm}
              setSearch={setSearchTerm}
              onSearch={(value) => setSearchTerm(value)}
            />
          }
        />
      )}
      {selectedPageOption === 'activities' && (
        <DisplayPageOption
          isLoading={useFetchUserActivity.isLoading}
          PageOption={
            <ActivityTable
              currentPage={currentActivityPage}
              setCurrentPage={setCurrentActivityPage}
              tableHeadings={['Activity Type', 'Description', 'Date & time added', 'Status', '']}
              tableContent={useFetchUserActivity.data}
            />
          }
        />
      )}
    </>
  );
};

export default UserProfilePage;
