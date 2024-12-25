import SpinLoader from '../components/SpinLoader';
import FallBackUI from './FallbackUI';

const Complaints = ({
  complaintsData,
  isLoading,
}: {
  complaintsData: Array<object>;
  isLoading: boolean;
}) => {
  if (isLoading)
    return (
      <section className='center-grid h-[70vh] w-full'>
        <SpinLoader size={80} color='#983504' thickness={2} />
      </section>
    );

  if (complaintsData.length < 1) return <FallBackUI option='complaints' />;

  return <div>Ratings</div>;
};
export default Complaints;
