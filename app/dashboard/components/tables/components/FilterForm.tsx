'use client';
import SearchIcon from '../../../assets/searchIcon.svg';
import FilterIcon from '../../../assets/filterIcon.svg';

const FilterForm = ({
  className,
  onSearch,
  onFilterClick,
  search,
}: {
  className?: string;
  onSearch: (value: string) => void;
  onFilterClick: () => void;
  search: string;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchValue = formData.get('search') as string;
    onSearch(searchValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If the input is cleared (empty), trigger search with empty string
    if (e.target.value === '') {
      onSearch('');
    }
  };

  return (
    <div className={`${className} flex items-stretch justify-stretch gap-6`}>
      <form action='' className='flex-1' onSubmit={handleSubmit}>
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
            defaultValue={search}
            onChange={handleInputChange}
            className='placeholder:text-small w-full placeholder:text-gray-500 focus:outline-none dark:bg-dark-secondary dark:text-white dark:placeholder:text-[#a0a0b2]'
          />
        </label>
      </form>
      <button
        type='button'
        className='text-small flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700 dark:text-[#a0a0b2]'
        onClick={onFilterClick}
      >
        <FilterIcon className='dark:*:fill-[#a0a0b2]' />
        <p>Filter</p>
      </button>
    </div>
  );
};
export default FilterForm;
