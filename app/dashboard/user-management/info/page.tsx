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
import { BaseData } from '@/app/lib/mockTypes';
import { useRouter } from 'next/navigation';
import { TableData } from '@/app/types/shared';

dayjs.extend(advancedFormat);

const UserManagementInfo = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState<TableData<BaseData>>({
    data: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
  });

  const useFetchUser = useQuery({
    queryKey: ['fetchFullUsers', currentPage],
    queryFn: async () => fetchUsers(15, currentPage),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchUser.isLoading && useFetchUser.data) setIsInitialLoad(false);
  }, [useFetchUser.isLoading, useFetchUser.data]);

  useEffect(() => {
    if (useFetchUser.data) {
      setUserData(useFetchUser.data);
    }
  }, [useFetchUser.data]);

  return (
    <>
      <PageHeading page='User management' />
      <div className='mt-6 w-full'>
        {isInitialLoad ? (
          <SectionLoader height='70vh' />
        ) : (
          <>
            <InfoTable
              onFilterClick={() => {}}
              isLoading={useFetchUser.isLoading}
              onClickRows={(item) => router.push(`/dashboard/user-management/${item._id}`)}
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
              data={userData}
              ContentStructure={({ item, index }) => {
                return (
                  <>
                    <td>{index + 1}</td>
                    <td>
                      {item.firstName} {item.lastName}
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
              search={''}
              onSearch={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          </>
        )}
      </div>
    </>
  );
};
export default UserManagementInfo;
