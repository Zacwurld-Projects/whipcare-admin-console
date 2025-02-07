'use client';
import AnimatedLoader from './AnimatedLoader';
import SpinLoader from './SpinLoader';
import { useGlobalContext } from '@/app/context/AppContext';

const SectionLoader = ({ height, spin }: { height?: string; spin?: boolean }) => {
  const { isDark } = useGlobalContext();

  return (
    <div style={{ height: `${height ? height : '60vh'}` }} className='center-grid w-full'>
      {spin ? (
        <SpinLoader size={70} color={`${isDark ? '#ff6e4a' : '#983504'}`} thickness={2} />
      ) : (
        <AnimatedLoader />
      )}
    </div>
  );
};
export default SectionLoader;
