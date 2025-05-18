import { cn } from '@/app/lib/accessoryFunctions';
import { EmptyStateProps } from '@/app/types/shared';
import { FC } from 'react';

const PageEmptyState: FC<EmptyStateProps> = ({ className, icon, title, subText }) => {
  return (
    <div className={cn('center-grid h-[70vh] w-full', className)}>
      <div className={cn('flex flex-col items-center gap-3')}>
        {icon}
        <div className='flex flex-col items-center gap-1 text-center'>
          <p className='text-xl font-normal text-gray-900 dark:text-white'>{title}</p>
          <p className='text-gray-500 dark:text-dark-tertiary'>{subText}</p>
        </div>
      </div>
    </div>
  );
};
export default PageEmptyState;
