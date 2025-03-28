'use client';
import Link from 'next/link';
import { ComponentType } from 'react';
import { BaseTableData } from '@/app/lib/mockTypes';

interface PlainTableProps<T extends BaseTableData> {
  page: string;
  heading: string;
  isLoading?: boolean;
  onClickRows?: (item: T) => void;
  content: T[];
  headings: Array<string>;
  ContentStructure?: ComponentType<{ item: T; index: number }>;
}

const DefaultContentStructure = <T extends BaseTableData>({ item }: { item: T }) => {
  return (
    <>
      <td>{item._id}</td>
      <td>{item.createdAt}</td>
      <td>{item.lastLogin}</td>
    </>
  );
};

const PlainTable = <T extends BaseTableData>({
  page,
  heading,
  content,
  onClickRows,
  headings,
  ContentStructure = DefaultContentStructure,
}: PlainTableProps<T>) => {
  return (
    <article className='w-full rounded-lg border border-[#e0ddd9] bg-white px-6 py-4 dark:border-transparent dark:bg-dark-secondary'>
      <div className='flex items-center justify-between px-[10px] py-4'>
        <h6 className='heading-h6 font-semibold dark:text-white'>{heading}</h6>
        {content.length > 1 && (
          <Link
            href={`/dashboard/${page}/info`}
            className='text-small font-medium text-gray-500 dark:text-white'
          >
            View all
          </Link>
        )}
      </div>
      <div className='w-full overflow-x-auto scrollbar'>
        <table className='w-full min-w-[1100px]'>
          <thead>
            <tr>
              {headings.map((item) => (
                <th
                  key={item}
                  className='text-xsmall px-[14px] py-3 text-left font-medium text-gray-500 dark:text-white'
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.map((item, index) => (
              <tr
                className={`border-y border-y-gray-75 dark:border-dark-primary [&_:first-child]:rounded-l-lg [&_:last-child]:rounded-r-lg [&_td]:px-[14px] [&_td]:py-3 [&_td]:text-xs [&_td]:font-medium [&_td]:text-gray-800 dark:[&_td]:text-white ${onClickRows ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-primary' : ''}`}
                key={index}
                onClick={() => {
                  if (onClickRows) onClickRows(item);
                }}
              >
                <ContentStructure index={index} item={item} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};
export default PlainTable;
