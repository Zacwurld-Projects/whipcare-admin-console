'use client';

import { fetchFeedbackSuggestions } from '@/app/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import SectionLoader from '../../components/Loaders/SectionLoader';
import FallBackUI from '../FallbackUI';

const SuggestionsPage = () => {
  const [currentPage] = useState(1);

  const useFetchSuggestions = useQuery({
    queryKey: ['fetchSuggestions'],
    queryFn: () => fetchFeedbackSuggestions(currentPage, 15),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchSuggestions.isLoading && useFetchSuggestions.data) setIsInitialLoad(false);
  }, [useFetchSuggestions.isLoading, useFetchSuggestions.data]);

  if (isInitialLoad) return <SectionLoader height='70vh' />;

  if (!useFetchSuggestions.data || useFetchSuggestions.data.data.length < 1)
    return <FallBackUI option='suggestions' />;

  return <div>SuggestionsPage</div>;
};
export default SuggestionsPage;
