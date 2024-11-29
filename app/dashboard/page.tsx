import PageHeading from './components/PageHeading';
import BagIcon from './assets/bagIcon.svg';
import AllMatchIcon from './assets/allMatchIcon.svg';
import CheckCircleIcon from './assets/checkCircleIcon.svg';
import NumbersOverview from './components/NumbersOverview';

const overviewStats = [
  {
    icon: BagIcon,
    title: 'Number of bookings',
    currentNumber: 123,
    previousNumber: 110,
  },
  {
    icon: AllMatchIcon,
    title: 'Booking acceptance',
    currentNumber: 200,
    previousNumber: 180,
  },
  {
    icon: CheckCircleIcon,
    title: 'New user sign up',
    currentNumber: 554,
    previousNumber: 500,
  },
];

const Overview = () => {
  return (
    <div className='px-5 py-8'>
      <PageHeading page='overview' pageFilters />
      <NumbersOverview stats={overviewStats} className='mt-8' />
    </div>
  );
};
export default Overview;
