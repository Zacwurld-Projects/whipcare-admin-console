'use client';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import Profile from './Profile';
// import HistoryTable from '../../components/tables/HistoryTable';
import ActivityTable from '../../components/tables/ActivityTable';
import BasicInfo from '../../components/profile/BasicInfo';
import ProfileOptions from '../../components/profile/ProfileOptions';
import { useQuery } from '@tanstack/react-query';
import { fetchUserActivity, fetchUserKpis, fetchUserProfile } from '@/app/api/apiClient';
import PageLoader from '../../components/Loaders/PageLoader';
import SectionLoader from '../../components/Loaders/SectionLoader';

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
  const pageOptions = ['profile', 'activities']; //removed bookings
  const [selectedPageOption, setSelectedPageOption] = useState('profile');
  const [currentActivitypage, setCurrentActivityPage] = useState(1);

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
    queryKey: ['fetchUserActivity', params.id, currentActivitypage],
    queryFn: () => fetchUserActivity(params.id, 6, currentActivitypage),
    enabled: selectedPageOption === 'activities',
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
          {useFetchUserKpis.data.userContact.firstName} {useFetchUserKpis.data.userContact.lastName}
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
        <DisplayPageOption
          isLoading={useFetchUserActivity.isLoading}
          PageOption={
            <ActivityTable
              currentPage={currentActivitypage}
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
