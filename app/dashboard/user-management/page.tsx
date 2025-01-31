'use client';
import PageHeading from '../components/PageHeading';
import NumbersOverview from '../components/NumbersOverview';
import OpenLinkIcon from '../assets/openLinkIcon.svg';
import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import LineChart from '../components/charts/LineChart';
import UserGrowthChart from '../components/charts/UserGrowthChart';
import ChurnRateChart from '../components/charts/ChurnRateChart';
import CustomerMapping from '../components/charts/CustomerMapping';
import PlainTable from '../components/tables/PlainTable';
import { useState } from 'react';
import useGetOverviewKpis from '@/app/hooks/useGetOverviewKpis';
import { fetchUserManagementKpis, fetchUsers } from '@/app/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import PageLoader from '../components/Loaders/PageLoader';
import Link from 'next/link';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const userManagementStats = [
  {
    icon: BagIcon,
    title: 'Number of Users',
    id: 'user',
    count: 0,
    growth: 0,
  },
  {
    icon: AllMatchIcon,
    title: 'Number of Active Users',
    id: 'activeUser',
    count: 0,
    growth: 0,
  },
  {
    icon: CheckCircleIcon,
    title: 'Number of Inactive Users',
    id: 'inActiveUser',
    count: 0,
    growth: 0,
  },
];

const UserManagementPage = () => {
  const [selectedDates, setSelectedDates] = useState({
    maxDate: '',
    minDate: '',
  });

  const { kpiData, useFetchOverviewKpis } = useGetOverviewKpis(
    userManagementStats,
    selectedDates,
    fetchUserManagementKpis,
  );

  const useFetchUser = useQuery({
    queryKey: ['fetchUsers'],
    queryFn: async () => fetchUsers(15, 1),
  });

  if (useFetchUser.isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <PageHeading page='User management' pageFilters setSelectedDates={setSelectedDates} />
      <NumbersOverview
        stats={kpiData}
        className='mt-8'
        isLoading={useFetchOverviewKpis.isLoading}
      />
      <div className='mb-8 mt-6 grid grid-cols-1 gap-6 min-[850px]:grid-cols-2'>
        <div className='grid grid-flow-row grid-cols-2 gap-x-4 gap-y-8'>
          <LineChart filter className='col-span-2' />
          <div className='col-span-2 flex w-full flex-wrap items-stretch justify-between gap-x-4 *:flex-1 min-[1300px]:*:max-w-[271px]'>
            <UserGrowthChart />
            <ChurnRateChart />
          </div>
        </div>
        <CustomerMapping />
      </div>
      <PlainTable
        page='user-management'
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
        ContentStructure={({ item, index }) => (
          <tr className='[&_td]:text-xsmall border-y border-y-gray-75 [&_td]:px-[14px] [&_td]:py-3 [&_td]:font-medium [&_td]:text-gray-800'>
            <td>{index + 1}</td>
            <td>
              <Link className='hover:underline' href={`/dashboard/user-management/${item._id}`}>
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
          </tr>
        )}
        content={useFetchUser.data.data || {}}
      />
    </>
  );
};
export default UserManagementPage;
