'use client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { timeAgo } from '@/app/accessoryFunctions';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChurnRateChart = () => {
  return (
    <div
      className={`mb-[10px] rounded-lg border border-gray-200 bg-white px-[22px] py-[15px] dark:border-transparent dark:bg-dark-primary`}
    >
      <div className='flex justify-between'>
        <p className='text-large text-gray-500 dark:text-white'>Churn Rate</p>
        <p className='text-medium self-end rounded-[2em] bg-[#bcf0da] px-3 py-[3px] text-gray-600'>
          +{Math.round(((4.26 - 4.25) / 4.25) * 100 * 100) / 100}%
        </p>
      </div>
      <p className='text-2xl font-semibold text-gray-600 dark:text-[#a0a0b2]'>4.26%</p>
      <div className='mx-auto h-[80px] w-[200px]'>
        <Doughnut
          options={{
            responsive: true,
            radius: 75,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: { enabled: false },
            },
          }}
          data={{
            datasets: [
              {
                data: [75, 25],
                backgroundColor: ['#f56630', '#ffece5'],
                borderWidth: 0,
                // cutout: '50%', // Create a donut shape
                circumference: 180, // Semi-circle
                rotation: 270, // Start from the bottom
              },
            ],
          }}
        />
      </div>
    </div>
  );
};
export default ChurnRateChart;
