'use client';
import ExportTable from './components/ExportTable';
import FilterForm from './components/FilterForm';
import DotsIcon from '../../assets/dotsIcon.svg';
import TablePagination from './components/TablePagination';
import { useState, useEffect } from 'react';

function formatTimestampToCustomDate(timestamp: number) {
  const date = new Date(timestamp);

  // Format date components
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  // Convert to desired format
  const formatted = date.toLocaleString('en-US', options);
  const [month, year, time] = formatted.split(',');

  return (
    <p>
      {month}, {year} <span className='text-[#d0d5dd]'>|</span> {time}
    </p>
  );
}

const ActivityTable = ({
  tableHeadings,
  tableContent,
}: {
  tableHeadings: string[];
  tableContent: {
    type: string;
    description: string;
    timeStamp: number;
  }[];
}) => {
  const contentPerPage = 6;
  const totalPages = Math.ceil(tableContent.length / contentPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedContent, setDisplayedContent] = useState(tableContent.slice(0, 6));

  useEffect(() => {
    const startIndex = (currentPage - 1) * contentPerPage;
    const endIndex = Math.min(currentPage * contentPerPage, tableContent.length);
    setDisplayedContent(tableContent.slice(startIndex, endIndex));
  }, [currentPage, contentPerPage]);

  return (
    <article className='rounded-lg border border-[#e0ddd9] bg-white'>
      <div className='flex w-full justify-between px-6 py-4'>
        <FilterForm />
        <ExportTable />
      </div>
      <div className='border-y border-gray-200 px-6'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200 bg-gray-50'>
              {tableHeadings.map((item) => (
                <th
                  key={item}
                  className={`text-xsmall px-6 py-3 text-left font-medium text-gray-700`}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedContent.map((item, index) => (
              <tr key={index} className='[&_td]:text-small [&_td]:p-6 [&_td]:text-gray-700'>
                <td className=' '>
                  <p className='font-medium text-gray-900'>{item.type}</p>
                </td>
                <td className='font-medium'>{item.description}</td>
                <td>{formatTimestampToCustomDate(item.timeStamp)}</td>
                <td>
                  <p className='text-small w-fit rounded-[12px] bg-primary-50 px-2 py-[2px] text-[#983504]'>
                    Label
                  </p>
                </td>
                <td>
                  <button className='center-grid size-8 rounded-lg border border-gray-200'>
                    <DotsIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='px-6'>
        <TablePagination
          contentPerPage={contentPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          contentLength={tableContent.length}
        />
      </div>
    </article>
  );
};
export default ActivityTable;
