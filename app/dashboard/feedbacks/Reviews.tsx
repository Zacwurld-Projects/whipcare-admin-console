import SectionLoader from '../components/Loaders/SectionLoader';
import FallBackUI from './FallbackUI';

const Reviews = ({
  // reviewsData,
  isLoading,
}: {
  reviewsData: Array<object>;
  isLoading: boolean;
}) => {
  if (isLoading) return <SectionLoader height='70vh' />;

  // if (reviewsData.length < 1)

  return <FallBackUI option='reviews' />;

  // return <div>Ratings</div>;
};
export default Reviews;
