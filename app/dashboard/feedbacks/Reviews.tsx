import SpinLoader from '../components/SpinLoader';
import FallBackUI from './FallbackUI';

const Reviews = ({
  reviewsData,
  isLoading,
}: {
  reviewsData: Array<object>;
  isLoading: boolean;
}) => {
  if (isLoading)
    return (
      <section className='center-grid h-[70vh] w-full'>
        <SpinLoader size={80} color='#983504' thickness={2} />
      </section>
    );

  if (reviewsData.length < 1) return <FallBackUI option='reviews' />;

  return <div>Ratings</div>;
};
export default Reviews;
