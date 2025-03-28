'use client';

import { fetchFeedbackReviews } from '@/app/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Reviews from './Reviews';

const ReviewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const useFetchReviews = useQuery({
    queryKey: ['fetchReviews'],
    queryFn: () => fetchFeedbackReviews(currentPage, 4),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchReviews.isLoading && useFetchReviews.data) setIsInitialLoad(false);
  }, [useFetchReviews.isLoading, useFetchReviews.data]);

  return (
    <Reviews
      isInitialLoad={isInitialLoad}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      reviewsData={useFetchReviews.data}
      isLoading={useFetchReviews.isLoading}
    />
  );
};
export default ReviewsPage;
