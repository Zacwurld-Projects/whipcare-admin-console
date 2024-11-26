const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex w-[40vw] flex-col items-center gap-8 rounded-t-[32px] px-[20px] py-[36px] shadow-[1px_1px_12px_rgba(109,110,113,0.1)] xl:w-[463px]'>
      {children}
    </div>
  );
};
export default FormContainer;
