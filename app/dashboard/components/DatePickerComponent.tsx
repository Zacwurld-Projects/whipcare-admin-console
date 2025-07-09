'use client';
import ChevronDownIcon from '../assets/chevronDown.svg';
import CalendarIcon from '../assets/calendarIcon.svg';
import { Dispatch, useEffect, useRef } from 'react';
import { DatePicker } from '@mantine/dates';
import '@mantine/dates/styles.layer.css';
import useMenu from '@/app/hooks/useMenu';
import ChevronRightIcon from '../assets/chevronRight.svg';
import ChevronLeftIcon from '../assets/chevronLeft.svg';
import { MantineProvider } from '@mantine/core';
import { formatDateToDDMMYY } from '@/app/lib/accessoryFunctions';
import { useGlobalContext } from '@/app/context/AppContext';

const DatePickerComponent = ({
  setSelectedFilter,
  selectedFilter,
  customDateFilter,
  setCustomDateFilter,
}: {
  selectedFilter: string;
  setSelectedFilter: Dispatch<string>;
  customDateFilter: [Date | null, Date | null];
  setCustomDateFilter: Dispatch<[Date | null, Date | null]>;
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const { isDark } = useGlobalContext();
  const calenderButtonRef = useRef<HTMLButtonElement>(null);
  const { isMenuOpen: isCalendarOpen, setIsMenuOpen: setIsCalendarOpen } = useMenu(
    calenderButtonRef,
    calendarRef,
  );

  useEffect(() => {
    if (customDateFilter[0]) setSelectedFilter('custom');
    else setSelectedFilter('all');
  }, [customDateFilter, setSelectedFilter]);

  return (
    <MantineProvider>
      <div className='relative'>
        <button
          className={`flex items-center gap-1 border-gray-200 ${selectedFilter === 'custom' ? '!border-[#ff915b] bg-[#fcb59a] dark:bg-dark-accent' : ''}`}
          onClick={() => {
            setIsCalendarOpen(!isCalendarOpen);
            if (customDateFilter[0]) setSelectedFilter('custom');
          }}
          ref={calenderButtonRef}
        >
          <CalendarIcon className='dark:*:fill-white' />
          {customDateFilter[0] ? (
            <p>
              {customDateFilter[0] && formatDateToDDMMYY(customDateFilter[0])}
              {customDateFilter[1] && ' ' + '-' + ' ' + formatDateToDDMMYY(customDateFilter[1])}
            </p>
          ) : (
            <p>Select dates</p>
          )}
          <ChevronDownIcon className='dark:*:stroke-white' />
        </button>
        {isCalendarOpen && (
          <div
            ref={calendarRef}
            className='absolute right-0 top-[130%] z-20 rounded-lg bg-white p-2 px-1 shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)] dark:bg-dark-secondary'
          >
            <DatePicker
              maxDate={new Date()}
              styles={{
                month: {
                  borderCollapse: 'separate',
                },
                weekday: {
                  color: `${isDark ? 'white' : 'black'}`,
                  fontWeight: 600,
                  fontSize: '12px',
                },
                calendarHeader: {
                  height: 36,
                  marginBottom: 4,
                },
                calendarHeaderControl: {
                  width: '50px',
                  padding: '0',
                  borderRadius: '8px',
                  border: 'none',
                },
                calendarHeaderLevel: {
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  border: 'none',
                },
                yearsListControl: {
                  border: `2px solid ${isDark ? '#d0d5dd' : '#d0d5dd'}`,
                  borderRadius: '8px',
                  background: '#f3f5f8',
                  fontSize: '12px',
                  color: '#667185',
                  margin: '2px',
                },
                monthsListControl: {
                  border: `2px solid ${isDark ? '#d0d5dd' : '#d0d5dd'}`,
                  borderRadius: '8px',
                  background: '#f3f5f8',
                  fontSize: '12px',
                  color: '#667185',
                  margin: '2px',
                },
                calendarHeaderControlIcon: {
                  color: `${isDark ? 'blue' : '#f56630'}`,
                  width: '20px',
                  height: '20px',
                  display: 'block',
                },
                day: {
                  fontWeight: 600,
                  fontSize: '12px',
                  padding: 0,
                  borderRadius: '10px',
                  borderWidth: '2px',
                  margin: 2,
                  width: 36,
                  height: 36,
                  display: 'grid',
                  placeItems: 'center',
                },
              }}
              type='range'
              value={customDateFilter}
              onChange={setCustomDateFilter}
              classNames={{
                day: 'calendarDay hover:bg-gray-100 dark:hover:bg-gray-600',
                yearsListControl:
                  'hover:!bg-[#fbf1f1] hover:!border-[#d35d24] hover:!text-[#475367]',
                monthsListControl:
                  'hover:!bg-[#fbf1f1] hover:!border-[#d35d24] hover:!text-[#475367]',
                calendarHeaderLevel: 'hover:!bg-[#f3f5f8] dark:!text-white dark:hover:!bg-gray-700',
                calendarHeaderControl: 'hover:!bg-[#f3f5f8] dark:hover:!bg-gray-700',
              }}
              nextIcon={<ChevronRightIcon />}
              previousIcon={<ChevronLeftIcon />}
            />
          </div>
        )}
      </div>
    </MantineProvider>
  );
};
export default DatePickerComponent;
