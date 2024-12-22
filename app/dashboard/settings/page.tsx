'use client';
import { useState } from 'react';
import PageHeading from '../components/PageHeading';
import ProfileOptions from '../components/profile/ProfileOptions';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminMembers, fetchSettingsProfile } from '@/app/api/apiClient';
import SpinLoader from '../components/SpinLoader';
import Profile from './Profile';
import Accessibility from './Accessibility';

const Loader = () => {
  return (
    <div className='center-grid h-[80vh] w-full'>
      <SpinLoader size={72} color='#983504' thickness={2} />
    </div>
  );
};

const SettingsPage = () => {
  const pageOptions = ['profile', 'accessibility'];
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

  const isFetchingPageDetails = isProfileLoading || isMembersDataLoading;

  return (
    <>
      <PageHeading page='Settings' />
      <ProfileOptions
        selectedPageOption={selectedPageOption}
        setSelectedPageOption={setSelectedPageOption}
        pageOptions={pageOptions}
      />
      <section className='mt-2 min-h-[80vh] bg-white p-6'>
        {isFetchingPageDetails ? (
          <Loader />
        ) : (
          <>
            {selectedPageOption === 'profile' && <Profile profileData={profile.data} />}
            {selectedPageOption === 'accessibility' && (
              <Accessibility membersData={membersData.data} />
            )}
          </>
        )}
      </section>
    </>
  );
};
export default SettingsPage;
