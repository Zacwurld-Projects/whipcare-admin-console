'use client';
import ExportTable from './components/ExportTable';
import FilterForm from './components/FilterForm';
import DotsIcon from '../../assets/dotsIcon.svg';
import TablePagination from './components/TablePagination';
import { ComponentType, Dispatch } from 'react';
import { UserActivity } from '@/app/lib/mockTypes';
import SpinLoader from '../Loaders/SpinLoader';

function formatTimestampToCustomDate(timestamp: number | string) {
  const date = new Date(timestamp);

  // Format date components
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  // Convert to desired format
  const formatted = date.toLocaleString('en-US', options);
  const [month, year, time] = formatted.split(',');

  return (
    <p>
      {month}, {year} <span className='text-[#d0d5dd]'>|</span> {time}
    </p>
  );
}

const ActivityTable = ({
  tableHeadings,
  tableContent,
  currentPage,
  isLoading,
  setCurrentPage,
  ContentStructure,
}: {
  tableHeadings: string[];
  tableContent: UserActivity;
  isLoading?: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<number>;
  ContentStructure?: ComponentType<{ item: (typeof tableContent.data)[0] }>;
}) => {
  const contentPerPage = 6;
  const totalPages = Math.ceil(tableContent.totalCount / contentPerPage);

  if (tableContent.totalCount < 1) {
    return (
      <div>
        <p className='text-xl dark:text-white'>No Activity Yet</p>
      </div>
    );
  }

  return (
    <article className='rounded-lg border border-[#e0ddd9] bg-white dark:border-transparent dark:bg-dark-secondary'>
      <div className='flex w-full justify-between px-6 py-4'>
        <FilterForm className='w-[50%]' onSearch={() => {}} onFilterClick={() => {}} search='' />
        <ExportTable />
      </div>
      <div className='border-y border-gray-200 px-6 dark:border-[#2c2c3c]'>
        {isLoading ? (
          <div className='center-grid h-[60vh] w-full'>
            <SpinLoader size={100} thickness={2} color='#983504' />
          </div>
        ) : (
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200 bg-gray-50 dark:border-[#2c2c3c] dark:bg-dark-secondary'>
                {tableHeadings.map((item) => (
                  <th
                    key={item}
                    className={`text-xsmall px-6 py-3 text-left font-medium text-gray-700 dark:text-white`}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableContent.data.map((item) => {
                return ContentStructure ? (
                  <ContentStructure item={item} key={item._id} />
                ) : (
                  <tr
                    key={item._id}
                    className='[&_td]:text-small [&_td]:p-6 [&_td]:text-gray-700 dark:[&_td]:text-white'
                  >
                    <td className=' '>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        {item.activityType}
                      </p>
                    </td>
                    <td className='max-w-[200px] text-wrap break-words font-medium'>
                      {item.description}
                    </td>
                    <td>{formatTimestampToCustomDate(item.createdAt)}</td>
                    <td>
                      <p className='text-small w-fit rounded-[12px] bg-primary-50 px-2 py-[2px] text-[#983504]'>
                        Label
                      </p>
                    </td>
                    <td>
                      <button className='center-grid size-8 rounded-lg border border-gray-200 dark:border-dark-primary'>
                        <DotsIcon className='dark:*:fill-white' />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className='px-6'>
        <TablePagination
          contentPerPage={contentPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          contentLength={tableContent.totalCount}
        />
      </div>
    </article>
  );
};
export default ActivityTable;
