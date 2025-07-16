'use client';
import { useState } from 'react';
import PageHeading from '../components/PageHeading';
import ProfileOptions from '../components/profile/ProfileOptions';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminMembers, fetchSettingsProfile } from '@/app/api/apiClient';
import Profile from './Profile';
import Accessibility from './Accessibility';
import SectionLoader from '../components/Loaders/SectionLoader';

const SettingsPage = () => {
  const pageOptions = ['profile', 'accessibility', 'notification'];
  const [selectedPageOption, setSelectedPageOption] = useState('profile');
  const { isLoading: isProfileLoading, data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchSettingsProfile,
    enabled: selectedPageOption === 'profile',
  });
  const { isLoading: isMembersDataLoading, data: membersData } = useQuery({
    queryKey: ['getMembers'],
    queryFn: fetchAdminMembers,
    enabled: selectedPageOption === 'accessibility',
  });
  const {
    isLoading: isNotificationDataLoading,
    // , data: notificationData
  } = useQuery({
    queryKey: ['getMembers'],
    queryFn: fetchAdminMembers,
    enabled: selectedPageOption === 'accessibility',
  });

  const isFetchingPageDetails =
    isProfileLoading || isMembersDataLoading || isNotificationDataLoading;

  return (
    <>
      <PageHeading page='Settings' />
      <ProfileOptions
        selectedPageOption={selectedPageOption}
        setSelectedPageOption={setSelectedPageOption}
        pageOptions={pageOptions}
      />
      <section className='mt-2 min-h-[80vh] bg-white p-6 dark:bg-[#2c2c3c]'>
        {isFetchingPageDetails ? (
          <SectionLoader height='80vh' />
        ) : (
          <>
            {selectedPageOption === 'profile' && <Profile profileData={profile.data} />}
            {selectedPageOption === 'accessibility' && (
              <Accessibility membersData={membersData.data} />
            )}
            {selectedPageOption === 'notification' && (
              // <Accessibility membersData={membersData.data} />
              <></>
            )}
          </>
        )}
      </section>
    </>
  );
};
export default SettingsPage;
