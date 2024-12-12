'use client';

const DarkOverlay = ({
  children,
  className = '',
  exitFunction,
}: {
  children: React.ReactNode;
  className?: string;
  exitFunction?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) => {
  return (
    <section
      onClick={(e) => {
        if (exitFunction) exitFunction(e);
      }}
      className={`fixed left-0 top-0 z-[100] h-[100vh] w-[100vw] overflow-y-scroll bg-[rgba(105,101,101,0.60)] backdrop-blur-[2px] ${className}`}
    >
      {children}
    </section>
  );
};
export default DarkOverlay;
