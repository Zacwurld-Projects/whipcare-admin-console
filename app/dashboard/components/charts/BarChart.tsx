'use client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGlobalContext } from '@/app/context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({
  xLabels,
  yLabel,
  heading,
  data,
}: {
  xLabels: string[];
  yLabel: string;
  heading: string;
  data: number[];
}) => {
  const { isDark } = useGlobalContext();

  return (
    <div className='rounded-lg bg-white px-6 py-4 dark:bg-dark-primary'>
      <p className='text-large mb-4 font-semibold capitalize text-gray-700 dark:text-white'>
        {heading}
      </p>
      <div className='h-[300px]'>
        <Bar
          options={{
            backgroundColor: `${isDark ? '#f56630' : '#fa9874'}`,
            maintainAspectRatio: false,
            color: `${isDark ? '#fff' : '#E4E7EC'}`,
            font: {
              family: 'Inter',
              size: 14,
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                title: {
                  color: `${isDark ? '#fff' : '#667185'}`,
                },
              },
              y: {
                grid: {
                  color: `${isDark ? '#a0a0b2' : '#E4E7EC'}`,
                },
                title: {
                  display: true,
                  text: yLabel,
                  color: `${isDark ? '#fff' : '#667185'}`,
                },
              },
            },
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
          data={{
            labels: xLabels,
            datasets: [
              {
                label: yLabel,
                data: data,
                borderRadius: 10,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};
export default BarChart;
