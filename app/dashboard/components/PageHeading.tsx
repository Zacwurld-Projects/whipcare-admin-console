'use client';
import { useState } from 'react';
import ChevronDownIcon from '../assets/chevronDown.svg';
import CalendarIcon from '../assets/calendarIcon.svg';

const PageHeading = ({ page, pageFilters }: { page: string; pageFilters?: boolean }) => {
  const filters = ['today', '1 week', '2 months'];
  const [selectedFilter, setSelectedFilter] = useState('today');

  return (
    <div className='flex w-full items-center justify-between'>
      <h3 className='heading-h3 font-medium capitalize text-gray-800'>{page}</h3>
      {pageFilters && (
        <div className='[&_button]:text-small flex items-center gap-2 [&_button]:rounded-[2em] [&_button]:border [&_button]:px-6 [&_button]:py-2 [&_button]:text-gray-800'>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`capitalize ${selectedFilter === filter ? 'border-[#ff915b] bg-[#fcb59a]' : 'border-gray-200'}`}
            >
              {filter}
            </button>
          ))}
          <button className='flex items-center gap-1 border-gray-200'>
            <CalendarIcon />
            <p>Select dates</p>
            <ChevronDownIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default PageHeading;
