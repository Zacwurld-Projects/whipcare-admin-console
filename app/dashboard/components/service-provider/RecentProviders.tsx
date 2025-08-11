'use client';

// import { useRouter } from 'next/navigation';
import { WaitlistData } from '@/app/lib/mockTypes';
import PlainTable from '../tables/PlainTable';

interface RecentProvidersProps {
  recentServiceProviders: WaitlistData[];
}

const RecentProviders = ({ recentServiceProviders }: RecentProvidersProps) => {
  // const router = useRouter();

  return (
    <div className='mt-8'>
      <PlainTable
        page='waitlist-service-provider'
        heading='Recent Waitlist Service Providers'
        viewAllLink='/dashboard/service-provider/waitlist'
        headings={[
          'No',
          'Name',
          'Email Address',
          'Address',
          'Phone number',
          'Service Type',
          'City',
        ]}
        data={{
          data: recentServiceProviders || [],
          totalCount: recentServiceProviders?.length || 0,
          pageNumber: 1,
          pageSize: recentServiceProviders?.length || 10,
        }}
        ContentStructure={({ item, index }) => (
          <>
            <td>{index + 1}</td>
            <td>{item.fullName}</td>
            <td>{item.email}</td>
            <td>{item.address}</td>
            <td>{item.phone}</td>
            <td>{item.role}</td>
            <td>{item.city}</td>
          </>
        )}
      />
    </div>
  );
};

export default RecentProviders;
