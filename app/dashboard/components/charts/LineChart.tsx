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
import { useState } from 'react';
import { useGlobalContext } from '@/app/context/AppContext';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = ({
  filter,
  className = '',
  heading,
}: {
  filter?: boolean;
  className?: string;
  heading?: string;
}) => {
  const filters = ['monthly', 'weekly'];
  const [selectedFilter, setSelectedFilter] = useState('monthly');
  const { isDark } = useGlobalContext();

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-2 dark:border-transparent dark:bg-dark-primary ${className}`}
    >
      <div className='mb-[30px] flex items-end justify-between'>
        <h6 className='heading-h6 p-2 font-semibold dark:text-white'>
          {heading ? heading : 'User Counts'}
        </h6>
        {filter && (
          <div className='flex gap-[6px] rounded-[18.31px] bg-primary-50 px-[6px] py-[3px] dark:bg-dark-secondary'>
            {filters.map((item) => (
              <button
                className={`text-xsmall rounded-[42.72px] px-[12.2px] py-[6.1px] capitalize ${selectedFilter === item ? 'bg-[#ff915b] text-white dark:bg-dark-accent' : 'bg-transparent text-gray-500 dark:text-white'}`}
                key={item}
                onClick={() => setSelectedFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className='h-[224px]'>
        <Line
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Users',
                data: [3000, 5000, 4700, 12500, 15000, 20000],
                borderColor: `${isDark ? '#ff6e4a' : '#ff915b'}`,
                borderWidth: 2,
                borderJoinStyle: 'round',
                tension: 0.4,
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
                ticks: {
                  stepSize: 5000,
                  callback: function (value) {
                    return `${Number(value) / 1000}k`;
                  },
                },
                // title: {
                //   display: true,
                //   text: 'Users',
                // },
              },
              x: {
                grid: {
                  color: `${isDark ? '#667185' : '#E4E7EC'}`,
                },
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
export default LineChart;
