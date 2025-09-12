'use client';
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export type TimeRange = 'today' | 'week' | 'month' | 'custom';
export type LeaderboardTab = 'all' | 'city' | 'category';

interface LeaderboardFilterModalProps {
  onClose: () => void;
  onApply: (filters: {
    timeRange: TimeRange;
    tab: LeaderboardTab;
    city: string;
    category: string;
    minDate: string;
    maxDate: string;
  }) => void;
  initialTimeRange?: TimeRange;
  initialTab?: LeaderboardTab;
  initialCity?: string;
  initialCategory?: string;
  initialMinDate?: string;
  initialMaxDate?: string;
  cityOptions?: string[];
  categoryOptions?: string[];
}

const LeaderboardFilterModal: React.FC<LeaderboardFilterModalProps> = ({
  onClose,
  onApply,
  initialTimeRange = 'month',
  initialTab = 'all',
  initialCity = '',
  initialCategory = '',
  initialMinDate = '',
  initialMaxDate = '',
  cityOptions = [],
  categoryOptions = [],
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [tab, setTab] = useState<LeaderboardTab>(initialTab);
  const [city, setCity] = useState<string>(initialCity);
  const [category, setCategory] = useState<string>(initialCategory);
  const [minDate, setMinDate] = useState<string>(initialMinDate);
  const [maxDate, setMaxDate] = useState<string>(initialMaxDate);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleApply = () => {
    // Basic validation can be added here
    onApply({ timeRange, tab, city, category, minDate, maxDate });
    onClose();
  };

  const handleReset = () => {
    setTimeRange('month');
    setTab('all');
    setCity('');
    setCategory('');
    setMinDate('');
    setMaxDate('');
    onApply({ timeRange: 'month', tab: 'all', city: '', category: '', minDate: '', maxDate: '' });
    onClose();
  };

  return (
    <div
      className='fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-[1px] dark:bg-black/70'
      onClick={onClose}
    >
      <div
        className='relative max-h-[85vh] w-[92vw] max-w-[520px] overflow-auto rounded-2xl bg-white p-8 shadow-2xl dark:bg-dark-secondary'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute left-4 top-6 rounded-full border bg-gray-100 p-2 text-2xl font-bold text-gray-400 transition-colors hover:text-black dark:border-gray-700 dark:bg-dark-primary dark:text-gray-300 dark:hover:text-white'
          aria-label='Close modal'
        >
          <ArrowLeft className='h-4 w-4' />
        </button>

        <div className='flex flex-col items-center gap-6'>
          <h1 className='text-2xl font-medium dark:text-white'>Filter</h1>

          {/* Tabs */}
          <div className='w-full'>
            <label className='mb-2 block text-base font-medium text-gray-700 dark:text-gray-200'>
              View
            </label>
            <div className='flex flex-wrap gap-3'>
              {(
                [
                  { key: 'all', label: 'All Providers' },
                  { key: 'city', label: 'By City' },
                  { key: 'category', label: 'By Service Category' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setTab(opt.key)}
                  className={`rounded-xl border px-5 py-2 text-xs font-medium transition-all ${
                    tab === opt.key
                      ? 'border-[#FFECE5] bg-[#FFECE5] text-[#711E00]'
                      : 'border-gray-200 bg-[#a4a4a41d] text-gray-700 dark:border-gray-700 dark:text-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className='w-full'>
            <label className='mb-2 block text-base font-medium text-gray-700 dark:text-gray-200'>
              Time Range
            </label>
            <div className='flex flex-wrap gap-3'>
              {(
                [
                  { key: 'today', label: 'Today' },
                  { key: 'week', label: 'This Week' },
                  { key: 'month', label: 'This Month' },
                  { key: 'custom', label: 'Custom Range' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setTimeRange(opt.key)}
                  className={`rounded-xl border px-5 py-2 text-xs font-medium transition-all ${
                    timeRange === opt.key
                      ? 'border-[#FFECE5] bg-[#FFECE5] text-[#711E00]'
                      : 'border-gray-200 bg-[#a4a4a41d] text-gray-700 dark:border-gray-700 dark:text-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional city/category */}
          {tab === 'city' && (
            <div className='w-full'>
              <label className='mb-2 block text-base font-medium text-gray-700 dark:text-gray-200'>
                City
              </label>
              <select
                className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#711E00] focus:outline-none dark:border-gray-700 dark:bg-dark-primary dark:text-white'
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value=''>All Cities</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {tab === 'category' && (
            <div className='w-full'>
              <label className='mb-2 block text-base font-medium text-gray-700 dark:text-gray-200'>
                Service Category
              </label>
              <select
                className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#711E00] focus:outline-none dark:border-gray-700 dark:bg-dark-primary dark:text-white'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>All Categories</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Custom date range when needed */}
          {timeRange === 'custom' && (
            <div className='w-full'>
              <label className='mb-2 block text-base font-medium text-gray-700 dark:text-gray-200'>
                Date
              </label>
              <div className='flex gap-3'>
                <input
                  type='date'
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#711E00] focus:outline-none dark:border-gray-700 dark:bg-dark-primary dark:text-white'
                  value={minDate}
                  onChange={(e) => setMinDate(e.target.value)}
                  placeholder='Start Date'
                />
                <input
                  type='date'
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#711E00] focus:outline-none dark:border-gray-700 dark:bg-dark-primary dark:text-white'
                  value={maxDate}
                  onChange={(e) => setMaxDate(e.target.value)}
                  placeholder='End Date'
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <button
            onClick={handleApply}
            className='mt-2 w-full rounded-full bg-[#711E00] py-4 text-base font-semibold text-white dark:bg-[#f5e7e1] dark:text-[#711E00]'
          >
            Apply Filter
          </button>
          <button
            type='button'
            onClick={handleReset}
            className='mt-2 text-center text-sm font-medium text-[#711E00] hover:underline hover:underline-offset-4 dark:text-[#f5e7e1]'
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardFilterModal;
