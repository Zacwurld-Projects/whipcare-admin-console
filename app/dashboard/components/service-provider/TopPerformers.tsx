'use client';
import Image from 'next/image';
import ChevronRightIcon from '../../assets/chevronRight.svg';
import topPerformerImage from '../../assets/topPerformerImage.png';

const topPerformers = Array.from(
  {
    length: 8,
  },
  (_, i) => {
    return {
      image: topPerformerImage,
      firstName: 'Ariana',
      lastName: 'Bush',
      serviceType: 'Mecahnics',
      amount: 100000 - i * 5000,
    };
  },
);

const TopPerformers = () => {
  return (
    <div className='my-8'>
      <div className='flex items-center justify-between'>
        <p className='text-large font-semibold text-gray-900'>Waitlist Service Provider</p>
        <button className='text-small flex items-center gap-2 rounded-[6px] bg-[#eb5017] px-3 py-2 font-semibold text-white'>
          <p>View Leaderboard</p>
          <ChevronRightIcon className='*:fill-white' />
        </button>
      </div>
      <div className='mt-4 overflow-x-auto rounded-[10px] border border-gray-100 bg-white px-10 py-6 scrollbar'>
        <ul className='flex w-max min-w-full justify-between gap-8'>
          {topPerformers.map((item, index) => (
            <li key={index} className='flex-column items-center gap-2'>
              <Image src={item.image} alt='' height={52} width={52} className='rounded-[7px]' />
              <div>
                <p className='text-xsmall font-semibold text-gray-800'>
                  {index + 1}. {item.firstName} {item.lastName}
                </p>
                <p className='text-xsmall text-gray'>{item.serviceType}</p>
              </div>
              <p className='rounded-[18px] bg-[#ff915b] px-4 py-[5px] text-[8px] text-white'>
                #{item.amount.toLocaleString('en-US')}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default TopPerformers;
