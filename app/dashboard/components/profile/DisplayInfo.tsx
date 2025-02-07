const DisplayInfo = ({ title, value }: { title: string; value: string | number }) => {
  return (
    <div className='flex-column rounded-[5px] border border-gray-200 px-4 py-2 dark:border-dark-tertiary dark:bg-dark-secondary'>
      <p className='text-xsmall font-medium text-gray-700 dark:text-white/50'>{title}</p>
      <p className='text-small capitalize text-gray-700 dark:text-white'>{value}</p>
    </div>
  );
};
export default DisplayInfo;
