'use client';
import { useEffect, useState } from 'react';
import PageHeading from '../components/PageHeading';
import { useQuery } from '@tanstack/react-query';
import {
  fetchFeedbackComplaints,
  fetchFeedbackRatings,
  fetchFeedbackReviews,
  fetchFeedbackStats,
  fetchFeedbackSuggestions,
} from '@/app/api/apiClient';
import Ratings from './Ratings';
import Reviews from './Reviews';
import Complaints from './Complaints';
import Suggestions from './Suggestions';

const FeedbacksPage = () => {
  const [stats, setStats] = useState([
    { title: 'ratings', count: 0 },
    { title: 'reviews', count: 0 },
    { title: 'complaint', count: 0 },
    { title: 'suggestion', count: 0 },
  ]);
  const [selectedPageOption, setSelectedPageOption] = useState('ratings');

  const useFetchFeedbackStats = useQuery({
    queryKey: ['fetchFeedbackStats'],
    queryFn: fetchFeedbackStats,
  });

  useEffect(() => {
    if (!useFetchFeedbackStats.isLoading && useFetchFeedbackStats.data) {
      const { data } = useFetchFeedbackStats.data;

      setStats((prev) =>
        prev.map((item) => {
          return {
            title: item.title,
            count: data[`${item.title}Count`],
          };
        }),
      );
    }
  }, [useFetchFeedbackStats]);

  const useFetchSuggestions = useQuery({
    queryKey: ['fetchSuggestions'],
    queryFn: fetchFeedbackSuggestions,
    enabled: selectedPageOption === 'suggestion',
  });
  const useFetchRatings = useQuery({
    queryKey: ['fetchRatings'],
    queryFn: fetchFeedbackRatings,
    enabled: selectedPageOption === 'ratings',
  });
  const useFetchReviews = useQuery({
    queryKey: ['fetchReviews'],
    queryFn: fetchFeedbackReviews,
    enabled: selectedPageOption === 'reviews',
  });
  const useFetchComplaints = useQuery({
    queryKey: ['fetchComplaints'],
    queryFn: fetchFeedbackComplaints,
    enabled: selectedPageOption === 'complaint',
  });

  return (
    <>
      <PageHeading page='Feedbacks' pageFilters />
      <nav className='mt-5 flex items-center gap-3'>
        {stats.map((item) => (
          <button
            className={`flex items-center gap-2 rounded-md border p-3 font-medium ${selectedPageOption === item.title ? 'border-primary-75 bg-[#983504] text-white' : 'border-gray-300 bg-gray-100 text-gray-700'}`}
            key={item.title}
            onClick={() => setSelectedPageOption(item.title)}
          >
            <p className='text-small capitalize'>{item.title}</p>
            <p
              className={`text-xsmall rounded-xl px-2 ${selectedPageOption === item.title ? 'bg-[#f56630]' : 'bg-gray-200'}`}
            >
              {item.count}
            </p>
          </button>
        ))}
      </nav>
      {selectedPageOption === 'ratings' && (
        <Ratings
          ratingsData={useFetchRatings.data?.data || []}
          isLoading={useFetchRatings.isLoading}
        />
      )}
      {selectedPageOption === 'reviews' && (
        <Reviews
          reviewsData={useFetchReviews.data?.data || []}
          isLoading={useFetchReviews.isLoading}
        />
      )}
      {selectedPageOption === 'complaint' && (
        <Complaints
          complaintsData={useFetchComplaints.data?.data || []}
          isLoading={useFetchComplaints.isLoading}
        />
      )}
      {selectedPageOption === 'suggestion' && (
        <Suggestions
          suggestionsData={useFetchSuggestions.data?.data || []}
          isLoading={useFetchSuggestions.isLoading}
        />
      )}
    </>
  );
};
export default FeedbacksPage;
