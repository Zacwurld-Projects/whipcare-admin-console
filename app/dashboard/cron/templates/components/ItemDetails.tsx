const ItemDetails = ({
  dataPreview,
  status,
  editItem,
  onPublish,
  isPublishing,
  onDelete,
  isDeleting,
  showPublishAction,
}: {
  dataPreview: {
    title: string;
    value?: string;
  }[];
  status?: string;
  editItem: () => void;
  onPublish?: () => void;
  isPublishing?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  showPublishAction?: boolean;
}) => {
  return (
    <div className='mb-20'>
      <article className='mb-20 w-full rounded-lg border border-gray-200 p-6 dark:border-dark-primary'>
        {dataPreview.map((item, index) => (
          <div
            key={item.title}
            className={`flex w-full justify-between border-b border-gray-200 py-6 text-sm dark:border-dark-primary ${index === dataPreview.length - 1 ? 'border-none pb-0' : ''} ${index === 0 ? 'pt-0' : ''}`}
          >
            <p className='text-gray-500 dark:text-dark-tertiary'>{item.title}</p>
            <p className='max-w-[75%] text-left font-medium text-gray-700 dark:text-white'>
              {item.value && item.value.trim() !== '' ? item.value : '—'}
            </p>
          </div>
        ))}
      </article>
      <div className='flex w-full gap-[6%] *:rounded-lg *:px-6 *:py-4 *:font-semibold'>
        <button
          className='w-[38%] border-[1.5px] border-[#f56630] text-[#f56630]'
          type='button'
          onClick={editItem}
        >
          Edit
        </button>
        {showPublishAction ? (
          <button
            type='button'
            className={`w-[56%] bg-[#eb5017] text-white ${isPublishing ? 'opacity-70' : ''}`}
            disabled={isPublishing}
            onClick={onPublish}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        ) : status === 'Published' ? (
          <button
            type='button'
            className={`w-[56%] bg-[#eb5017] text-white ${isDeleting ? 'opacity-70' : ''}`}
            disabled={isDeleting}
            onClick={onDelete}
          >
            {isDeleting ? 'Deleting...' : 'Delete/Remove'}
          </button>
        ) : (
          <button
            type='button'
            className={`w-[56%] bg-[#eb5017] text-white ${isPublishing ? 'opacity-70' : ''}`}
            disabled={isPublishing}
            onClick={onPublish}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        )}
      </div>
    </div>
  );
};
export default ItemDetails;
