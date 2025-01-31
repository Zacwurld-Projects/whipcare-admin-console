'use client';
import Link from 'next/link';
import { ComponentType } from 'react';
import { BaseData } from '@/app/lib/mockTypes';

interface PlainTableProps<T extends BaseData> {
  page: string;
  heading: string;
  isLoading?: boolean;
  content: T[];
  headings: Array<string>;
  ContentStructure?: ComponentType<{ item: T; index: number }>;
}

const DefaultContentStructure = <T extends BaseData>({ item }: { item: T }) => {
  return (
    // <tr key={index}
    //               className='[&_td]:text-xsmall border-y border-y-gray-75 [&_td]:px-[14px] [&_td]:py-3 [&_td]:font-medium [&_td]:text-gray-800'
    //             >
    //               <td>{index + 1}</td>
    //               <td>
    //                 <Link className='hover:underline' href={`/dashboard/${page}/${item._id}`}>
    //                   {item.firstName} {item.lastName}
    //                 </Link>
    //               </td>
    //               <td>{item.email}</td>
    //               <td>{item.phone}</td>
    //               {item.services && <td className='capitalize'>{item.services[0]}</td>}
    //               <td className='capitalize'>{timeAgo(item.createdAt)}</td>
    //               <td className='capitalize'>{timeAgo(item.lastLogin)}</td>
    //               {page === 'service-provider' ? (
    //                 item.status ? (
    //                   <td>
    //                     <Link href={`/dashboard/${page}/${item._id}`}>
    //                       <p
    //                         className={`text-xsmall rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${reflectStatusStyle(item.status)}`}
    //                       >
    //                         {item.status}
    //                       </p>
    //                     </Link>
    //                   </td>
    //                 ) : (
    //                   <td></td>
    //                 )
    //               ) : (
    //                 <td>
    //                   <Link href={`/dashboard/user-management/${item._id}`}>
    //                     <OpenLinkIcon />
    //                   </Link>
    //                 </td>
    //               )}
    //             </tr>

    <tr className='[&_td]:text-xsmall border-y border-y-gray-75 [&_td]:px-[14px] [&_td]:py-3 [&_td]:font-medium [&_td]:text-gray-800'>
      <td>{item._id}</td>
      <td>{item.createdAt}</td>
      <td>{item.lastLogin}</td>
    </tr>
  );
};

const PlainTable = <T extends BaseData>({
  page,
  heading,
  content,
  headings,
  ContentStructure = DefaultContentStructure,
}: PlainTableProps<T>) => {
  return (
    <article className='w-full rounded-lg border border-[#e0ddd9] bg-white px-6 py-4'>
      <div className='flex items-center justify-between px-[10px] py-4'>
        <h6 className='heading-h6 font-semibold'>{heading}</h6>
        {content.length > 1 && (
          <Link href={`/dashboard/${page}/info`} className='text-small font-medium text-gray-500'>
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
                  className='text-xsmall px-[14px] py-3 text-left font-medium text-gray-500'
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.map((item, index) => (
              <ContentStructure index={index} key={index} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};
export default PlainTable;
