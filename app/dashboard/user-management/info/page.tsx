'use client';
import { fetchUsers } from '@/app/api/apiClient';
import PageHeading from '../../components/PageHeading';
import InfoTable from '../../components/tables/InfoTable';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import SectionLoader from '../../components/Loaders/SectionLoader';
import OpenLinkIcon from '../../assets/openLinkIcon.svg';
import Link from 'next/link';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const UserManagementInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const useFetchUser = useQuery({
    queryKey: ['fetchFullUsers', currentPage],
    queryFn: async () => fetchUsers(15, currentPage),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchUser.isLoading && useFetchUser.data) setIsInitialLoad(false);
  }, [useFetchUser.isLoading, useFetchUser.data]);

  return (
    <>
      <PageHeading page='User management' />
      <div className='mt-6 w-full'>
        {isInitialLoad ? (
          <SectionLoader height='70vh' />
        ) : (
          <>
            <InfoTable
              isLoading={useFetchUser.isLoading}
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
              ContentStructure={({ item, index }) => {
                return (
                  <>
                    <td>{index + 1}</td>
                    <td>
                      <Link
                        className='hover:underline'
                        href={`/dashboard/user-management/${item._id}`}
                      >
                        {item.firstName} {item.lastName}
                      </Link>
                    </td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td className='capitalize'>{dayjs(item.createdAt).format('MMM Do, YYYY')}</td>
                    <td className='capitalize'>{dayjs(item.lastLogin).format('MMM Do, YYYY')}</td>
                    <td>
                      <Link href={`/dashboard/user-management/${item._id}`}>
                        <OpenLinkIcon />
                      </Link>
                    </td>
                  </>
                );
              }}
            />
          </>
        )}
      </div>
    </>
  );
};
export default UserManagementInfo;
