import LocationIcon from '../../assets/locationIcon.svg';

const DisplayAddress = ({ title, value }: { title: string; value: string }) => {
  return (
    <div key={title} className='flex items-center gap-3 rounded-[16px] p-4 dark:bg-dark-secondary'>
      <div className='center-grid size-[30px] rounded-full bg-[#711E00] dark:bg-dark-accent'>
        <LocationIcon />
      </div>
      <div className='flex-column'>
        <p className='text-small font-medium capitalize text-gray-900 dark:text-dark-tertiary'>
          {title} address
        </p>
        <p className='text-[15px] text-[#868782] dark:text-white'>{value}</p>
      </div>
    </div>
  );
};
export default DisplayAddress;
