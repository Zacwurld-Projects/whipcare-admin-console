import { Dispatch } from 'react';
import SectionLoader from '../../components/Loaders/SectionLoader';
import SpinLoader from '../../components/Loaders/SpinLoader';
// import ExportTable from '../components/tables/components/ExportTable';
import FilterForm from '../../components/tables/components/FilterForm';
import FallBackUI from '../FallbackUI';
import { renderRatingStars } from '@/app/lib/accessoryFunctions';
import TablePagination from '../../components/tables/components/TablePagination';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import useGetBookingDetails from '../../service-bookings/useGetBookingDetails';

dayjs.extend(relativeTime);

type Reviews = {
  _id: string;
  userId: string;
  bookingId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
};

const Reviews = ({
  reviewsData,
  isLoading,
  currentPage,
  setCurrentPage,
  isInitialLoad,
}: {
  reviewsData: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    data: Reviews[];
  };
  isLoading: boolean;
  currentPage: number;
  isInitialLoad: boolean;
  setCurrentPage: Dispatch<number>;
}) => {
  const { openBookingDetailsModal } = useGetBookingDetails();

  if (isInitialLoad && isLoading) return <SectionLoader height='70vh' />;

  const formatDate = (timestamp: string): string => {
    const date = dayjs(timestamp);
    const now = dayjs();
    const diffDays = now.diff(date, 'day');

    return diffDays > 30 ? date.format('DD MMM, YYYY') : date.fromNow();
  };

  if (!reviewsData || reviewsData.data.length < 1) return <FallBackUI option='reviews' />;

  return (
    <article className='mt-8 w-full rounded-lg border border-[#e0ddd9] bg-white py-4 dark:border-transparent dark:bg-dark-secondary'>
      <div className='flex items-center justify-between border-b border-[#f0f2f5] px-6 pb-[16px] dark:border-dark-secondary'>
        <h6 className='heading-h6 font-semibold dark:text-white'>All Reviews</h6>
        <div className='flex w-[60%] justify-end gap-6'>
          <FilterForm className='flex-1' search='' onSearch={() => {}} onFilterClick={() => {}} />
          {/* <ExportTable /> */}
        </div>
      </div>
      <div className='w-full scrollbar'>
        {isLoading ? (
          <div className='center-grid h-[60vh] w-full'>
            <SpinLoader thickness={2} size={80} color='#983504' />
          </div>
        ) : (
          <ul className='flex-column w-full gap-3'>
            {reviewsData.data.map((review) => (
              <li className='flex-column gap-5 px-6 pb-[25px] pt-5' key={review._id}>
                <div className='flex items-center justify-between'>
                  {renderRatingStars(review.rating)}
                  <p className='font-bold text-gray-500 dark:text-white'>
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <p className='text-lg font-bold text-[#475367] dark:text-white'>{review.review}</p>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-[10px]'>
                    <span className='center-grid size-[30px] rounded-full bg-[#8f2802] font-semibold text-primary-50 dark:bg-dark-accent dark:text-white'>
                      J
                    </span>
                    <p className='font-semibold text-[#1d2739] dark:text-white'>John Jane</p>
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
      {reviewsData && (
        <div className='w-full px-6'>
          <TablePagination
            contentLength={reviewsData.totalCount}
            contentPerPage={reviewsData.pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(reviewsData.totalCount / reviewsData.pageSize)}
          />
        </div>
      )}
    </article>
  );
};
export default Reviews;
