'use client';
import Image from 'next/image';
import LightModeIcon from '../assets/lightModeIcon.svg';
import ChevronDownIcon from '../assets/chevronDown.svg';
import FlagIcon from '../assets/FlagIcon.png';
import SearchIcon from '../assets/searchIcon.svg';
import NotificationsIcon from '../assets/notificationIcon.svg';

const Navbar = () => {
  return (
    <nav className='sticky top-0 mb-8 flex h-[83px] w-full items-center justify-between bg-white px-[15px]'>
      <div className='flex items-center gap-[12px]'>
        <button className='center-grid peer size-[32px] rounded-full bg-primary-50'>
          <LightModeIcon />
        </button>
        <div className='tooltip center-grid relative w-fit rounded-[4px] bg-primary-900 px-[8px] py-[8px] pl-[10px] text-white opacity-0 shadow-[0px_5.18px_10.36px_-3.98px_rgba(0,0,0,0.25)] transition-opacity duration-200 ease-in peer-hover:opacity-100'>
          <div className='absolute left-[-12px] size-[0px] rotate-[270deg] [border-color:transparent_transparent_#711e00_transparent] [border-width:0_15px_12px_15px]'></div>
          <p className='text-xsmall'>Light Mode</p>
        </div>
      </div>
      <div className='flex items-center gap-4 pr-[25px]'>
        <div>
          <button className='flex items-center gap-2'>
            <Image src={FlagIcon} alt='flag icon' height={17.86} width={25} />
            <ChevronDownIcon />
          </button>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <label className='flex items-center gap-2 rounded-[5px] border border-gray-200 p-[10px]'>
            <input
              type='text'
              placeholder='Search'
              className='h-[24px] w-[140px] placeholder:text-[#98a2b3] focus:outline-none'
            />
            <SearchIcon />
          </label>
        </form>
        <div>
          <button aria-label='notifications' className='center-grid size-[32px] rounded-full'>
            <NotificationsIcon />
          </button>
        </div>
        <div>
          <button className='flex items-center gap-2'>
            <div className='center-grid relative size-[40px] rounded-full bg-primary-50'>
              <p className='text-small font-semibold text-[#f56630]'>ZI</p>
            </div>
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
