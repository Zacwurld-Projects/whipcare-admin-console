import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, placeholder, ...props }, ref) => {
        return (
            <input
                type={type}
                className={`w-full bg-white rounded-md border border-primary outline-none pe-3 sm:text-sm placeholder:text-mcNiff-light-gray-3 ${className}`}
                placeholder={placeholder}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export default Input;
