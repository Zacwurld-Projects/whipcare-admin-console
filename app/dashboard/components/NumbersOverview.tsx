import { useGlobalContext } from '@/app/context/AppContext';
import { ComponentType } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const NumbersOverview = ({
  stats,
  className,
  isLoading,
}: {
  stats: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    id: string;
    count: number;
    growth?: number;
  }[];
  className?: string;
  isLoading?: boolean;
}) => {
  const { isDark } = useGlobalContext();

  return (
    <article
      className={`grid w-full gap-4 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))] ${className ? className : ''}`}
    >
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`flex-column mt-0 items-stretch justify-between rounded-lg border border-gray-200 bg-white px-[22px] py-[15px] dark:bg-dark-primary`}
        >
          <div className='center-grid mb-[10px] size-[40px] rounded-full bg-primary-50'>
            {isLoading ? (
              <Skeleton
                circle
                width={28}
                height={28}
                baseColor={`${isDark ? '#a0a0b2' : '#e4e7ec'}`}
                highlightColor={`${isDark ? '#e4e7ec' : '#fff'}`}
              />
            ) : (
              <stat.icon className='dark:*:*:fill-dark-accent' />
            )}
          </div>
          <p className='text-large text-gray-500 dark:text-white'>
            {isLoading ? (
              <Skeleton
                width={160}
                height={18}
                baseColor={`${isDark ? '#a0a0b2' : '#e4e7ec'}`}
                highlightColor={`${isDark ? '#e4e7ec' : '#fff'}`}
              />
            ) : (
              stat.title
            )}
          </p>
          <div className='flex w-full justify-between'>
            <p className='heading-h2 mt-[2px] font-semibold text-gray-600 dark:text-[#a0a0b2]'>
              {isLoading ? (
                <Skeleton
                  baseColor={`${isDark ? '#a0a0b2' : '#e4e7ec'}`}
                  highlightColor={`${isDark ? '#e4e7ec' : '#fff'}`}
                  width={50}
                  borderRadius={100}
                />
              ) : (
                stat.count
              )}
            </p>
            {typeof stat.growth !== 'undefined' && (
              <p
                className={`text-medium self-end rounded-[2em] text-gray-600 [word-spacing:-3px] dark:text-dark-primary ${
                  isLoading
                    ? 'bg-transparent'
                    : stat.growth < 0
                      ? 'bg-[#fbeae9] px-3 py-[3px] text-[#dd524d]'
                      : 'bg-[#bcf0da] px-3 py-[3px]'
                }`}
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
            )}
          </div>
        </div>
      ))}
    </article>
  );
};
export default NumbersOverview;
