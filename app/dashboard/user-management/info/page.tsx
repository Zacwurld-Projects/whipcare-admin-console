import PageHeading from '../../components/PageHeading';
import InfoTable from '../../components/tables/InfoTable';

const UserManagementInfo = () => {
  return (
    <>
      <PageHeading page='User management' pageFilters />
      <div className='mt-6 w-full'>
        <InfoTable
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
          content={Array(150).fill({
            id: '1234567',
            name: 'Isaac Zacwurld',
            email: 'Isaaczac@gmail.com',
            phone: '+1 453 6780 690',
            signUp: Date.now() - 30 * 24 * 60 * 60 * 1000,
            lastLogin: Date.now() - 24 * 60 * 60 * 1000,
          })}
        />
      </div>
    </>
  );
};
export default UserManagementInfo;
