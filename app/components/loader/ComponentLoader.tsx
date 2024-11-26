import { FunctionComponent, ReactElement } from 'react';

type ComponentLoaderProps = {
  /**
   * The optional classnames to be added
   */
  className?: string;
};

type FullPageLoaderProps = ComponentLoaderProps & {
  containerClassName?: string;
};

export const ComponentLoader: FunctionComponent<ComponentLoaderProps> = ({
  className,
}): ReactElement => {
  return (
    <div
      className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent ${className}`}
    />
  );
};

export const ButtonLoader: FunctionComponent<ComponentLoaderProps> = ({
  className,
}): ReactElement => {
  return (
    <div className='pointer-events-none absolute left-0 top-0 grid h-full w-full place-items-center bg-primary'>
      <div
        className={`h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent ${className}`}
      />
    </div>
  );
};

export const FullPageLoader: FunctionComponent<FullPageLoaderProps> = ({
  className,
  containerClassName,
}): ReactElement => {
  return (
    <div className={`grid h-52 w-full place-items-center ${containerClassName}`}>
      <div
        className={`h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent ${className}`}
      />
    </div>
  );
};
