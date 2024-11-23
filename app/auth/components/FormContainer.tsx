const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='py-[36px] px-[20px] rounded-t-[32px] shadow-[1px_1px_12px_rgba(109,110,113,0.1)] flex flex-col gap-8 w-[40vw] lg:w-[463px] items-center'>
      {children}
    </div>
  );
};
export default FormContainer;
