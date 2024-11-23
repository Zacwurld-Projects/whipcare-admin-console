"use client";
const FormButton = ({
  disabled,
  type,
  text,
}: {
  disabled: boolean;
  type: "submit" | "reset" | "button" | undefined;
  text: string;
}) => {
  return (
    <button
      disabled={disabled}
      className='bg-primary-900 rounded-[2em] center-grid h-[51px] w-full text-white disabled:opacity-50 transition-opacity'
      type={type}
    >
      <p>{text}</p>
    </button>
  );
};
export default FormButton;
