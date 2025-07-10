'use client';
import { Dispatch, useEffect, useState } from 'react';
import DatePickerComponent from './DatePickerComponent';
// import dayjs from 'dayjs';
import { getDateRange } from '@/app/lib/range';

interface PageHeadingProps {
  page: string;
  pageFilters?: boolean;
  setSelectedDates?: Dispatch<{
    maxDate: string;
    minDate: string;
  }>;
  selectedStartDate?: string;
  selectedEndDate?: string;
}

const PageHeading = ({
  page,
  pageFilters,
  setSelectedDates,
  selectedStartDate,
  selectedEndDate,
}: PageHeadingProps) => {
  const filters = ['all', 'today', '1 week', '2 months'];
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [customDateFilter, setCustomDateFilter] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    if (selectedFilter === 'custom' && setSelectedDates) {
      // Convert nulls to empty strings for customDateFilter
      const safeCustomDateFilter: [Date | null, Date | null] = [
        customDateFilter[0] ?? null,
        customDateFilter[1] ?? null,
      ];
      const range = getDateRange('custom', safeCustomDateFilter);
      setSelectedDates({
        minDate: range.minDate || '',
        maxDate: range.maxDate || '',
      });
    }
  }, [selectedFilter, setSelectedDates, customDateFilter]);

  return (
    <div className='flex w-full items-center justify-between max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-3'>
      <div>
        <h3 className='heading-h3 max-[1300px]:heading-h5 font-medium capitalize text-gray-800 dark:text-white'>
          {page}
        </h3>
        {(selectedStartDate || selectedEndDate) && (
          <div className='mt-1 text-sm text-gray-500'>
            {selectedStartDate && selectedEndDate
              ? `Showing: ${selectedStartDate} to ${selectedEndDate}`
              : selectedStartDate
                ? `From: ${selectedStartDate}`
                : selectedEndDate
                  ? `Up to: ${selectedEndDate}`
                  : ''}
          </div>
        )}
      </div>
      {pageFilters && (
        <div className='[&_button]:text-small flex flex-wrap items-center gap-2 [&_button]:rounded-[2em] [&_button]:border [&_button]:px-6 [&_button]:py-2 [&_button]:text-gray-800 dark:[&_button]:text-white'>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setSelectedFilter(filter);
                if (setSelectedDates) {
                  if (filter === 'all') {
                    setSelectedDates({ minDate: '', maxDate: '' });
                  } else {
                    setSelectedDates(getDateRange(filter));
                  }
                }
                // setCustomDateFilter([null, null]);
              }}
              className={`capitalize ${selectedFilter === filter ? 'border-[#ff915b] bg-[#fcb59a] dark:bg-dark-accent' : 'border-gray-200'}`}
            >
              {filter}
            </button>
          ))}
          <DatePickerComponent
            selectedFilter={selectedFilter}
            customDateFilter={customDateFilter}
            setCustomDateFilter={setCustomDateFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </div>
      )}
    </div>
  );
};

export default PageHeading;
