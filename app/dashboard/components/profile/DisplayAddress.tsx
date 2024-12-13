import LocationIcon from '../../assets/locationIcon.svg';

const DisplayAddress = ({ title, value }: { title: string; value: string }) => {
  return (
    <div key={title} className='flex items-center gap-3 p-4'>
      <LocationIcon />
      <div className='flex-column'>
        <p className='text-small font-medium capitalize text-gray-900'>{title} address</p>
        <p className='text-[15px] text-[#868782]'>{value}</p>
      </div>
    </div>
  );
};
export default DisplayAddress;
