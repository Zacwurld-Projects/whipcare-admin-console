'use client';
import CalendarIcon from '@/app/dashboard/assets/calendarIcon.svg';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useRef } from 'react';

export const handleInputChange = <
  T extends Record<string, string | boolean | undefined | string[]>,
>(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  data: T,
  setData: Dispatch<SetStateAction<T>>,
) => {
  const { name, type, value } = e.target;

  setData((prev) => ({
    ...prev,
    [name]: type === 'date' ? dayjs(value).toISOString() : value,
  }));
};

const InputFields = <T extends Record<string, string | boolean | undefined | string[]>>({
  type,
  value,
  textDesc,
  name,
  data,
  setData,
  title,
  placeholder,
}: {
  type: 'text' | 'textarea' | 'date';
  value: string;
  name: string;
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  title: string;
  placeholder?: string;
  textDesc?: string;
}) => {
  const dateRef = useRef<HTMLInputElement>(null);

  if (type === 'textarea')
    return (
      <label className='flex-column gap-1' htmlFor={name}>
        <p className='text-sm font-medium text-[#475367] dark:text-white'>{title}</p>
        <textarea
          name={name}
          id={name}
          placeholder={placeholder ? placeholder : 'Enter text here...'}
          value={value}
          onChange={(e) => handleInputChange(e, data, setData)}
          rows={4}
          className='resize-none rounded-[6px] border border-[#d0d5dd] p-4 text-sm text-gray-600 scrollbar placeholder:text-[#98a2b3] focus:border-[#fa9874] focus:outline-none dark:border-dark-tertiary dark:bg-dark-primary dark:text-white dark:placeholder:text-white'
        ></textarea>
        <p className='text-sm text-gray-500 dark:text-white'>Keep this simple of 50 characters</p>
      </label>
    );

  if (type === 'date') {
    return (
      <div className='flex-column gap-1'>
        <p className='text-sm font-medium text-[#475367] dark:text-white'>{title}</p>
        <label
          className='relative flex items-center gap-3 rounded-[6px] border border-[#d0d5dd] p-4 focus-within:border-[#fa9874] dark:border-dark-tertiary dark:bg-dark-primary dark:text-white'
          htmlFor={name}
          onClick={() => dateRef.current?.showPicker()}
        >
          <CalendarIcon />
          <p className='w-full text-sm text-gray-600 dark:text-white'>
            {value ? dayjs(value).format('DD/MM/YYYY') : 'Select date'}
          </p>
          <input
            type='date'
            placeholder='Select Date'
            id={name}
            ref={dateRef}
            name={name}
            value={dayjs(value).format('YYYY-MM-DD')}
            onChange={(e) => handleInputChange(e, data, setData)}
            className='invisible absolute placeholder:text-[#98a2b3] focus:outline-none'
          />
        </label>
      </div>
    );
  }
  return (
    <label className='flex-column gap-1' htmlFor={name}>
      <p className='text-sm font-medium text-[#475367] dark:text-white'>{title}</p>
      <input
        type='text'
        id={name}
        name={name}
        value={value}
        onChange={(e) => handleInputChange(e, data, setData)}
        placeholder={placeholder ? placeholder : 'Enter Text'}
        className='rounded-[6px] border border-[#d0d5dd] p-4 text-sm text-gray-600 placeholder:text-[#98a2b3] focus:border-[#fa9874] focus:outline-none dark:border-dark-tertiary dark:bg-dark-primary dark:text-white dark:placeholder:text-white'
      />
      {textDesc && <p className='text-sm text-gray-500 dark:text-white'>{textDesc}</p>}
    </label>
  );
};
export default InputFields;
