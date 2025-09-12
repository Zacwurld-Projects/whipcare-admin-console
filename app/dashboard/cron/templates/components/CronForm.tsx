import { ReactNode } from 'react';

const CronForm = ({
  children,
  title,
  subText,
  onSaveDraft,
  onPublish,
}: {
  children: ReactNode;
  title: string;
  subText: string;
  onSaveDraft?: () => void;
  onPublish?: () => void;
}) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className='mb-32'>
      <div className='flex-column mb-8 w-full items-center gap-2 text-center'>
        <h5 className='heading-h5 font-semibold text-[#1a1a21] dark:text-white'>{title}</h5>
        <p className='text-[#8c94a6] dark:text-white'>{subText}</p>
      </div>
      <div className='flex-column w-full gap-8'>{children}</div>
      <div className='mt-10 flex w-full gap-[6%] *:rounded-lg *:px-6 *:py-4 *:font-semibold'>
        <button
          className='w-[38%] border-[1.5px] border-[#f56630] text-[#f56630]'
          type='button'
          onClick={onSaveDraft}
        >
          Save Draft
        </button>
        <button type='button' className='w-[56%] bg-[#eb5017] text-white' onClick={onPublish}>
          Publish
        </button>
      </div>
    </form>
  );
};
export default CronForm;
