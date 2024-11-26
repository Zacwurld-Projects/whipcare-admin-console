import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex'>
      <Sidebar />
      <section className='relative flex-1 bg-primary-50'>
        <Navbar />
        {children}
      </section>
    </main>
  );
};
export default DashboardLayout;
