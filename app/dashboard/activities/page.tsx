'use client';
import PageHeading from '../components/PageHeading';
import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import NumbersOverview from '../components/NumbersOverview';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities, fetchActivityKpis } from '@/app/api/apiClient';
import { useEffect, useState } from 'react';
import ActivityTable from '../components/tables/ActivityTable';
import { Activity } from '@/app/lib/mockTypes';
import Image from 'next/image';
import dayjs from 'dayjs';
import PageLoader from '../components/Loaders/PageLoader';

const activityKpis = [
  {
    icon: BagIcon,
    title: 'Total activities',
    id: 'totalActivites',
    count: 0,
  },
  {
    icon: CheckCircleIcon,
    title: 'Total completed service',
    id: 'totalCompletedServices',
    count: 0,
  },
  {
    icon: CheckCircleIcon,
    title: 'Total active provider',
    id: 'activeServiceProviders',
    count: 0,
  },
  {
    icon: AllMatchIcon,
    title: 'Total pending request',
    id: 'pendingRequests',
    count: 0,
  },
];

const ActivitiesPage = () => {
  const [kpiData, setKpiData] = useState(activityKpis);
  const [currentPage, setCurrentPage] = useState(1);

  const useFetchActivityKpis = useQuery({
    queryKey: ['fetchActivityKpis'],
    queryFn: () => fetchActivityKpis(),
  });

  const useFetchActivities = useQuery({
    queryKey: ['fetchActivities', currentPage],
    queryFn: () => fetchActivities(undefined, currentPage),
  });

  useEffect(() => {
    if (useFetchActivityKpis.data) {
      setKpiData((prev) => {
        return prev.map((item) => {
          return { ...item, count: useFetchActivityKpis.data.data[item.id] };
        });
      });
    }
  }, [useFetchActivityKpis.data]);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchActivities.isLoading && useFetchActivities.data) {
      setIsInitialLoad(false);
    }
  }, [useFetchActivities.isLoading, useFetchActivities.data]);

  if (isInitialLoad) return <PageLoader />;

  return (
    <>
      <PageHeading page='Activities' />
      <NumbersOverview
        isLoading={useFetchActivityKpis.isLoading}
        stats={kpiData}
        className='my-8'
      />
      <ActivityTable
        tableHeadings={['Name', 'User', 'Activity Type', 'Description', 'Date & time added']}
        tableContent={useFetchActivities.data || {}}
        isLoading={useFetchActivities.isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ContentStructure={({ item }: { item: Activity }) => {
          return (
            <tr key={item._id} className='[&_td]:text-small [&_td]:p-6 [&_td]:text-gray-700'>
              <td className='flex items-center gap-3'>
                {item.data?.user?.image ? (
                  <Image
                    height={40}
                    className='size-10 object-cover'
                    width={40}
                    src={item.data.user.image}
                    alt={item.data.user.firstName + ' picture'}
                  />
                ) : (
                  <div className='center-grid size-10 rounded-full bg-primary-50'>
                    <p className='text-xs font-semibold text-[#f56630]'>
                      {item.data?.user?.firstName.slice(0, 1)}
                      {item.data?.user?.lastName.slice(0, 1)}
                    </p>
                  </div>
                )}
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {item.data?.user?.firstName} {item.data?.user?.lastName}
                  </p>
                  <p className='text-sm text-gray-500'>{item.email}</p>
                </div>
              </td>
              <td>
                <p className='font-medium text-gray-900'>{item.data?.user?.type}</p>
              </td>
              <td className=' '>
                <p className='font-medium text-gray-900'>{item.activityType}</p>
              </td>
              <td className='max-w-[200px] break-words text-xs font-medium'>{item.description}</td>
              <td>{dayjs(item.createdAt).format('MMM DD YYYY | hh:mm A')}</td>
            </tr>
          );
        }}
      />
    </>
  );
};
export default ActivitiesPage;
