'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const UserGrowthChart = ({
  className = '',
  userGrowth = 0,
}: {
  className?: string;
  userGrowth?: number;
}) => {
  return (
    <div
      className={`mb-[10px] rounded-lg border border-gray-200 bg-white px-[22px] py-[15px] dark:border-transparent dark:bg-dark-primary ${className}`}
    >
      <div className='flex justify-between'>
        <p className='text-large text-gray-500 dark:text-white'>User Growth</p>
        <p className='text-medium self-end rounded-[2em] bg-[#bcf0da] px-3 py-[3px] text-gray-600'>
          +{Math.floor(userGrowth)}%
        </p>
      </div>
      <p className='text-2xl font-semibold text-gray-600 dark:text-[#a0a0b2]'>{userGrowth}</p>
      <div className='ml-[30px] mt-1 h-[80px] w-[141px]'>
        <Line
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Percent growth',
                data: [10, 5, 10, 1, 10, 5],
                borderColor: '#ff915b',
                borderWidth: 1,
                borderJoinStyle: 'round',
                tension: 0.1,
                pointRadius: 0,
              },
            ],
          }}
          options={{
            color: '#E4E7EC',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                grid: {
                  display: false,
                },
                display: false,
              },
              x: {
                grid: {
                  display: false,
                },
                display: false,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
};
export default UserGrowthChart;
