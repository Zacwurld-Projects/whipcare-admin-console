import AsideDisplay from './components/AsideDisplay';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex h-[100vh] w-full items-stretch [&_section]:h-full [&_section]:w-1/2'>
      <AsideDisplay />
      {children}
    </main>
  );
};
export default AuthLayout;
