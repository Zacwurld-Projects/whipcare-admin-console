import SpinLoader from '../components/SpinLoader';
import FallBackUI from './FallbackUI';

const Suggestions = ({
  suggestionsData,
  isLoading,
}: {
  suggestionsData: Array<object>;
  isLoading: boolean;
}) => {
  if (isLoading)
    return (
      <section className='center-grid h-[70vh] w-full'>
        <SpinLoader size={80} color='#983504' thickness={2} />
      </section>
    );

  if (suggestionsData.length < 1) return <FallBackUI option='Suggestions' />;

  return <div>Ratings</div>;
};
export default Suggestions;
