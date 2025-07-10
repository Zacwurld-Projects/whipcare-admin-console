import { ReactNode } from 'react';

export type TableData<T> = {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalProviders?: number;
};

export type EmptyStateProps = {
  className?: string;
  icon: ReactNode;
  title: string;
  subText: string;
};
