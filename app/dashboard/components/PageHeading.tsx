'use client';
import { Dispatch, useEffect, useState } from 'react';
import DatePickerComponent from './DatePickerComponent';
import dayjs from 'dayjs';

const PageHeading = ({
  page,
  pageFilters,
  setSelectedDates,
}: {
  page: string;
  pageFilters?: boolean;
  setSelectedDates?: Dispatch<{
    maxDate: string;
    minDate: string;
  }>;
}) => {
  const filters = ['today', '1 week', '2 months'];
  const [selectedFilter, setSelectedFilter] = useState<string>('today');
  const [customDateFilter, setCustomDateFilter] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    if (selectedFilter === 'custom' && setSelectedDates) {
      setSelectedDates({
        maxDate: customDateFilter[1]
          ? dayjs(customDateFilter[1]).format('YYYY-MM-DD')
          : dayjs(customDateFilter[0]).format('YYYY-MM-DD'),
        minDate: customDateFilter[1] ? dayjs(customDateFilter[0]).format('YYYY-MM-DD') : '',
      });
    }
  }, [selectedFilter, setSelectedDates, customDateFilter]);

  return (
    <div className='flex w-full items-center justify-between max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-3'>
      <h3 className='heading-h3 max-[1300px]:heading-h5 font-medium capitalize text-gray-800 dark:text-white'>
        {page}
      </h3>
      {pageFilters && (
        <div className='[&_button]:text-small flex flex-wrap items-center gap-2 [&_button]:rounded-[2em] [&_button]:border [&_button]:px-6 [&_button]:py-2 [&_button]:text-gray-800 dark:[&_button]:text-white'>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setSelectedFilter(filter);
                if (setSelectedDates) {
                  if (filter === 'today') {
                    setSelectedDates({
                      maxDate: '',
                      minDate: '',
                    });
                  } else if (filter === '1 week') {
                    setSelectedDates({
                      maxDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
                      minDate: '',
                    });
                  } else if (filter === '2 months') {
                    setSelectedDates({
                      maxDate: dayjs().subtract(2, 'month').format('YYYY-MM-DD'),
                      minDate: '',
                    });
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
