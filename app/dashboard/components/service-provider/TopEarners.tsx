'use client';
import Image from 'next/image';
import topPerformerImage from '../../assets/topPerformerImage.png';
import { useMemo, useState } from 'react';
import InfoTable from '../../components/tables/InfoTable';

type LeaderboardItem = {
  _id?: string;
  image?: string | null;
  firstName?: string;
  lastName?: string;
  serviceType?: string;
  amount?: number; // earnings or score
};

const PAGE_SIZE = 10;

const TopEarners = ({
  items = [],
  isLoading = false,
}: {
  items: LeaderboardItem[];
  isLoading?: boolean;
}) => {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((i) =>
      [i.firstName, i.lastName, i.serviceType]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [items, search]);
  const topTen = useMemo(() => filtered.slice(0, PAGE_SIZE), [filtered]);
  const tableData = useMemo(
    () => ({
      data: topTen,
      pageNumber: 1,
      pageSize: PAGE_SIZE,
      totalCount: topTen.length,
    }),
    [topTen],
  );

  return (
    <div className='my-8'>
      <InfoTable
        heading='Top earners'
        isLoading={isLoading}
        data={tableData}
        currentPage={1}
        setCurrentPage={() => {}}
        search={search}
        onSearch={(v) => setSearch(v)}
        onFilterClick={() => {}}
        showEmptyTableStructure
        hidePagination
        headings={['No', 'Name', 'Service Type', 'Amount', 'Avatar']}
        ContentStructure={({ item, index }) => (
          <>
            <td>{index + 1}</td>
            <td>{(item.firstName || '') + ' ' + (item.lastName || '')}</td>
            <td className='capitalize'>{item.serviceType || ''}</td>
            <td>
              {typeof item.amount === 'number' ? `#${item.amount.toLocaleString('en-US')}` : '—'}
            </td>
            <td>
              <Image
                src={(item.image as string) || (topPerformerImage as unknown as string)}
                alt={`${item.firstName || ''} ${item.lastName || ''}`}
                height={36}
                width={36}
                className='rounded-[6px] object-cover'
              />
            </td>
          </>
        )}
        onClickRows={undefined}
        showItemNumber={false}
        emptyStateProps={{
          title: 'No top earners',
          subText: 'There are no earnings to display for the selected period.',
          icon: undefined,
        }}
      />
    </div>
  );
};
export default TopEarners;
