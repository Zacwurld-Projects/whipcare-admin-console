import { ComponentType } from 'react';

const NumbersOverview = ({
  stats,
  className,
}: {
  stats: {
    icon: ComponentType;
    title: string;
    currentNumber: number;
    previousNumber: number;
  }[];
  className?: string;
}) => {
  return (
    <article
      className={`grid w-full gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] ${className ? className : ''}`}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`mt-0 flex justify-between rounded-lg border border-gray-200 bg-white px-[22px] py-[15px]`}
        >
          <div className='flex-column'>
            <div className='center-grid mb-[10px] size-[40px] rounded-full bg-primary-50'>
              <stat.icon />
            </div>
            <p className='text-large text-gray-500'>{stat.title}</p>
            <p className='heading-h2 mt-[2px] font-semibold text-gray-600'>{stat.currentNumber}</p>
          </div>
          <p className='text-medium self-end rounded-[2em] bg-[#bcf0da] px-3 py-[3px] text-gray-600'>
            +{Math.floor(((stat.currentNumber - stat.previousNumber) / stat.previousNumber) * 100)}%
          </p>
        </div>
      ))}
    </article>
  );
};
export default NumbersOverview;
