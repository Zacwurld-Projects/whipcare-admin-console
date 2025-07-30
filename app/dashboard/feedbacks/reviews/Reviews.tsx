'use client';

import { Dispatch, useState, useEffect } from 'react';
import SectionLoader from '../../components/Loaders/SectionLoader';
import SpinLoader from '../../components/Loaders/SpinLoader';
import FilterForm from '../../components/tables/components/FilterForm';
import FallBackUI from '../FallbackUI';
import { renderRatingStars } from '@/app/lib/accessoryFunctions';
import TablePagination from '../../components/tables/components/TablePagination';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import useGetBookingDetails from '../../service-bookings/useGetBookingDetails';
import { getFeedbackReviewsLandingPage, publishFeedbackReviews } from '@/app/api/apiClient';

dayjs.extend(relativeTime);

type Reviews = {
  _id: string;
  userId: string;
  bookingId: string;
  rating: number;
  firstName: string;
  lastName: string;
  review: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  showOnLandingPage?: boolean;
};

type ReviewsData = {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: Reviews[];
};

const Reviews = ({
  reviewsData,
  isLoading,
  currentPage,
  setCurrentPage,
  isInitialLoad,
}: {
  reviewsData: ReviewsData;
  isLoading: boolean;
  currentPage: number;
  isInitialLoad: boolean;
  setCurrentPage: Dispatch<number>;
}) => {
  const { openBookingDetailsModal } = useGetBookingDetails();
  const [publishing, setPublishing] = useState<{ [key: string]: boolean }>({});
  const [localReviewsData, setLocalReviewsData] = useState<ReviewsData>(reviewsData);

  const [landingPageReviewIds, setLandingPageReviewIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Update local data when reviewsData changes
    setLocalReviewsData(reviewsData);

    // Fetch landing page review IDs once
    const fetchLandingPageReviews = async () => {
      try {
        const res = await getFeedbackReviewsLandingPage();
        if (res?.status && Array.isArray(res.data)) {
          const ids = res.data.map((r: Reviews) => r._id);
          setLandingPageReviewIds(new Set(ids));
        }
      } catch (err) {
        console.error('Error fetching landing page reviews:', err);
      }
    };

    fetchLandingPageReviews();
  }, [reviewsData]);

  const togglePublish = async (reviewId: string, currentStatus: boolean) => {
    setPublishing((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const response = await publishFeedbackReviews(reviewId, !currentStatus);
      if (response?.status && response.data) {
        const updated = response.data;
        setLocalReviewsData((prev) => ({
          ...prev,
          data: prev.data.map((r) =>
            r._id === reviewId ? { ...r, showOnLandingPage: updated.showOnLandingPage } : r,
          ),
        }));
        setLandingPageReviewIds((prev) => {
          const newSet = new Set(prev);
          if (updated.showOnLandingPage) {
            newSet.add(reviewId);
          } else {
            newSet.delete(reviewId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to update publish status:', error);
    } finally {
      setPublishing((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const formatDate = (timestamp: string): string => {
    const date = dayjs(timestamp);
    const now = dayjs();
    const diffDays = now.diff(date, 'day');
    return diffDays > 30 ? date.format('DD MMM, YYYY') : date.fromNow();
  };

  if (isInitialLoad && isLoading) return <SectionLoader height='70vh' />;
  if (!localReviewsData || localReviewsData.data.length < 1) return <FallBackUI option='reviews' />;

  return (
    <article className='mt-8 w-full rounded-lg border border-[#e0ddd9] bg-white py-4 dark:border-transparent dark:bg-dark-secondary'>
      <div className='flex items-center justify-between border-b border-[#f0f2f5] px-6 pb-[16px] dark:border-dark-secondary'>
        <h6 className='heading-h6 font-semibold dark:text-white'>All Reviews</h6>
        <div className='flex w-[60%] justify-end gap-6'>
          <FilterForm className='flex-1' search='' onSearch={() => {}} onFilterClick={() => {}} />
        </div>
      </div>
      <div className='w-full scrollbar'>
        {isLoading ? (
          <div className='center-grid h-[60vh] w-full'>
            <SpinLoader thickness={2} size={80} color='#983504' />
          </div>
        ) : (
          <ul className='flex w-full flex-col gap-3'>
            {localReviewsData.data.map((review) => (
              <li className='flex flex-col gap-5 px-6 pb-[25px] pt-5' key={review._id}>
                <div className='flex items-center justify-between'>
                  <div>{renderRatingStars(review.rating)}</div>
                  <div className='flex items-center gap-4'>
                    <p className='font-bold text-gray-500 dark:text-white'>
                      {formatDate(review.date)}
                    </p>
                    <label className='relative inline-flex cursor-pointer items-center'>
                      <input
                        type='checkbox'
                        // checked={review.showOnLandingPage ?? false}
                        // onChange={() =>
                        //   togglePublish(review._id, review.showOnLandingPage ?? false)
                        // }
                        checked={landingPageReviewIds.has(review._id)}
                        onChange={() =>
                          togglePublish(review._id, landingPageReviewIds.has(review._id))
                        }
                        className='peer sr-only'
                        disabled={publishing[review._id]}
                      />
                      <div className='peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[""] peer-checked:bg-brown-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800'></div>
                    </label>
                  </div>
                </div>
                <p className='text-lg font-bold text-[#475367] dark:text-white'>{review.review}</p>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-[10px]'>
                    <span className='center-grid size-[30px] rounded-full bg-[#8f2802] font-semibold text-primary-50 dark:bg-dark-accent dark:text-white'>
                      {review.firstName.charAt(0)}
                    </span>
                    <p className='font-semibold text-[#1d2739] dark:text-white'>
                      {review.firstName} {review.lastName}
                    </p>
                  </div>
                  <button
                    onClick={() => openBookingDetailsModal(review.bookingId)}
                    className='rounded-xl bg-primary-50 px-4 py-1 text-sm font-semibold text-[#983504] dark:bg-white dark:text-dark-accent'
                  >
                    Track booking
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {localReviewsData && (
        <div className='w-full px-6'>
          <TablePagination
            contentLength={localReviewsData.totalCount}
            contentPerPage={localReviewsData.pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(localReviewsData.totalCount / localReviewsData.pageSize)}
          />
        </div>
      )}
    </article>
  );
};

export default Reviews;
