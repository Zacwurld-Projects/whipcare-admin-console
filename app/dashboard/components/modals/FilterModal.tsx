import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const STATUS_OPTIONS = [
  {
    label: 'All',
    value: 'all',
    color: 'border text-gray-800  dark:text-gray-200',
  },
  {
    label: 'Verified',
    value: 'verified',
    color: 'border text-green-700 dark:text-green-400',
  },
  {
    label: 'Pending',
    value: 'pending',
    color: 'border text-orange-500 dark:text-orange-400',
  },
  {
    label: 'Approved',
    value: 'approved',
    color: 'border text-red-700 dark:text-red-400',
  },
  { label: 'Not Verified', value: 'notverified', color: 'border text-gray-500 dark:text-gray-400' },
  { label: 'Rejected', value: 'rejected', color: 'border text-red-700 dark:text-red-400' },
];

const FilterModal = ({
  onClose,
  onApply,
  initialStatus = 'all',
  initialMinDate = '',
  initialMaxDate = '',
}: {
  onClose: () => void;
  onApply: (filters: { status: string; minDate: string; maxDate: string }) => void;
  initialStatus?: string;
  initialMinDate?: string;
  initialMaxDate?: string;
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const [status, setStatus] = useState(initialStatus);
  const [minDate, setMinDate] = useState(initialMinDate);
  const [maxDate, setMaxDate] = useState(initialMaxDate);

  const handleReset = () => {
    setStatus('all');
    setMinDate('');
    setMaxDate('');
  };

  const handleApply = () => {
    onApply({ status, minDate, maxDate });
    onClose();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-80'
      onClick={onClose}
    >
      <div
        className='relative min-h-[200px] w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-2xl dark:bg-dark-secondary'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute left-4 top-8 rounded-full border bg-gray-100 p-2 text-2xl font-bold text-gray-400 transition-colors hover:text-black dark:border-gray-700 dark:bg-dark-primary dark:text-gray-300 dark:hover:text-white'
          aria-label='Close modal'
        >
          <ArrowLeft className='h-4 w-4' />
        </button>
        <div className='flex flex-col items-center gap-6'>
          <h1 className='text-2xl font-medium dark:text-white'>Filter</h1>

          {/* Status */}
          <div className='w-full'>
            <label className='mb-2 block text-base font-medium text-gray-700 dark:text-gray-200'>
              Status
            </label>
            <div className='flex flex-wrap gap-3'>
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border-[#FFECE5] bg-[#a4a4a41d] px-5 py-2 text-xs font-medium transition-all ${opt.color} ${status === opt.value ? '' : ''}`}
                >
                  <input
                    type='radio'
                    name='status'
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value)}
                    className='accent-[#711E00]'
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Date */}
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

          {/* Apply Filter Button */}
          <button
            className='mt-4 w-full rounded-full bg-[#711E00] py-4 text-base font-semibold text-white dark:bg-[#f5e7e1] dark:text-[#711E00]'
            onClick={handleApply}
          >
            Apply Filter
          </button>

          {/* Reset */}
          <button
            type='button'
            className='mt-2 text-center text-sm font-medium text-[#711E00] hover:underline hover:underline-offset-4 dark:text-[#f5e7e1]'
            onClick={handleReset}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
