'use client';

import OpenLinkIcon from '../../assets/openLinkIcon.svg';
import ChevronDownIcon from '../../assets/chevronDown.svg';
import { useEffect, useState } from 'react';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import Link from 'next/link';
import TablePagination from './components/TablePagination';
import FilterForm from './components/FilterForm';
import ExportTable from './components/ExportTable';

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
}> = Array(800).fill({
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
    const startIndex = (currentPage - 1) * contentPerPage;
    const endIndex = Math.min(currentPage * contentPerPage, tableContent.length);
    setDisplayedContent(tableContent.slice(startIndex, endIndex));
  }, [currentPage, tableContent, contentPerPage]);

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
        <ExportTable />
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
        contentPerPage={contentPerPage}
        contentLength={tableContent.length}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </article>
  );
};
export default PlainTable;
