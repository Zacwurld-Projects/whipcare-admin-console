import AsideDisplay from "./components/AsideDisplay";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex w-full [&_section]:w-1/2 items-stretch h-[100vh] [&_section]:h-full'>
      <AsideDisplay />
      {children}
    </main>
  );
};
export default AuthLayout;
