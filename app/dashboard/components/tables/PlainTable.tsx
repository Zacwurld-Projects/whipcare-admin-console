'use client';
import ChevronDownIcon from '../../assets/chevronDown.svg';
import DownloadIcon from '../../assets/downloadIcon.svg';
import PDFIcon from '../../assets/pdfFileIcon.svg';
import PNGIcon from '../../assets/pngFileIcon.svg';
import XLSIcon from '../../assets/xlsFileIcon.svg';
import OpenLinkIcon from '../../assets/openLinkIcon.svg';

import { useEffect, useRef, useState } from 'react';
import useMenu from '@/app/hooks/useMenu';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import Link from 'next/link';
import TablePagination from './components/TablePagination';
import FilterForm from './components/FilterForm';

const tableHeadings = [
  'No',
  'User name',
  'Email address',
  'Phone',
  'Sign up Date',
  'Last Login Date',
  'Action',
];

const tableContent: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  signUp: number;
  lastLogin: number;
}> = Array(163).fill({
  id: '1234567',
  name: 'Isaac Zacwurld',
  email: 'Isaaczac@gmail.com',
  phone: '+1 453 6780 690',
  signUp: Date.now() - 30 * 24 * 60 * 60 * 1000,
  lastLogin: Date.now() - 24 * 60 * 60 * 1000,
});

const PlainTable = () => {
  const contentPerPage = 15;
  const totalPages = Math.ceil(tableContent.length / contentPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedContent, setDisplayedContent] = useState(tableContent.slice(0, 15));

  useEffect(() => {
    if (currentPage < totalPages)
      setDisplayedContent(
        tableContent.slice((currentPage - 1) * contentPerPage, currentPage * contentPerPage),
      );
    else
      setDisplayedContent(
        tableContent.slice((currentPage - 1) * contentPerPage, tableContent.length),
      );
  }, [currentPage, displayedContent]);

  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const { isMenuOpen: isExportMenuOpen, setIsMenuOpen: setIsExportMenuOpen } = useMenu(
    exportButtonRef,
    exportMenuRef,
  );

  return (
    <article className='w-full rounded-lg border border-[#e0ddd9] bg-white px-6 py-4'>
      <div className='mb-[36px] flex items-center justify-between'>
        <h6 className='heading-h6 font-semibold'>Users Info</h6>
        <div className='[&_button]:text-small flex items-center gap-2 [&_button]:rounded-[2em] [&_button]:border [&_button]:border-gray-200 [&_button]:px-6 [&_button]:py-2 [&_button]:font-medium [&_button]:text-gray-800'>
          <button>All</button>
          <button>New</button>
          <button className='flex items-center gap-2'>
            <p>Sort by</p>
            <ChevronDownIcon />
          </button>
        </div>
      </div>
      <div className='mb-5 flex items-center justify-between'>
        <FilterForm />
        <div className='relative'>
          <button
            ref={exportButtonRef}
            className='text-small flex items-center gap-[10px] rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700'
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
          >
            <div className='flex items-center gap-2'>
              <DownloadIcon />
              <p>Export table</p>
            </div>
            <ChevronDownIcon />
          </button>
          {isExportMenuOpen && (
            <div
              className='flex-column [&_button]:text-small absolute right-0 top-[calc(100%+16px)] w-[176px] rounded bg-white py-[10px] shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)] [&_button]:flex [&_button]:items-center [&_button]:gap-3 [&_button]:px-4 [&_button]:py-2 [&_button]:pb-1 [&_button]:text-gray-500'
              ref={exportMenuRef}
            >
              <button className='hover:bg-primary-50 hover:text-[#983504] [&_path]:hover:fill-[#983504]'>
                <PNGIcon />
                <p>As PNG</p>
              </button>
              <button className='hover:bg-primary-50 hover:text-[#983504] [&_path]:hover:fill-[#983504]'>
                <PDFIcon />
                <p>As PDF</p>
              </button>
              <button className='hover:bg-primary-50 hover:text-[#983504] [&_path]:hover:fill-[#983504]'>
                <XLSIcon />
                <p>As XLS</p>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className='w-full'>
        <table className='w-full'>
          <thead>
            <tr>
              {tableHeadings.map((item) => (
                <th
                  key={item}
                  className='text-xsmall px-[14px] py-3 text-left font-medium text-gray-500'
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedContent.map((item, index) => (
              <tr
                key={index}
                className='[&_td]:text-xsmall border-y border-y-gray-75 [&_td]:px-[14px] [&_td]:py-3 [&_td]:font-medium [&_td]:text-gray-800'
              >
                <td>{(currentPage - 1) * contentPerPage + index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td className='capitalize'>{timeAgo(item.signUp)}</td>
                <td className='capitalize'>{timeAgo(item.lastLogin)}</td>
                <td>
                  <Link href={`/dashboard/user-management/${item.id}`}>
                    <OpenLinkIcon />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        contentLength={tableContent.length}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </article>
  );
};
export default PlainTable;
