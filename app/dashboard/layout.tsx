'use client';
import { useGlobalContext } from '../context/AppContext';
import BookingDetails from './components/modals/BookingDetails';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, bookingDetails } = useGlobalContext();

  return (
    <>
      <main className='flex min-h-screen'>
        <Sidebar />
        <section
          className={`min-w-[500px] flex-1 self-stretch bg-primary-50 dark:bg-dark-bg ${isSidebarOpen ? 'cursor-pointer brightness-50' : 'brightness-100'}`}
        >
          <Navbar />
          <div className={`bg-primary-50 px-5 py-8 dark:bg-dark-bg`}>{children}</div>
        </section>
      </main>
      {bookingDetails.display && <BookingDetails />}
    </>
  );
};
export default DashboardLayout;
