import AnimatedLoader from './AnimatedLoader';

const SectionLoader = ({ height }: { height?: string }) => {
  return (
    <div style={{ height: `${height ? height : '60vh'}` }} className='center-grid w-full'>
      <AnimatedLoader />
    </div>
  );
};
export default SectionLoader;
