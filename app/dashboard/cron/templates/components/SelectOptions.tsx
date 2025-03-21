'use client';
import { ChangeEvent, useRef } from 'react';
import ChevronDownIcon from '../../../assets/grayChevronRightIcon.svg';
import useMenu from '@/app/hooks/useMenu';

const SelectOptions = ({
  value,
  options,
  title,
  changeValue,
  checkbox,
  changeCheckedValue,
}: {
  value?: string | string[];
  checkbox?: boolean;
  options: string[];
  title: string;
  changeValue?: (value: string) => void;
  changeCheckedValue?: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
}) => {
  const selectButton = useRef<HTMLButtonElement>(null);
  const selectMenu = useRef<HTMLDivElement>(null);

  const { isMenuOpen, setIsMenuOpen } = useMenu(selectButton, selectMenu);

  return (
    <div className='flex-column gap-1'>
      <p className='text-sm font-medium text-[#475367] dark:text-white'>{title}</p>
      <div className='relative w-full'>
        <button
          ref={selectButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex w-full items-center justify-between rounded-lg border border-[#d0d5dd] p-4 text-sm text-gray-600 dark:border-dark-tertiary dark:bg-dark-primary dark:text-white ${isMenuOpen ? 'border-[#fa9874]' : ''}`}
        >
          <p>
            {' '}
            {value && value.length > 0 ? (
              typeof value === 'string' ? (
                value
              ) : (
                value.join(', ')
              )
            ) : (
              <span className='text-[#98a2b3] dark:text-white'>Select option</span>
            )}
          </p>
          <ChevronDownIcon
            className={`dark: rotate-90 transition-transform dark:*:fill-white ${isMenuOpen ? 'rotate-[-90deg]' : ''}`}
          />
        </button>
        {isMenuOpen && (
          <div
            ref={selectMenu}
            className='absolute right-0 top-[calc(100%+8px)] z-[10] w-[180px] rounded bg-white py-[10px] shadow-[0px_2px_20px_0px_#00000021] dark:bg-dark-primary'
          >
            {options.map((item, index) => {
              return checkbox ? (
                <label
                  htmlFor={item}
                  key={index}
                  className='flex w-full items-center gap-3 px-4 pb-1 pt-2 text-gray-500 hover:bg-primary-50 hover:text-[#983504] dark:text-white dark:hover:bg-dark-bg dark:hover:text-[#ff9e7a]'
                >
                  <input
                    type='checkbox'
                    name={item}
                    id={item}
                    checked={value?.includes(item) || false}
                    className='peer hidden'
                    onChange={(e) => {
                      if (changeCheckedValue) changeCheckedValue(e, item);
                    }}
                  />
                  <div className='size-3 rounded-sm border-2 border-gray-500 bg-white peer-checked:border-[#EB5017] peer-checked:bg-[#eb7e17] dark:border-white dark:bg-dark-primary dark:peer-checked:border-[#eb7e17] dark:peer-checked:bg-[#ff9e7a]'></div>
                  <p className='text-sm'>{item}</p>
                </label>
              ) : (
                <button
                  onClick={() => {
                    if (changeValue) {
                      changeValue(item);
                    }
                    setIsMenuOpen(false);
                  }}
                  className='w-full px-4 pb-1 pt-2 text-left text-sm text-gray-500 hover:bg-primary-50 hover:text-[#983504] dark:text-white dark:hover:bg-dark-bg dark:hover:text-[#ff9e7a]'
                  key={index}
                >
                  {item}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default SelectOptions;
