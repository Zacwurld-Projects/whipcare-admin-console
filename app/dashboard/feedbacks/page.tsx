'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeedbackRatings } from '@/app/api/apiClient';
import FallBackUI from './FallbackUI';
import SectionLoader from '../components/Loaders/SectionLoader';

const FeedbacksPage = () => {
  const [currentPage] = useState(1);

  const useFetchRatings = useQuery({
    queryKey: ['fetchRatings'],
    queryFn: () => fetchFeedbackRatings(currentPage, 15),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchRatings.isLoading && useFetchRatings.data) setIsInitialLoad(false);
  }, [useFetchRatings.isLoading, useFetchRatings.data]);

  if (isInitialLoad) return <SectionLoader height='70vh' />;

  if (!useFetchRatings.data || useFetchRatings.data.data.length < 1)
    return <FallBackUI option='ratings' />;

  return <div>Ratings</div>;
};
export default FeedbacksPage;
