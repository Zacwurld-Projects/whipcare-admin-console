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
  totalBookings?: number;
  averageRating?: number;
  repeatBookings?: number;
  score?: number;
  amount?: number;
};
const TopPerformers = ({ items = [] }: { items: LeaderboardItem[] }) => {
  return (
    <div className='my-8'>
      <LeaderboardTable kind='performers' items={items} title='Top Performers' />
    </div>
  );
};
export default TopPerformers;
