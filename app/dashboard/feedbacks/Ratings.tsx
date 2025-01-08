import SectionLoader from '../components/Loaders/SectionLoader';
import FallBackUI from './FallbackUI';

const Ratings = ({
  ratingsData,
  isLoading,
}: {
  ratingsData: Array<object>;
  isLoading: boolean;
}) => {
  if (isLoading) return <SectionLoader height='70vh' />;

  if (ratingsData.length < 1) return <FallBackUI option='ratings' />;

  return <div>Ratings</div>;
};
export default Ratings;
