'use client';
import { fetchFeedbackComplaints } from '@/app/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Complaints from './Complaints';

const ComplaintsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const useFetchComplaints = useQuery({
    queryKey: ['fetchComplaints'],
    queryFn: () => fetchFeedbackComplaints(currentPage, 8),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchComplaints.isLoading && useFetchComplaints.data) setIsInitialLoad(false);
  }, [useFetchComplaints.isLoading, useFetchComplaints.data]);

  return (
    <Complaints
      complaintsData={useFetchComplaints.data}
      isLoading={useFetchComplaints.isLoading}
      isInitialLoad={isInitialLoad}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};
export default ComplaintsPage;
