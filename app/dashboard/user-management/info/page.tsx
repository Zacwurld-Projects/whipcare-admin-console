'use client';
import { fetchUsers } from '@/app/api/apiClient';
import PageHeading from '../../components/PageHeading';
import InfoTable from '../../components/tables/InfoTable';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import SectionLoader from '../../components/Loaders/SectionLoader';

const UserManagementInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const useFetchUser = useQuery({
    queryKey: ['fetchFullUsers', currentPage],
    queryFn: async () => fetchUsers(15, currentPage),
  });

  return (
    <>
      <PageHeading page='User management' />
      <div className='mt-6 w-full'>
        {useFetchUser.isLoading ? (
          <SectionLoader height='70vh' />
        ) : (
          <>
            <InfoTable
              page='user-management'
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              heading='Users Info'
              headings={[
                'No',
                'User name',
                'Email address',
                'Phone',
                'Sign up Date',
                'Last Login Date',
                'Action',
              ]}
              data={useFetchUser.data}
            />
          </>
        )}
      </div>
    </>
  );
};
export default UserManagementInfo;
