import FeedbackPlaceholderIcon from '../assets/feedbackPlaceholder.svg';

const FallBackUI = ({ option }: { option: string }) => {
  return (
    <section className='center-grid h-[70vh] w-full'>
      <div className='flex-column items-center gap-3'>
        <FeedbackPlaceholderIcon className='dark:*:fill-dark-accent' />
        <div className='flex-column gap-1 text-center'>
          <h6 className='heading-h6 text-gray-900 dark:text-white'>
            {' '}
            No <span className='capitalize'>{option}</span> yet
          </h6>
          <p className='text-gray-500 dark:text-dark-tertiary'>All {option} will appear here</p>
        </div>
      </div>
    </section>
  );
};

export default FallBackUI;
