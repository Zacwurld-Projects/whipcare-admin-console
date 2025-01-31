'use client';
import ChevronDownIcon from '../../assets/chevronDown.svg';
import { ComponentType, Dispatch } from 'react';
import TablePagination from './components/TablePagination';
import FilterForm from './components/FilterForm';
import ExportTable from './components/ExportTable';
import SpinLoader from '../Loaders/SpinLoader';
import { BaseData } from '@/app/lib/mockTypes';

interface InfoTableProps<T extends BaseData> {
  heading: string;
  isLoading?: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<number>;
  data: {
    data: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  headings: Array<string>;
  ContentStructure?: ComponentType<{ item: T; index: number }>;
}

const DefaultContentStructure = <T extends BaseData>({ item }: { item: T }) => {
  return (
    <tr className='[&_td]:text-xsmall border-y border-y-gray-75 [&_td]:px-[14px] [&_td]:py-3 [&_td]:font-medium [&_td]:text-gray-800'>
      <td>{item._id}</td>
      <td>{item.createdAt}</td>
      <td>{item.lastLogin}</td>
    </tr>
  );
};

const InfoTable = <T extends BaseData>({
  heading,
  isLoading,
  data,
  headings,
  currentPage,
  setCurrentPage,
  ContentStructure = DefaultContentStructure,
}: InfoTableProps<T>) => {
  // const contentPerPage = data.pageSize;
  // const totalPages = Math.ceil(data.totalCount / contentPerPage);

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
        {isLoading ? (
          <div className='center-grid h-[60vh] w-full'>
            <SpinLoader thickness={2} size={80} color='#983504' />
          </div>
        ) : (
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
              {data.data.map((item, index) => (
                <ContentStructure index={index} key={index} item={item} />
              ))}
            </tbody>
          </table>
        )}
      </div>
      {data && (
        <TablePagination
          contentPerPage={data.pageSize}
          contentLength={data.totalCount}
          currentPage={currentPage}
          totalPages={Math.ceil(data.totalCount / data.pageSize)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </article>
  );
};
export default InfoTable;
