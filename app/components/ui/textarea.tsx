import React from 'react';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, placeholder, ...props }, ref) => {
    return (
      <textarea
        className={`min-h-28 w-full resize-none rounded-md border border-primary pe-3 shadow-sm outline-none sm:text-sm ${className}`}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
