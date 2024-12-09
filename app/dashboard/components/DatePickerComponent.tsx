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

const DatePickerComponent = ({
  setSelectedFilter,
  selectedFilter,
  customDateFilter,
  setCustomDateFilter,
}: {
  selectedFilter: string | Array<Date | null>;
  setSelectedFilter: Dispatch<string | Array<Date | null>>;
  customDateFilter: [Date | null, Date | null];
  setCustomDateFilter: Dispatch<[Date | null, Date | null]>;
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calenderButtonRef = useRef<HTMLButtonElement>(null);
  const { isMenuOpen: isCalendarOpen, setIsMenuOpen: setIsCalendarOpen } = useMenu(
    calenderButtonRef,
    calendarRef,
  );

  useEffect(() => {
    if (customDateFilter[0]) setSelectedFilter(customDateFilter);
    else setSelectedFilter('today');
  }, [customDateFilter]);

  return (
    <MantineProvider>
      <div className='relative'>
        <button
          className={`flex items-center gap-1 border-gray-200 ${typeof selectedFilter !== 'string' ? '!border-[#ff915b] bg-[#fcb59a]' : ''}`}
          onClick={() => {
            setIsCalendarOpen(!isCalendarOpen);
            if (customDateFilter[0]) setSelectedFilter(customDateFilter);
          }}
          ref={calenderButtonRef}
        >
          <CalendarIcon />
          {customDateFilter[0] ? (
            <p>
              {customDateFilter[0] && formatDateToDDMMYY(customDateFilter[0])}
              {customDateFilter[1] && ' ' + '-' + ' ' + formatDateToDDMMYY(customDateFilter[1])}
            </p>
          ) : (
            <p>Select dates</p>
          )}
          <ChevronDownIcon />
        </button>
        {isCalendarOpen && (
          <div
            ref={calendarRef}
            className='absolute right-0 top-[130%] z-20 rounded-lg bg-white p-2 px-1 shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)]'
          >
            <DatePicker
              styles={{
                month: {
                  borderCollapse: 'separate',
                },
                weekday: {
                  color: 'black',
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
                  border: '2px solid #d0d5dd',
                  borderRadius: '8px',
                  background: '#f3f5f8',
                  fontSize: '12px',
                  color: '#667185',
                  margin: '2px',
                },
                monthsListControl: {
                  border: '2px solid #d0d5dd',
                  borderRadius: '8px',
                  background: '#f3f5f8',
                  fontSize: '12px',
                  color: '#667185',
                  margin: '2px',
                },
                calendarHeaderControlIcon: {
                  color: '#f56630',
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
                day: 'calendarDay hover:bg-gray-100',
                yearsListControl:
                  'hover:!bg-[#fbf1f1] hover:!border-[#d35d24] hover:!text-[#475367]',
                monthsListControl:
                  'hover:!bg-[#fbf1f1] hover:!border-[#d35d24] hover:!text-[#475367]',
                calendarHeaderLevel: 'hover:!bg-[#f3f5f8]',
                calendarHeaderControl: 'hover:!bg-[#f3f5f8]',
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
