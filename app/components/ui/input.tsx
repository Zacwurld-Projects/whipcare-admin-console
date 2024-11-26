import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`placeholder:text-mcNiff-light-gray-3 w-full rounded-md border border-primary bg-white pe-3 outline-none sm:text-sm ${className}`}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
