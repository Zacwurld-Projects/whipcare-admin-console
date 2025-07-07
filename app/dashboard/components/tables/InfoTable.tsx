'use client';
// import ChevronDownIcon from '../../assets/chevronDown.svg';
import EmptyStateIcon from '../../assets/profileEmptyStateIcon.svg';
import { ComponentType, Dispatch, useState } from 'react';
import TablePagination from './components/TablePagination';
import FilterForm from './components/FilterForm';
import ExportTable from './components/ExportTable';
import SpinLoader from '../Loaders/SpinLoader';
import { EmptyStateProps, TableData } from '@/app/types/shared';
import TableEmptyState from '../empty-states/TableEmptyState';
import FilterModal from '../modals/FilterModal';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface InfoTableProps<T> {
  heading: string;
  emptyStateProps?: EmptyStateProps;
  isLoading?: boolean;
  currentPage: number;
  showItemNumber?: boolean;
  onClickRows?: (item: T) => void;
  setCurrentPage: Dispatch<number>;
  data: TableData<T>;
  headings: Array<string>;
  ContentStructure: ComponentType<{ item: T; index: number }>;
  search: string;
  onSearch: (value: string) => void;
}

const InfoTable = <T,>({
  heading,
  isLoading,
  data,
  onClickRows,
  emptyStateProps = {
    icon: <EmptyStateIcon className='dark:*:fill-dark-accent' />,
    title: 'No available data',
    subText: '',
  },
  headings,
  showItemNumber,
  currentPage,
  setCurrentPage,
  ContentStructure,
  search,
  onSearch,
}: InfoTableProps<
  T & {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    createdAt?: string;
    kycStatus?: string;
  }
>) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // No more frontend filtering for search; use data prop directly

  return (
    <article className='w-full rounded-lg border border-[#e0ddd9] bg-white px-6 py-4 dark:border-transparent dark:bg-dark-secondary'>
      <div className='mb-[36px] flex items-center justify-between'>
        <h6 className='heading-h6 font-semibold dark:text-white'>{heading}</h6>
        <div className='flex w-[60%] justify-end gap-6'>
          <FilterForm
            className='flex-1'
            onSearch={(value) => {
              onSearch(value);
              setCurrentPage(1);
            }}
            search={search}
            onFilterClick={() => setIsFilterModalOpen(true)}
          />
          <ExportTable />
        </div>
      </div>
      <div className='w-full overflow-x-auto scrollbar'>
        {isLoading ? (
          <div className='center-grid h-[60vh] w-full'>
            <SpinLoader thickness={2} size={80} color='#983504' />
          </div>
        ) : data?.data?.length ? (
          <table className='w-full'>
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
                  {showItemNumber && <td>{index + 1 + data.pageSize * (currentPage - 1)}</td>}
                  <ContentStructure index={index} item={item} />
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <TableEmptyState {...emptyStateProps} />
        )}
      </div>
      {data && (
        <TablePagination
          contentPerPage={data.pageSize}
          contentLength={data.totalCount}
          currentPage={currentPage}
          totalPages={Math.ceil(data.totalCount / data.pageSize)}
          setCurrentPage={setCurrentPage}
        />
      )}
      {isFilterModalOpen && (
        <FilterModal
          onClose={() => setIsFilterModalOpen(false)}
          onApply={({ status, startDate, endDate }) => {
            setStatus(status);
            setStartDate(startDate);
            setEndDate(endDate);
          }}
          initialStatus={status}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
      )}
    </article>
  );
};
export default InfoTable;
