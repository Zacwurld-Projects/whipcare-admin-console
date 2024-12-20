import PageHeading from '../../components/PageHeading';
import InfoTable from '../../components/tables/InfoTable';

const ServiceProviderInfo = () => {
  return (
    <>
      <PageHeading page='Service Provider' pageFilters />
      <div className='mt-6 w-full'>
        <InfoTable
          page='service-provider'
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
          content={Array(150).fill({
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
      </div>
    </>
  );
};
export default ServiceProviderInfo;
