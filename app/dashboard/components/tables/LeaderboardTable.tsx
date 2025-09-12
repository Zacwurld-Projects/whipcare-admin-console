'use client';
import { useMemo, useState } from 'react';

import Image from 'next/image';
import LeaderboardFilterModal from '../modals/LeaderboardFilterModal';

type TimeRange = 'today' | 'week' | 'month' | 'custom';

type BaseItem = {
  _id?: string;
  image?: string | null;
  businessName?: string;
  firstName?: string;
  lastName?: string;
  serviceType?: string;
  city?: string;
  // Optional metrics used depending on leaderboard type
  totalBookings?: number;
  averageRating?: number; // 0..5
  repeatBookings?: number;
  score?: number; // computed for main leaderboard
  amount?: number; // earnings for top earners
};

export type LeaderboardKind = 'performers' | 'earners';

export default function LeaderboardTable({
  kind,
  items,
  title,
  useDemoWhenEmpty = true,
  renderCount = 10,
}: {
  kind: LeaderboardKind;
  items: BaseItem[];
  title: string;
  useDemoWhenEmpty?: boolean;
  renderCount?: number;
}) {
  // Local UI state
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [tab, setTab] = useState<'all' | 'city' | 'category'>('all');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [minDate, setMinDate] = useState<string>('');
  const [maxDate, setMaxDate] = useState<string>('');

  // Demo data (only for preview when there's no data)
  const demoData: BaseItem[] = useMemo(() => {
    if (kind === 'performers')
      return [
        {
          _id: 'd1',
          firstName: 'John',
          lastName: 'M.',
          businessName: 'John Mechanics',
          serviceType: 'Car Mechanic',
          city: 'Lagos',
          totalBookings: 158,
          averageRating: 4.9,
          repeatBookings: 46,
        },
        {
          _id: 'd2',
          firstName: 'Ruth',
          lastName: 'E.',
          businessName: 'Ruth Detailers',
          serviceType: 'Detailer',
          city: 'Port Harcourt',
          totalBookings: 141,
          averageRating: 4.8,
          repeatBookings: 38,
        },
        {
          _id: 'd3',
          firstName: 'Taiwo',
          lastName: 'A.',
          businessName: 'Enugu Car Wash',
          serviceType: 'Car Wash',
          city: 'Enugu',
          totalBookings: 132,
          averageRating: 4.9,
          repeatBookings: 29,
        },
      ];
    // earners
    return [
      {
        _id: 'e1',
        firstName: 'Ahmed',
        lastName: 'B.',
        businessName: 'HaulPro Logistics',
        serviceType: 'Hauler',
        city: 'Lagos',
        amount: 1100000,
      },
      {
        _id: 'e2',
        firstName: 'Uche',
        lastName: 'T.',
        businessName: 'Lekki Mechanics',
        serviceType: 'Car Mechanic',
        city: 'Lekki',
        amount: 700000,
      },
      {
        _id: 'e3',
        firstName: 'Funke',
        lastName: 'O.',
        businessName: 'Abuja Detailers',
        serviceType: 'Detailer',
        city: 'Abuja',
        amount: 500000,
      },
    ];
  }, [kind]);

  const baseItems = items && items.length > 0 ? items : useDemoWhenEmpty ? demoData : [];

  const cityOptions = useMemo(
    () => Array.from(new Set(baseItems.map((i) => i.city).filter(Boolean))) as string[],
    [baseItems],
  );
  const categoryOptions = useMemo(
    () => Array.from(new Set(baseItems.map((i) => i.serviceType).filter(Boolean))) as string[],
    [baseItems],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return baseItems
      .filter((i) => {
        const matchesSearch = !q
          ? true
          : [i.firstName, i.lastName, i.businessName, i.serviceType, i.city]
              .filter(Boolean)
              .some((v) => String(v).toLowerCase().includes(q));
        const matchesCity =
          tab !== 'city' || !city ? true : (i.city || '').toLowerCase() === city.toLowerCase();
        const matchesCategory =
          tab !== 'category' || !category
            ? true
            : (i.serviceType || '').toLowerCase() === category.toLowerCase();
        return matchesSearch && matchesCity && matchesCategory;
      })
      .map((i) => {
        if (kind === 'performers') {
          // compute score if not provided
          if (typeof i.score === 'number') return i;
          const bookings = i.totalBookings ?? 0;
          const rating = i.averageRating ?? 0;
          const repeats = i.repeatBookings ?? 0;
          const score = bookings * 0.5 + rating * 10 + repeats;
          return { ...i, score } as BaseItem;
        }
        return i;
      })
      .sort((a, b) => {
        if (kind === 'performers') return (b.score ?? 0) - (a.score ?? 0);
        // earners
        return (b.amount ?? 0) - (a.amount ?? 0);
      });
  }, [baseItems, search, tab, city, category, kind]);

  const top = useMemo(() => filtered.slice(0, renderCount), [filtered, renderCount]);

  const Medal = ({ rank }: { rank: number }) =>
    rank === 1 ? (
      <span title='1st' className='text-xl'>
        🥇
      </span>
    ) : rank === 2 ? (
      <span title='2nd' className='text-xl'>
        🥈
      </span>
    ) : rank === 3 ? (
      <span title='3rd' className='text-xl'>
        🥉
      </span>
    ) : null;

  return (
    <article className='w-full rounded-lg border border-[#e0ddd9] bg-white px-4 py-4 dark:border-transparent dark:bg-dark-secondary'>
      {/* Header with search and filter */}
      <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
        <h6 className='heading-h6 font-semibold dark:text-white'>{title}</h6>
        <div className='flex items-center gap-2'>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search providers'
            className='h-9 rounded-md border border-gray-200 px-3 text-sm dark:border-dark-primary dark:bg-dark-primary dark:text-white'
          />
          <button
            onClick={() => setShowFilter((s) => !s)}
            className='h-9 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-dark-primary dark:bg-dark-primary dark:text-white'
          >
            Filter ▾
          </button>
        </div>
      </div>
      {/* Modal */}
      {showFilter && (
        <LeaderboardFilterModal
          onClose={() => setShowFilter(false)}
          onApply={({
            timeRange: tr,
            tab: tb,
            city: c,
            category: cat,
            minDate: min,
            maxDate: max,
          }) => {
            setTimeRange(tr);
            setTab(tb);
            setCity(c);
            setCategory(cat);
            setMinDate(min);
            setMaxDate(max);
          }}
          initialTimeRange={timeRange}
          initialTab={tab}
          initialCity={city}
          initialCategory={category}
          initialMinDate={minDate}
          initialMaxDate={maxDate}
          cityOptions={cityOptions}
          categoryOptions={categoryOptions}
        />
      )}

      {/* Table with card-like rows */}
      <div className='w-full overflow-x-auto scrollbar'>
        <table className='w-full'>
          <thead>
            <tr>
              <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-white'>
                Rank
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-white'>
                Provider
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-white'>
                Category / City
              </th>
              {kind === 'performers' ? (
                <>
                  <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-white'>
                    Bookings
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-white'>
                    Rating
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-white'>
                    Repeat
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-white'>
                    Score
                  </th>
                </>
              ) : (
                <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-white'>
                  Earnings (₦)
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {top.length === 0 ? (
              <tr>
                <td
                  colSpan={kind === 'performers' ? 7 : 4}
                  className='px-3 py-6 text-center text-xs text-gray-500 dark:text-dark-tertiary'
                >
                  No data available
                </td>
              </tr>
            ) : (
              top.map((p, idx) => (
                <tr key={p._id || idx} className='border-y border-gray-75 dark:border-dark-primary'>
                  <td className='px-3 py-3 align-top text-xs font-semibold text-gray-800 dark:text-white'>
                    <div className='flex items-center gap-2'>
                      <span>{idx + 1}</span>
                      <Medal rank={idx + 1} />
                    </div>
                  </td>
                  <td className='px-3 py-3 align-top text-xs text-gray-800 dark:text-white'>
                    <div className='flex items-center gap-3'>
                      <Image
                        src={(p.image as string) || '/images/png/default-avatar.png'}
                        alt={`${p.firstName || ''} ${p.lastName || ''}`}
                        width={48}
                        height={48}
                        className='h-12 w-12 rounded-md object-cover'
                      />
                      <div>
                        <p className='text-sm font-semibold'>
                          {p.businessName || `${p.firstName || ''} ${p.lastName || ''}`}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-dark-tertiary'>
                          ID: {p._id || '—'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-3 py-3 align-top text-xs text-gray-800 dark:text-white'>
                    {p.serviceType || 'Service'} {p.city ? `• ${p.city}` : ''}
                  </td>
                  {kind === 'performers' ? (
                    <>
                      <td className='px-3 py-3 align-top text-xs'>{p.totalBookings ?? '—'}</td>
                      <td className='px-3 py-3 align-top text-xs'>{p.averageRating ?? '—'}⭐</td>
                      <td className='px-3 py-3 align-top text-xs'>{p.repeatBookings ?? '—'}</td>
                      <td className='px-3 py-3 align-top text-xs font-semibold text-[#eb5017]'>
                        #{Math.round(p.score ?? 0)}
                      </td>
                    </>
                  ) : (
                    <td className='px-3 py-3 align-top text-xs font-semibold text-[#eb5017]'>
                      {typeof p.amount === 'number' ? `₦${p.amount.toLocaleString('en-NG')}` : '₦—'}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}
