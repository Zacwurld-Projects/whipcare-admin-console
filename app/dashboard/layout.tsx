import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex'>
      <Sidebar />
      <section className='relative min-w-[750px] flex-1 bg-primary-50'>
        <Navbar />
        <div className='px-5 py-8'>{children}</div>
      </section>
    </main>
  );
};
export default DashboardLayout;
