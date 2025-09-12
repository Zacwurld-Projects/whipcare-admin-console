'use client';
import { CronResponse } from '@/app/lib/mockTypes';
import { ComponentType, Dispatch } from 'react';
import SpinLoader from '../components/Loaders/SpinLoader';
import TablePagination from '../components/tables/components/TablePagination';
import FilterForm from '../components/tables/components/FilterForm';

const CronTable = <T,>({
  tableResponse,
  tableHeadings,
  heading,
  currentPage,
  setCurrentPage,
  ContentStructure,
  isLoading,
  onClickRows,
}: {
  tableHeadings: string[];
  heading: string;
  tableResponse?: CronResponse<T>;
  isLoading?: boolean;
  onClickRows?: (item: T) => void;
  currentPage: number;
  setCurrentPage: Dispatch<number>;
  ContentStructure: ComponentType<{ item: T; index: number }>;
}) => {
  const contentPerPage = 8;
  const totalCount = tableResponse?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / contentPerPage));

  if (!isLoading && totalCount < 1) {
    return (
      <div>
        <p className='text-xl dark:text-white'>No Activity Yet</p>
      </div>
    );
  }

  return (
    <article className='rounded-lg border border-[#e0ddd9] bg-white dark:border-transparent dark:bg-dark-secondary'>
      <div className='flex items-center justify-between px-6 py-4'>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>{heading}</h2>
        <FilterForm className='w-[50%]' onSearch={() => {}} onFilterClick={() => {}} search='' />
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
              {(tableResponse?.data ?? []).map((item, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    if (onClickRows) onClickRows(item as T);
                  }}
                  className={`[&_td]:text-small [&_:first-child]:rounded-l-lg [&_:last-child]:rounded-r-lg [&_td]:px-6 [&_td]:py-4 [&_td]:text-gray-700 dark:[&_td]:text-white ${onClickRows ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-primary' : ''}`}
                >
                  <ContentStructure item={item as T} index={index} />
                </tr>
              ))}
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
          contentLength={totalCount}
        />
      </div>
    </article>
  );
};
export default CronTable;
