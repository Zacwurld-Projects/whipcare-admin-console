'use client';
import SearchIcon from '../../../assets/searchIcon.svg';
import FilterIcon from '../../../assets/filterIcon.svg';

const FilterForm = () => {
  return (
    <div className='flex w-[50%] items-stretch justify-stretch gap-2'>
      <form action='' className='flex-1'>
        <label
          htmlFor='search'
          className='flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2'
        >
          <SearchIcon />
          <input
            type='text'
            id='search'
            name='search'
            placeholder='Search here...'
            className='placeholder:text-small focus:outline- w-full placeholder:text-gray-500'
          />
        </label>
      </form>
      <button className='text-small flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700'>
        <FilterIcon />
        <p>Filter</p>
      </button>
    </div>
  );
};
export default FilterForm;
