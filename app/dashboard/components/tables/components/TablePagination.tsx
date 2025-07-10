'use client';
import { Dispatch } from 'react';
import ChevronLeftIcon from '../../../assets/grayChevronLeftIcon.svg';
import ChevronRightIcon from '../../../assets/grayChevronRightIcon.svg';

const TablePagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  contentLength,
  contentPerPage,
}: {
  currentPage: number;
  contentPerPage: number;
  totalPages: number;
  contentLength: number;
  setCurrentPage: Dispatch<number>;
}) => {
  const renderPageNumbers = () => {
    const maxVisible = currentPage < 3 ? 2 : 1;

    const range = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (i) =>
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - maxVisible && i <= currentPage + maxVisible),
    );

    const renderButton = (page: number, index: number) => (
      <button
        key={index}
        onClick={() => setCurrentPage(page)}
        className={`text-small rounded-[2em] border px-6 py-2 font-medium ${
          page === currentPage
            ? 'border-[#ff915b] bg-[#ff915b] text-white dark:border-dark-accent dark:bg-dark-accent'
            : 'border-gray-200 text-gray-800 dark:text-white'
        } `}
      >
        {page}
      </button>
    );

    return range.map((page, index) => {
      const elements = [];

      if (page === totalPages && totalPages - currentPage > 2) {
        elements.push(
          <p
            key={`before_ellipse_${page}`}
            className='text-small px-3 pb-1 pt-2 font-medium text-gray-800 dark:text-white'
          >
            ...
          </p>,
        );
      }

      elements.push(renderButton(page, index));

      if (page === 1 && currentPage > 3) {
        elements.push(
          <p
            key={`after_ellipse_${page}`}
            className='text-small px-3 pb-1 pt-2 font-medium text-gray-800 dark:text-white'
          >
            ...
          </p>,
        );
      }

      return elements;
    });
  };

  return (
    <div className='flex h-[74px] items-center justify-between px-2'>
      <p className='font-medium text-[#98a2b3] dark:text-white'>
        Showing data {(currentPage - 1) * contentPerPage + 1} to{' '}
        {currentPage * contentPerPage < contentLength
          ? currentPage * contentPerPage
          : contentLength}{' '}
        of {contentLength} entires
      </p>
      <div className='flex items-center gap-2'>
        <button
          className='center-grid size-9 rounded-full bg-gray-50'
          onClick={() => {
            if (currentPage > 1) setCurrentPage(currentPage - 1);
          }}
        >
          <ChevronLeftIcon className='dark:*:fill-dark-secondary' />
        </button>
        <div className='flex items-center gap-2'>{renderPageNumbers()}</div>
        <button
          className='center-grid size-9 rounded-full bg-gray-50'
          onClick={() => {
            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
          }}
        >
          <ChevronRightIcon className='dark:*:fill-dark-secondary' />
        </button>
      </div>
    </div>
  );
};
export default TablePagination;
