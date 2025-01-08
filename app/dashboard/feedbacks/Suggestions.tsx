import SectionLoader from '../components/Loaders/SectionLoader';
import FallBackUI from './FallbackUI';

const Suggestions = ({
  suggestionsData,
  isLoading,
}: {
  suggestionsData: Array<object>;
  isLoading: boolean;
}) => {
  if (isLoading) return <SectionLoader height='70vh' />;

  if (suggestionsData.length < 1) return <FallBackUI option='Suggestions' />;

  return <div>Ratings</div>;
};
export default Suggestions;
