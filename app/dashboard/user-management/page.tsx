import PageHeading from '../components/PageHeading';
import NumbersOverview from '../components/NumbersOverview';
import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import LineChart from '../components/charts/LineChart';
import UserGrowthChart from '../components/charts/UserGrowthChart';
import ChurnRateChart from '../components/charts/ChurnRateChart';
import CustomerMapping from '../components/charts/CustomerMapping';
import PlainTable from '../components/tables/PlainTable';

const userManagementStats = [
  {
    icon: BagIcon,
    title: 'Number of Users',
    currentNumber: 123000,
    previousNumber: 110000,
  },
  {
    icon: AllMatchIcon,
    title: 'Number of Active Users',
    currentNumber: 100000,
    previousNumber: 90000,
  },
  {
    icon: CheckCircleIcon,
    title: 'Number of Inactive Users',
    currentNumber: 23000,
    previousNumber: 20000,
  },
];

const UserManagementPage = () => {
  return (
    <>
      <PageHeading page='User management' pageFilters />
      <NumbersOverview stats={userManagementStats} className='mt-8' />
      <div className='mb-8 mt-6 grid grid-cols-1 gap-6 min-[1300px]:grid-cols-2'>
        <div className='grid grid-cols-2 [column-gap:16px] [row-gap:32px]'>
          <LineChart filter className='col-span-2' />
          <UserGrowthChart />
          <ChurnRateChart />
        </div>
        <CustomerMapping />
      </div>
      <PlainTable
        page='user-management'
        heading='Users Info'
        headings={[
          'No',
          'User name',
          'Email address',
          'Phone',
          'Sign up Date',
          'Last Login Date',
          'Action',
        ]}
        content={Array(15).fill({
          id: '1234567',
          name: 'Isaac Zacwurld',
          email: 'Isaaczac@gmail.com',
          phone: '+1 453 6780 690',
          signUp: Date.now() - 30 * 24 * 60 * 60 * 1000,
          lastLogin: Date.now() - 24 * 60 * 60 * 1000,
        })}
      />
    </>
  );
};
export default UserManagementPage;
