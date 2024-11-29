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
  return (
    <div className='rounded-lg bg-white px-6 py-4'>
      <p className='text-large mb-4 font-semibold capitalize text-gray-700'>{heading}</p>
      <div className='h-[300px]'>
        <Bar
          options={{
            backgroundColor: '#fa9874',
            maintainAspectRatio: false,
            color: '#E4E7EC',
            font: {
              family: 'Inter',
              size: 14,
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  color: '#E4E7EC',
                },
                title: {
                  display: true,
                  text: yLabel,
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
