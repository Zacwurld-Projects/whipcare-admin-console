'use client';
import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';

const FormButton = ({
  disabled,
  type,
  text,
  linkTo,
  className,
  isLoading,
}: {
  isLoading?: boolean;
  disabled?: boolean;
  type: 'submit' | 'reset' | 'button' | 'link' | undefined;
  text: string;
  linkTo?: Url;
  className?: string;
}) => {
  if (type === 'link' && linkTo) {
    return (
      <Link
        className={`center-grid block h-[51px] w-full rounded-[2em] bg-primary-900 text-white ${
          className ? className : ''
        }`}
        href={linkTo}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      className={`center-grid h-[51px] w-full rounded-[2em] bg-primary-900 text-white transition-opacity disabled:opacity-50 ${
        className ? className : ''
      }`}
      type={type !== 'link' ? type : 'button'}
    >
      {isLoading ? (
        <div className='size-8 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
      ) : (
        <p>{text}</p>
      )}
    </button>
  );
};
export default FormButton;
