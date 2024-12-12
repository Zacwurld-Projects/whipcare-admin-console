import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import PageHeading from '../components/PageHeading';
import NumbersOverview from '../components/NumbersOverview';

const serviceProviderStats = [
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

const ServiceProviderPage = () => {
  return (
    <>
      <PageHeading page='Service Provider' pageFilters />
      <NumbersOverview stats={serviceProviderStats} className='mt-8' />
    </>
  );
};
export default ServiceProviderPage;
