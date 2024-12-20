'use client';
import { useState } from 'react';
import DatePickerComponent from './DatePickerComponent';

const PageHeading = ({ page, pageFilters }: { page: string; pageFilters?: boolean }) => {
  const filters = ['today', '1 week', '2 months'];
  const [selectedFilter, setSelectedFilter] = useState<string | Array<Date | null>>('today');
  const [customDateFilter, setCustomDateFilter] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  return (
    <div className='flex w-full items-center justify-between max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-3'>
      <h3 className='heading-h3 max-[1300px]:heading-h5 font-medium capitalize text-gray-800'>
        {page}
      </h3>
      {pageFilters && (
        <div className='[&_button]:text-small flex flex-wrap items-center gap-2 [&_button]:rounded-[2em] [&_button]:border [&_button]:px-6 [&_button]:py-2 [&_button]:text-gray-800'>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setSelectedFilter(filter);
                // setCustomDateFilter([null, null]);
              }}
              className={`capitalize ${selectedFilter === filter ? 'border-[#ff915b] bg-[#fcb59a]' : 'border-gray-200'}`}
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
