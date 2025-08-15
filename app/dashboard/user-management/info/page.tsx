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
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { TableData } from '@/app/types/shared';
import { Suspense } from 'react';
import SpinLoader from '../../components/Loaders/SpinLoader';

dayjs.extend(advancedFormat);

const UserManagementInfo = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [error, setError] = useState<string | null>(null);

  const useFetchUser = useQuery({
    queryKey: ['fetchFullUsers', currentPage, search],
    queryFn: async () => fetchUsers(15, currentPage, search),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchUser.isLoading && useFetchUser.data) setIsInitialLoad(false);
  }, [useFetchUser.isLoading, useFetchUser.data]);

  const [userData, setUserData] = useState<TableData<BaseData>>({
    data: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
  });

  useEffect(() => {
    if (useFetchUser.data) {
      setUserData(useFetchUser.data);
      setError(null);
    }
  }, [useFetchUser.data]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);

    // Update the URL with the search query
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <PageHeading page='User management' />
      <div className='mt-6 w-full'>
        {isInitialLoad ? (
          <SectionLoader height='70vh' />
        ) : (
          <>
            {error && <div className='mb-4 text-red-500'>{error}</div>}
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
              search={search}
              onSearch={handleSearch}
            />
          </>
        )}
      </div>
    </>
  );
};

const UserManagementInfoWithSuspense = () => {
  return (
    <Suspense fallback={<SpinLoader size={30} color='#4A5568' thickness={3} />}>
      <UserManagementInfo />
    </Suspense>
  );
};

export default UserManagementInfoWithSuspense;
