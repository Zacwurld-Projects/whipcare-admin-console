const TitleBox = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className='w-[211px]'>
      <h6 className='heading-h6 font-semibold text-gray-800'>{title}</h6>
      <p className='text-small mt-[5px] text-gray-500'>{content}</p>
    </div>
  );
};
export default TitleBox;
