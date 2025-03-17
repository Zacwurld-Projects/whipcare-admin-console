'use client';
import DarkOverlay from '../DarkOverlay';
import LeftArrowIcon from '../../assets/leftArrow.svg';
import { useRef } from 'react';

const SidebarModalContainer = ({
  children,
  closeModal,
}: {
  children: React.ReactNode;
  closeModal: () => void;
}) => {
  const DetailsAsideRef = useRef<HTMLDivElement>(null);

  return (
    <DarkOverlay
      exitFunction={(e) => {
        if (!DetailsAsideRef.current?.contains(e.target as Node)) {
          closeModal();
        }
      }}
    >
      <aside
        ref={DetailsAsideRef}
        className='ml-auto min-h-full w-[calc(50%-132px)] min-w-[500px] bg-white p-6 opacity-100 dark:bg-dark-secondary max-[1100px]:w-[50%]'
      >
        <button
          className='center-grid relative mb-4 size-[36px] rounded-full border border-[#d1d5db] dark:border-white'
          onClick={closeModal}
        >
          <LeftArrowIcon className='dark:*:fill-white' />
        </button>
        {children}
      </aside>
    </DarkOverlay>
  );
};

export default SidebarModalContainer;
