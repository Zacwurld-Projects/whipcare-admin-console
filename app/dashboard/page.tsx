import PageHeading from './components/PageHeading';
import BagIcon from './assets/bagIcon.svg';
import AllMatchIcon from './assets/allMatchIcon.svg';
import CheckCircleIcon from './assets/checkCircleIcon.svg';
import NumbersOverview from './components/NumbersOverview';
import BarChart from './components/charts/BarChart';
import DoughnutChart from './components/charts/DoughnutChart';
import ProgressBarChart from './components/charts/ProgressBarChart';

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
      <div className='mt-6 grid grid-cols-1 gap-[26px] min-[1300px]:grid-cols-2'>
        <BarChart
          yLabel='Amount(Thousands)'
          xLabels={['Mech/Tech', 'Wash', 'Hauling', 'Detailing']}
          heading='Revenue'
          data={[800, 950, 600, 600]}
        />
        <DoughnutChart
          heading='Payment method'
          colors={['#f56630', '#0f973d']}
          data={[4000000, 2000000]}
          xLabels={['Transfer', 'Card']}
          yLabel='Amount Paid'
          timestamp={Date.now() - 30 * 24 * 60 * 60 * 1000}
        />
        <ProgressBarChart
          heading='Service Efficiency'
          timestamp={Date.now() - 30 * 24 * 60 * 60 * 1000}
        />
        <BarChart
          yLabel='Users'
          xLabels={['Mech/Tech', 'Wash', 'Hauling', 'Detailing']}
          heading='Service Type'
          data={[830, 980, 670, 600]}
        />
      </div>
    </div>
  );
};
export default Overview;
