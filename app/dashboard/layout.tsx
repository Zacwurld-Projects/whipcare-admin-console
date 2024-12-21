'use client';
import { useGlobalContext } from '../context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useGlobalContext();

  return (
    <main className='flex min-h-screen'>
      <Sidebar />
      <section
        className={`min-w-[500px] flex-1 self-stretch bg-primary-50 ${isSidebarOpen ? 'cursor-pointer brightness-50' : 'brightness-100'}`}
      >
        <Navbar />
        <div className={`bg-primary-50 px-5 py-8`}>{children}</div>
      </section>
    </main>
  );
};
export default DashboardLayout;
