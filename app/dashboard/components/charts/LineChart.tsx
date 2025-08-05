'use client';

import { useEffect, useState } from 'react';
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
import { useGlobalContext } from '@/app/context/AppContext';
import { fetchUserYearlyCount } from '@/app/api/apiClient';
import { Loader } from 'lucide-react';

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
  const { isDark } = useGlobalContext();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedFilter, setSelectedFilter] = useState('monthly');
  const [userData, setUserData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchUserYearlyCount(selectedYear);
        const allMonths = Array(12).fill(0);

        response?.data?.forEach((entry: { month: number; userCount: number }) => {
          const monthIndex = entry.month - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            allMonths[monthIndex] = entry.userCount;
          }
        });

        setUserData(allMonths);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
  };

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-2 dark:border-transparent dark:bg-dark-primary ${className}`}
    >
      <div className='mb-[30px] flex items-end justify-between'>
        <h6 className='heading-h6 p-2 font-semibold dark:text-white'>{heading || 'User Counts'}</h6>

        <div className='flex items-center gap-4'>
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className='rounded border px-2 py-1 text-sm dark:border-gray-700 dark:bg-dark-secondary dark:text-white'
          >
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Monthly/Weekly Filter (if enabled) */}
          {filter && (
            <div className='flex gap-[6px] rounded-[18.31px] bg-primary-50 px-[6px] py-[3px] dark:bg-dark-secondary'>
              {filters.map((item) => (
                <button
                  className={`text-xsmall rounded-[42.72px] px-[12.2px] py-[6.1px] capitalize ${
                    selectedFilter === item
                      ? 'bg-[#ff915b] text-white dark:bg-dark-accent'
                      : 'bg-transparent text-gray-500 dark:text-white'
                  }`}
                  key={item}
                  onClick={() => setSelectedFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='h-[224px]'>
        {loading ? (
          <p className='flex items-center justify-center text-center text-sm dark:text-white'>
            <Loader className='animate-spin' />
          </p>
        ) : (
          <Line
            data={{
              labels: months,
              datasets: [
                {
                  label: 'Users',
                  data: userData,
                  borderColor: isDark ? '#ff6e4a' : '#ff915b',
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  grid: { display: false },
                  ticks: {
                    stepSize: 5,
                    callback: (value) => `${Number(value)}`,
                  },
                },
                x: {
                  grid: {
                    color: isDark ? '#667185' : '#E4E7EC',
                  },
                },
              },
              plugins: {
                legend: { display: false },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LineChart;
