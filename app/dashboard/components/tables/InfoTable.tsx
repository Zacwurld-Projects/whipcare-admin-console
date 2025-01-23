'use client';

import OpenLinkIcon from '../../assets/openLinkIcon.svg';
import ChevronDownIcon from '../../assets/chevronDown.svg';
import { ComponentType, Dispatch } from 'react';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import Link from 'next/link';
import TablePagination from './components/TablePagination';
import FilterForm from './components/FilterForm';
import ExportTable from './components/ExportTable';

const InfoTable = ({
  page,
  heading,
  data,
  headings,
  currentPage,
  setCurrentPage,
  ContentStructure,
}: {
  page: string;
  heading: string;
  currentPage: number;
  setCurrentPage: Dispatch<number>;
  data: {
    data: {
      _id: string;
      firstName: string;
      lastName: string;
      image?: null | string;
      email: string;
      phone: string | null;
      services?: string[];
      createdAt: string;
      lastLogin: string;
      status?: string;
    }[];
    totalCount: number;
  };
  headings: Array<string>;
  ContentStructure?: ComponentType<{ item: (typeof data.data)[0] }>;
}) => {
  const contentPerPage = 15;
  const totalPages = Math.ceil(data.totalCount / contentPerPage);

  const reflectStatusStyle = (status: string) => {
    switch (true) {
      case status === 'deactivated':
        return `bg-[#fbeae9] text-[#dd524d]`;
      case status === 'not verified':
        return `bg-primary-50 text-[#ff915b]`;
      case status === 'verified':
        return `bg-[#e7f6ec] text-[#40b869]`;
      default:
        return '';
    }
  };

  return (
    <article className='w-full rounded-lg border border-[#e0ddd9] bg-white px-6 py-4'>
      <div className='mb-[36px] flex items-center justify-between'>
        <h6 className='heading-h6 font-semibold'>{heading}</h6>
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
      <div className='w-full scrollbar'>
        <table className='w-full'>
          <thead>
            <tr>
              {headings.map((item) => (
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
            {data.data.map((item, index) =>
              ContentStructure ? (
                <ContentStructure key={index} item={item} />
              ) : (
                <tr
                  key={index}
                  className='[&_td]:text-xsmall border-y border-y-gray-75 [&_td]:px-[14px] [&_td]:py-3 [&_td]:font-medium [&_td]:text-gray-800'
                >
                  <td>{index + 1}</td>
                  <td>
                    <Link className='hover:underline' href={`/dashboard/${page}/${item._id}`}>
                      {item.firstName} {item.lastName}
                    </Link>
                  </td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  {item.services && <td className='capitalize'>{item.services[0]}</td>}
                  <td className='capitalize'>{timeAgo(item.createdAt)}</td>
                  <td className='capitalize'>{timeAgo(item.lastLogin)}</td>
                  {page === 'service-provider' ? (
                    item.status ? (
                      <td>
                        <Link href={`/dashboard/${page}/${item._id}`}>
                          <p
                            className={`text-xsmall rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${reflectStatusStyle(item.status)}`}
                          >
                            {item.status}
                          </p>
                        </Link>
                      </td>
                    ) : (
                      <td></td>
                    )
                  ) : (
                    <td>
                      <Link href={`/dashboard/user-management/${item._id}`}>
                        <OpenLinkIcon />
                      </Link>
                    </td>
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        contentPerPage={contentPerPage}
        contentLength={data.totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </article>
  );
};
export default InfoTable;
