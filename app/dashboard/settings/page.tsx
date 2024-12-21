'use client';
import { useState } from 'react';
import PageHeading from '../components/PageHeading';
import ProfileOptions from '../components/profile/ProfileOptions';

const SettingsPage = () => {
  const pageOptions = ['profile', 'accessibility', 'notification'];
  const [selectedPageOption, setSelectedPageOption] = useState('profile');

  return (
    <>
      <PageHeading page='Settings' />
      <ProfileOptions
        selectedPageOption={selectedPageOption}
        setSelectedPageOption={setSelectedPageOption}
        pageOptions={pageOptions}
      />
    </>
  );
};
export default SettingsPage;
