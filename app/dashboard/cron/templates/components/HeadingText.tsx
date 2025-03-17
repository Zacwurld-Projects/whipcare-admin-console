const HeadingText = ({
  title,
  status,
  isEditing,
}: {
  title: string;
  status?: string;
  isEditing: boolean;
}) => {
  return (
    <div className='mb-10'>
      <p className='flex items-center gap-[10px] text-base font-medium text-[#27231f] dark:text-white'>
        <span>{title}</span> <span>{'>'}</span>
        <span className='text-2xl'>{isEditing ? 'New template' : 'Details'}</span>
        {!isEditing && (
          <span
            className={`rounded-[6px] px-[6px] py-[2px] text-xs font-medium ${status === 'Published' ? 'bg-[#e7f6ec] text-[#40b869]' : 'bg-[#fbf1f1] text-[#514a4a]'}`}
          >
            {status}
          </span>
        )}
      </p>
    </div>
  );
};
export default HeadingText;
