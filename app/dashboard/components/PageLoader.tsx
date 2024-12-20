import SpinLoader from './SpinLoader';

const PageLoader = () => {
  return (
    <div className='center-grid h-[70vh] w-full'>
      <SpinLoader size={108} color='#800501' thickness={2} />
    </div>
  );
};
export default PageLoader;
