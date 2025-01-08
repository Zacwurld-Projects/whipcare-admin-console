import SectionLoader from '../components/Loaders/SectionLoader';
import FallBackUI from './FallbackUI';

const Complaints = ({
  complaintsData,
  isLoading,
}: {
  complaintsData: Array<object>;
  isLoading: boolean;
}) => {
  if (isLoading) return <SectionLoader height='70vh' />;

  if (complaintsData.length < 1) return <FallBackUI option='complaints' />;

  return <div>Ratings</div>;
};
export default Complaints;
