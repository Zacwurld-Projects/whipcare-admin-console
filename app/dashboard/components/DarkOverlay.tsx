'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const DarkOverlay = ({
  children,
  className = '',
  exitFunction,
}: {
  children: React.ReactNode;
  className?: string;
  exitFunction?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <section
      onClick={(e) => {
        if (exitFunction) exitFunction(e);
      }}
      className={`fixed inset-0 z-[1000]`}
    >
      <div
        className={`absolute inset-0 overflow-auto bg-[rgba(105,101,101,0.60)] backdrop-blur-[2px] scrollbar ${className}`}
      >
        {children}
      </div>
    </section>,
    document.body,
  );
};
export default DarkOverlay;
