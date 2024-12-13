import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import ChevronRightIcon from '../assets/chevronRight.svg';
import PageHeading from '../components/PageHeading';
import NumbersOverview from '../components/NumbersOverview';
import PlainTable from '../components/tables/PlainTable';

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
        <ul className='mt-4 flex justify-between rounded-[10px] border border-gray-100 bg-white px-10 py-6'>
          {recentServiceProviders.map((item, index) => (
            <li key={index} className='flex-column items-center gap-2'>
              <p className='center-grid size-12 rounded-full bg-primary-50 text-center text-[18px] font-semibold uppercase text-gray-700'>
                {item.name.slice(0, 2)}
              </p>
              <div className='text-center'>
                <p className='text-xsmall font-semibold text-gray-900'>{item.name}</p>
                <p className='text-xsmall text-[#98a2b3]'>{item.email}</p>
              </div>
            </li>
          ))}
        </ul>
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
