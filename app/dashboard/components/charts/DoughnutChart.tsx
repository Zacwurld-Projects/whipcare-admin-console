'use client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import ChartEmptyState from '../empty-states/ChartEmptyState';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({
  heading,
  data,
  colors,
  timestamp,
  xLabels,
  yLabel,
}: {
  heading: string;
  data: number[];
  colors: string[];
  timestamp: string | number;
  xLabels: string[];
  yLabel: string;
}) => {
  const hasData = Array.isArray(data) && data.some((v) => typeof v === 'number' && v > 0);

  return (
    <div className='rounded-lg bg-white p-4 dark:bg-dark-primary'>
      <div className='mb-3 flex w-full items-center justify-between border-b border-gray-800 pb-3 dark:border-white'>
        <p className='text-medium font-semibold text-gray-800 dark:text-white'>{heading}</p>
        <p className='text-xsmall text-gray-600 dark:text-white'>
          Last updated: {timeAgo(timestamp)}
        </p>
      </div>
      {!hasData ? (
        <ChartEmptyState subText='Try adjusting filters or check back later.' />
      ) : (
        <div className='relative h-[300px]'>
          <Doughnut
            options={{
              responsive: true,
              radius: 120,
              maintainAspectRatio: false,
            }}
            data={{
              labels: xLabels,
              datasets: [
                {
                  label: yLabel,
                  data,
                  backgroundColor: colors,
                  borderWidth: 0,
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};
export default DoughnutChart;
