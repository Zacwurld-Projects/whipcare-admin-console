import React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  text: React.JSX.Element;
};

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, htmlFor, text, ...props }, ref) => {
    return (
      <label
        htmlFor={htmlFor}
        className={`text-mcNiff-gray-2 block text-xs font-medium ${className}`}
        {...props}
        {...ref}
      >
        {text}
      </label>
    );
  },
);

Label.displayName = 'Label';

export default Label;
