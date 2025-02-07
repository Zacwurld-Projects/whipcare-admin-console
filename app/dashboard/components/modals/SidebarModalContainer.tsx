'use client';
import DarkOverlay from '../DarkOverlay';
import LeftArrowIcon from '../../assets/leftArrow.svg';
import { Dispatch, useRef } from 'react';

const SidebarModalContainer = ({
  children,
  setIsDisplayingBookingDetails,
}: {
  children: React.ReactNode;
  setIsDisplayingBookingDetails: Dispatch<boolean>;
}) => {
  const DetailsAsideRef = useRef<HTMLDivElement>(null);

  return (
    <DarkOverlay
      exitFunction={(e) => {
        if (!DetailsAsideRef.current?.contains(e.target as Node)) {
          setIsDisplayingBookingDetails(false);
        }
      }}
    >
      <aside
        ref={DetailsAsideRef}
        className='ml-auto min-h-full w-[calc(50%-132px)] min-w-[500px] bg-white p-6 opacity-100 dark:bg-dark-secondary max-[1100px]:w-[50%]'
      >
        <button
          className='center-grid sticky top-6 mb-4 size-[36px] rounded-full border border-[#d1d5db] dark:border-white'
          onClick={() => setIsDisplayingBookingDetails(false)}
        >
          <LeftArrowIcon className='dark:*:fill-white' />
        </button>
        {children}
      </aside>
    </DarkOverlay>
  );
};

export default SidebarModalContainer;
