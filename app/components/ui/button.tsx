import * as React from 'react';
import { ButtonLoader } from '@/app/components/loader/ComponentLoader';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  btnIcon?: React.ReactElement;
  hideLoader?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type, btnIcon, ...props }, ref) => {
    return (
      <button
        type={type}
        className={`hover:bg-primary-foreground hover:text:bg-primary relative overflow-hidden rounded-full bg-primary px-6 py-3 font-medium text-white ${className}`}
        ref={ref}
        {...props}
      >
        {btnIcon && <span>{btnIcon}</span>}
        {props.disabled && !props.hideLoader && <ButtonLoader />}
        {props.children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
