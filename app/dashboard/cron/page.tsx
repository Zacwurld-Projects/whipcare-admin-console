'use client';

import { fetchPushNotifications } from '@/app/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import SectionLoader from '../components/Loaders/SectionLoader';
// import ActivityTable from '../components/tables/ActivityTable';
import { useEffect, useState } from 'react';

const CronPage = () => {
  const useFetchNotifications = useQuery({
    queryKey: ['fetchNotifications'],
    queryFn: fetchPushNotifications,
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (useFetchNotifications.data && !useFetchNotifications.isLoading) {
      setIsInitialLoad(false);
    }
  }, [useFetchNotifications.data, useFetchNotifications.isLoading]);

  if (isInitialLoad) return <SectionLoader height='70vh' />;

  return <></>;
};
export default CronPage;
