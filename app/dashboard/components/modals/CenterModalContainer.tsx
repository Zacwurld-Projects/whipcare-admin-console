'use client';
import DarkOverlay from '../DarkOverlay';
import ArrowLeftIcon from '../../assets/arrowLeft.svg';

const CenterModalContainer = ({
  onClick,
  children,
  title,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <DarkOverlay className='center-grid'>
      <article
        className={`flex-column w-[434px] gap-7 rounded-lg bg-white px-6 py-8 dark:bg-dark-secondary min-[1100px]:ml-[248px]`}
      >
        <div className='flex items-center gap-20'>
          <button
            onClick={(e) => onClick(e)}
            className='center-grid size-8 rounded-full bg-gray-100 dark:bg-transparent'
          >
            <ArrowLeftIcon className='dark:*:fill-white' />
          </button>
          <h5 className='heading-h5 font-medium text-gray-800 dark:text-white'>{title}</h5>
        </div>
        {children}
      </article>
    </DarkOverlay>
  );
};
export default CenterModalContainer;
