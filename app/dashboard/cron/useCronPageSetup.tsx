'use client';
import { CronResponse } from '@/app/lib/mockTypes';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useCronPageSetup = <T,>(
  fetchData: (pageNumber?: number, pageSize?: number) => Promise<CronResponse<T>>,
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const useFetchPageData = useQuery({
    queryKey: ['CronTableData', currentPage],
    queryFn: () => fetchData(currentPage),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (useFetchPageData.data && !useFetchPageData.isLoading) {
      setIsInitialLoad(false);
    }
  }, [useFetchPageData.data, useFetchPageData.isLoading]);

  return { currentPage, setCurrentPage, isInitialLoad, useFetchPageData };
};
export default useCronPageSetup;
