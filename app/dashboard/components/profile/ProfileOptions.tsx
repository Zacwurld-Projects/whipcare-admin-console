import { Dispatch } from 'react';

const ProfileOptions = ({
  pageOptions,
  selectedPageOption,
  setSelectedPageOption,
}: {
  pageOptions: string[];
  selectedPageOption: string;
  setSelectedPageOption: Dispatch<string>;
}) => {
  return (
    <div className='text-small my-6 flex w-fit gap-2 rounded-[56px] bg-[#f9f8f7] p-1 font-medium text-gray-500'>
      {pageOptions.map((item) => (
        <button
          key={item}
          onClick={() => setSelectedPageOption(item)}
          className={`rounded-[56px] px-4 py-2 capitalize ${selectedPageOption === item ? 'bg-[#983504] text-white' : ''}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};
export default ProfileOptions;