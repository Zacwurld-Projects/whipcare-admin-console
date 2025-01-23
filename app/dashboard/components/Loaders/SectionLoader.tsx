import AnimatedLoader from './AnimatedLoader';
import SpinLoader from './SpinLoader';

const SectionLoader = ({ height, spin }: { height?: string; spin?: boolean }) => {
  return (
    <div style={{ height: `${height ? height : '60vh'}` }} className='center-grid w-full'>
      {spin ? <SpinLoader size={70} color='#983504' thickness={2} /> : <AnimatedLoader />}
    </div>
  );
};
export default SectionLoader;
