import { ComponentType } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const NumbersOverview = ({
  stats,
  className,
  isLoading,
}: {
  stats: {
    icon: ComponentType;
    title: string;
    id: string;
    count: number;
    growth: number;
  }[];
  className?: string;
  isLoading?: boolean;
}) => {
  return (
    <article
      className={`grid w-full gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] ${className ? className : ''}`}
    >
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`flex-column mt-0 items-stretch justify-between rounded-lg border border-gray-200 bg-white px-[22px] py-[15px]`}
        >
          <div className='center-grid mb-[10px] size-[40px] rounded-full bg-primary-50'>
            <stat.icon />
          </div>
          <p className='text-large text-gray-500'>{stat.title}</p>
          <div className='flex w-full justify-between'>
            <p className='heading-h2 mt-[2px] font-semibold text-gray-600'>
              {isLoading ? <Skeleton width={50} borderRadius={100} /> : stat.count}
            </p>
            <p
              className={`text-medium self-end rounded-[2em] text-gray-600 [word-spacing:-3px] ${isLoading ? 'bg-transparent' : 'bg-[#bcf0da] px-3 py-[3px]'}`}
            >
              {isLoading ? (
                <Skeleton
                  width={64}
                  height={30}
                  borderRadius={32}
                  baseColor='#a9e1ca'
                  highlightColor='#bcf0da'
                />
              ) : (
                `${stat.growth >= 0 ? '+ ' : ''}${Math.round(stat.growth)}%`
              )}
            </p>
          </div>
        </div>
      ))}
    </article>
  );
};
export default NumbersOverview;
