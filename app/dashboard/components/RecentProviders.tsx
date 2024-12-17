'use client';

import { useEffect, useRef, useState } from 'react';

const RecentProviders = ({
  recentServiceProviders,
}: {
  recentServiceProviders: {
    name: string;
    email: string;
  }[];
}) => {
  const [displayedProviders, setDisplayedProviders] = useState(recentServiceProviders);

  const displayWindowRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const displayWindow = displayWindowRef.current;
    const changeDisplayedProviders = () => {
      if (displayWindow) {
        if (displayWindow.getBoundingClientRect().width < 1000)
          setDisplayedProviders(recentServiceProviders.slice(0, 4));
        else setDisplayedProviders(recentServiceProviders);
      }
    };

    const observer = new ResizeObserver(() => {
      changeDisplayedProviders();
    });

    if (displayWindow) observer.observe(displayWindow);

    return () => {
      if (displayWindow) observer.unobserve(displayWindow);
      observer.disconnect();
    };
  }, [displayWindowRef, recentServiceProviders]);

  return (
    <ul
      ref={displayWindowRef}
      className='mt-4 flex justify-between rounded-[10px] border border-gray-100 bg-white px-10 py-6'
    >
      {displayedProviders.map((item, index) => (
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
  );
};
export default RecentProviders;
