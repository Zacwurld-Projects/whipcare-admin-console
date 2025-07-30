'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeedbackRatings } from '@/app/api/apiClient';
import FallBackUI from './FallbackUI';
import SectionLoader from '../components/Loaders/SectionLoader';
import Ratings from './Ratings';

const FeedbacksPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const useFetchRatings = useQuery({
    queryKey: ['fetchRatings'],
    queryFn: () => fetchFeedbackRatings(currentPage, 15),
  });

  useEffect(() => {
    if (!useFetchRatings.isLoading && useFetchRatings.data) {
      setIsInitialLoad(false);
    }
  }, [useFetchRatings.isLoading, useFetchRatings.data]);

  if (isInitialLoad) return <SectionLoader height='70vh' />;

  if (!useFetchRatings.data || useFetchRatings.data.data.length < 1) {
    return <FallBackUI option='ratings' />;
  }

  // Transform the API response to match the Ratings component's Rating type
  const transformedRatingsData = {
    ...useFetchRatings.data,
    data: useFetchRatings.data.data.map(
      (item: {
        _id: string;
        bookingId: string;
        rating: number;
        customerFirstName: string;
        customerLastName: string;
        date: string;
        serviceProviderFirstName: string;
        serviceProviderLastName: string;
        serviceType: string;
      }) => ({
        _id: item._id,
        bookingId: item.bookingId, // Using bookingId as a proxy for userId
        rating: item.rating,
        firstName: item.customerFirstName,
        lastName: item.customerLastName,
        providerFirstName: item.serviceProviderFirstName,
        providerLastName: item.serviceProviderLastName,
        serviceType: item.serviceType,
        date: item.date,
        createdAt: item.date, // Assuming date can serve as createdAt
        updatedAt: item.date, // Assuming date can serve as updatedAt
      }),
    ),
  };

  return (
    <Ratings
      ratingsData={transformedRatingsData}
      isLoading={useFetchRatings.isLoading}
      isInitialLoad={isInitialLoad}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default FeedbacksPage;
