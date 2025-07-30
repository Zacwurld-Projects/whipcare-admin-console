import React from 'react';
import SectionLoader from '../components/Loaders/SectionLoader';
import FallBackUI from './FallbackUI';
import { renderRatingStars } from '@/app/lib/accessoryFunctions';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import InfoTable from '../components/tables/InfoTable';

dayjs.extend(relativeTime);

type Rating = {
  _id: string;
  userId: string;
  rating: number;
  firstName: string;
  lastName: string;
  providerFirstName: string;
  providerLastName: string;
  bookingId: string;
  serviceType: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

const Ratings = ({
  ratingsData,
  isLoading,
  currentPage,
  setCurrentPage,
  isInitialLoad,
}: {
  ratingsData: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    data: Rating[];
  };
  isLoading: boolean;
  currentPage: number;
  isInitialLoad: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const formatDate = (timestamp: string): string => {
    const date = dayjs(timestamp);
    const now = dayjs();
    const diffDays = now.diff(date, 'day');

    return diffDays > 30 ? date.format('DD MMM, YYYY') : date.fromNow();
  };

  if (isInitialLoad && isLoading) return <SectionLoader height='70vh' />;

  if (!ratingsData || ratingsData.data.length < 1) return <FallBackUI option='ratings' />;

  return (
    <article className='mt-8'>
      <InfoTable
        heading='All Ratings'
        headings={[
          'No',
          'User name',
          'Service provider',
          'Order ID',
          'Service Type',
          'Date',
          'Ratings',
        ]}
        isLoading={isLoading}
        data={ratingsData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ContentStructure={({ item }: { item: Rating }) => (
          <>
            <td className='px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
              {(currentPage - 1) * ratingsData.pageSize + ratingsData.data.indexOf(item) + 1}
            </td>
            <td className='px-4 py-2 text-sm text-blue-600 dark:text-blue-400'>
              {`${item.firstName} ${item.lastName}`}
            </td>
            <td className='px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
              {`${item.providerFirstName} ${item.providerLastName}`}
            </td>
            <td className='px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
              #{item.bookingId}
            </td>
            <td className='px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
              {item.serviceType}
            </td>
            <td className='px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
              {formatDate(item.date)}
            </td>
            <td className='px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
              {renderRatingStars(item.rating)}
            </td>
          </>
        )}
        search=''
        onSearch={() => {}}
        onFilterClick={() => {}}
      />
    </article>
  );
};

export default Ratings;
