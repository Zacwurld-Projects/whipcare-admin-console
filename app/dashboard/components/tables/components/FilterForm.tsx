'use client';
import SearchIcon from '../../../assets/searchIcon.svg';
import FilterIcon from '../../../assets/filterIcon.svg';

const FilterForm = ({ className }: { className?: string }) => {
  return (
    <div className={`${className} flex items-stretch justify-stretch gap-6`}>
      <form action='' className='flex-1'>
        <label
          htmlFor='search'
          className='flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2'
        >
          <SearchIcon className='dark:*:fill-[#a0a0b2]' />
          <input
            type='text'
            id='search'
            name='search'
            placeholder='Search here...'
            className='placeholder:text-small w-full placeholder:text-gray-500 focus:outline-none dark:bg-dark-secondary dark:text-white dark:placeholder:text-[#a0a0b2]'
          />
        </label>
      </form>
      <button className='text-small flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700 dark:text-[#a0a0b2]'>
        <FilterIcon className='dark:*:fill-[#a0a0b2]' />
        <p>Filter</p>
      </button>
    </div>
  );
};
export default FilterForm;
