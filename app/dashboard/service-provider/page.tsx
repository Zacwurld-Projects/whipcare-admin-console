import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import ChevronRightIcon from '../assets/chevronRight.svg';
import PageHeading from '../components/PageHeading';
import NumbersOverview from '../components/NumbersOverview';
import PlainTable from '../components/tables/PlainTable';
import RecentProviders from '../components/RecentProviders';

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

const recentServiceProviders = Array.from({ length: 7 }, () => {
  return {
    name: 'Ariana Bush',
    email: 'arianabush@gmail.com',
  };
});

const ServiceProviderPage = () => {
  return (
    <>
      <PageHeading page='Service Provider' pageFilters />
      <NumbersOverview stats={serviceProviderStats} className='mt-8' />
      <div className='my-8'>
        <div className='flex items-center justify-between'>
          <p className='text-large font-semibold text-gray-900'>Waitlist Service Provider</p>
          <button className='text-small flex items-center gap-2 rounded-[6px] bg-[#eb5017] px-3 py-2 font-semibold text-white'>
            <p>Check Spreadsheet</p>
            <ChevronRightIcon className='*:fill-white' />
          </button>
        </div>
        <RecentProviders recentServiceProviders={recentServiceProviders} />
      </div>
      <PlainTable
        link='service-provider/info'
        heading='Service Providers Info'
        headings={[
          'No',
          'Name',
          'Email address',
          'Phone',
          'Service Type',
          'Sign up Date',
          'Last Login Date',
          'Status',
        ]}
        content={Array(15).fill({
          id: '1234567',
          name: 'Isaac Zacwurld',
          email: 'Isaaczac@gmail.com',
          phone: '+1 453 6780 690',
          serviceType: 'Mechanics',
          signUp: Date.now() - 30 * 24 * 60 * 60 * 1000,
          lastLogin: Date.now() - 24 * 60 * 60 * 1000,
          status: 'verified',
        })}
      />
    </>
  );
};
export default ServiceProviderPage;
