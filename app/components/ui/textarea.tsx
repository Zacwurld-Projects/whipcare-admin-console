import React from "react";

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { }

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, placeholder, ...props }, ref) => {
        return (
            <textarea
                className={`w-full min-h-28 rounded-md border border-primary outline-none resize-none pe-3 shadow-sm sm:text-sm ${className}`}
                placeholder={placeholder}
                ref={ref}
                {...props}
            />
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;
