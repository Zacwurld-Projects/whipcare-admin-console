'use client';

import { fetchFeedbackSuggestions } from '@/app/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import SectionLoader from '../../components/Loaders/SectionLoader';
import FallBackUI from '../FallbackUI';
import Suggestions from './Suggestions';

const SuggestionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: suggestionsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['fetchSuggestions', currentPage],
    queryFn: () => fetchFeedbackSuggestions(currentPage, 15),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isLoading && suggestionsData) setIsInitialLoad(false);
  }, [isLoading, suggestionsData]);

  if (isInitialLoad && isLoading) return <SectionLoader height='70vh' />;
  if (isError || !suggestionsData || suggestionsData.data.length < 1)
    return <FallBackUI option='suggestions' />;

  return (
    <Suggestions
      suggestionsData={suggestionsData}
      isLoading={isLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      isInitialLoad={isInitialLoad}
    />
  );
};

export default SuggestionsPage;
