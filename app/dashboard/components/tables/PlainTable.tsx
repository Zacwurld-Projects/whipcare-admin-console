'use client';
import { EmptyStateProps, TableData } from '@/app/types/shared';
import Link from 'next/link';
import { ComponentType } from 'react';
import EmptyStateIcon from '../../assets/profileEmptyStateIcon.svg';
import TableEmptyState from '../empty-states/TableEmptyState';
import SpinLoader from '../Loaders/SpinLoader';

interface PlainTableProps<T> {
  page: string;
  heading: string;
  emptyStateProps?: EmptyStateProps;
  isLoading?: boolean;
  onClickRows?: (item: T) => void;
  data: TableData<T>;
  headings: Array<string>;
  ContentStructure: ComponentType<{ item: T; index: number }>;
}

const PlainTable = <T,>({
  page,
  heading,
  data,
  isLoading,
  onClickRows,
  emptyStateProps = {
    icon: <EmptyStateIcon className='dark:*:fill-dark-accent' />,
    title: 'No available data',
    subText: '',
  },
  headings,
  ContentStructure,
}: PlainTableProps<T>) => {
  return (
    <article className='w-full rounded-lg border border-[#e0ddd9] bg-white px-6 py-4 dark:border-transparent dark:bg-dark-secondary'>
      <div className='flex items-center justify-between px-[10px] py-4'>
        <h6 className='heading-h6 font-semibold dark:text-white'>{heading}</h6>
        {data?.data?.length > 1 && (
          <Link
            href={`/dashboard/${page}/info`}
            className='text-small font-medium text-gray-500 dark:text-white'
          >
            View all
          </Link>
        )}
      </div>
      <div className='w-full overflow-x-auto scrollbar'>
        {isLoading ? (
          <div className='center-grid h-[60vh] w-full'>
            <SpinLoader thickness={2} size={80} color='#983504' />
          </div>
        ) : data?.data?.length ? (
          <table className='w-full min-w-[1100px]'>
            <thead>
              <tr>
                {headings.map((item) => (
                  <th
                    key={item}
                    className='text-xsmall px-[14px] py-3 text-left font-medium text-gray-500 dark:text-white'
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((item, index) => (
                <tr
                  className={`border-y border-y-gray-75 dark:border-dark-primary [&_:first-child]:rounded-l-lg [&_:last-child]:rounded-r-lg [&_td]:px-[14px] [&_td]:py-3 [&_td]:text-xs [&_td]:font-medium [&_td]:text-gray-800 dark:[&_td]:text-white ${onClickRows ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-primary' : ''}`}
                  key={index}
                  onClick={() => {
                    if (onClickRows) onClickRows(item);
                  }}
                >
                  <ContentStructure index={index} item={item} />
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <TableEmptyState {...emptyStateProps} />
        )}
      </div>
    </article>
  );
};
export default PlainTable;
