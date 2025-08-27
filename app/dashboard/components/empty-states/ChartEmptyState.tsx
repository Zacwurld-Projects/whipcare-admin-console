import { FC, ReactNode } from 'react';
import { cn } from '@/app/lib/accessoryFunctions';

const ChartEmptyState: FC<{
  className?: string;
  icon?: ReactNode;
  title?: string;
  subText?: string;
}> = ({
  className,
  icon,
  title = 'No data available',
  subText = 'There is no data to display for the selected period.',
}) => {
  return (
    <div className={cn('center-grid h-[300px] w-full', className)}>
      <div className='mx-auto flex w-fit flex-col items-center gap-2 text-center'>
        {icon}
        <p className='text-sm font-medium text-gray-900 dark:text-white'>{title}</p>
        <p className='text-xs text-gray-500 dark:text-dark-tertiary'>{subText}</p>
      </div>
    </div>
  );
};

export default ChartEmptyState;
