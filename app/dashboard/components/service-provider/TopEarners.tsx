'use client';
import LeaderboardTable from '../../components/tables/LeaderboardTable';

type LeaderboardItem = {
  _id?: string;
  image?: string | null;
  businessName?: string;
  firstName?: string;
  lastName?: string;
  serviceType?: string;
  city?: string;
  amount?: number;
};

const TopEarners = ({ items = [] }: { items: LeaderboardItem[] }) => {
  return (
    <div className='my-8'>
      <LeaderboardTable kind='earners' items={items} title='Top Earners' />
    </div>
  );
};
export default TopEarners;
