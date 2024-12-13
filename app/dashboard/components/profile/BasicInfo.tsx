'use client';
import mockUserImage from '../../assets/mockUserImg.png';
import BookingsIcon from '../../assets/bookingsIcon.svg';
import SpendingsIcon from '../../assets/spendingsIcon.svg';
import Image from 'next/image';

const BasicInfo = () => {
  return (
    <div className='mt-6 flex w-full items-stretch gap-[18px] *:rounded-[5px] *:bg-white'>
      <div className='flex w-[43%] items-center gap-8 px-[47.5px] py-8'>
        <Image
          src={mockUserImage}
          alt='Isaac Zacwurlds image'
          height={79}
          width={79}
          className='rounded-full'
        />
        <div>
          <p className='heading-h5 font-semibold text-gray-800'>Isaac Zacwurld</p>
          <p className='font-medium text-[#413b35]'>Isaaczac@gmail.com</p>
          <p className='font-medium text-[#5a524a]'>+1 453 6780 690</p>
        </div>
      </div>
      <div className='flex flex-1 justify-between px-6 py-[50px] pr-[66px]'>
        <div className='flex gap-3'>
          <BookingsIcon />
          <div>
            <p className='text-large text-[#342f2a]'>Total Bookings</p>
            <p className='heading-h4 font-semibold text-[#342f2a]'>48</p>
          </div>
        </div>
        <div className='h-full border-r border-[#eceae8]'></div>
        <div className='flex gap-3'>
          <SpendingsIcon />
          <div>
            <p className='text-large text-gray-700'>Total Spendings</p>
            <p className='heading-h4 font-semibold text-gray-700'>$1240</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BasicInfo;
