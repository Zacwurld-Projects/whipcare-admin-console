'use client';
import { useQuery } from '@tanstack/react-query';
import {
  fetchOverviewPaymentMethod,
  fetchOverviewRevenue,
  fetchOverviewServiceType,
} from '@/app/api/apiClient';

type ChartDataNormalized = { labels: string[]; values: number[]; timestamp?: number };
type LabelsValuesShape = { labels: unknown; values: unknown; timestamp?: unknown };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((i) => typeof i === 'string');

const isNumberArray = (v: unknown): v is number[] =>
  Array.isArray(v) && v.every((i) => typeof i === 'number');

// Normalize various backend response shapes into labels/values
function normalizeToLabelsValues(input: unknown): ChartDataNormalized {
  if (!input) return { labels: [], values: [] };

  const base: unknown =
    isRecord(input) && 'data' in input ? (input as { data: unknown }).data : input;

  // Explicit labels/values shape
  if (isRecord(base)) {
    const shape = base as LabelsValuesShape;
    if (isStringArray(shape.labels) && isNumberArray(shape.values)) {
      return {
        labels: shape.labels,
        values: shape.values,
        timestamp: typeof shape.timestamp === 'number' ? (shape.timestamp as number) : Date.now(),
      };
    }
  }

  // Array of objects
  if (Array.isArray(base)) {
    const labels: string[] = [];
    const values: number[] = [];
    base.forEach((raw) => {
      if (!isRecord(raw)) return;
      const labelCandidate = (raw.name as unknown) ?? raw.title ?? raw.label ?? raw.type ?? raw.key;
      const valueCandidate =
        (typeof raw.value === 'number' ? raw.value : undefined) ??
        (typeof raw.amount === 'number' ? raw.amount : undefined) ??
        (typeof raw.count === 'number' ? raw.count : undefined) ??
        (typeof raw.users === 'number' ? raw.users : undefined);

      if (typeof labelCandidate === 'string' || typeof labelCandidate === 'number') {
        if (typeof valueCandidate === 'number') {
          labels.push(String(labelCandidate));
          values.push(valueCandidate);
        }
      }
    });
    return { labels, values, timestamp: Date.now() };
  }

  // Object map e.g., { Transfer: 4000000, Card: 2000000 }
  if (isRecord(base)) {
    const rec = base as Record<string, unknown>;
    const labels = Object.keys(rec);
    const values = labels.map((k) =>
      typeof rec[k] === 'number' ? (rec[k] as number) : Number(rec[k]) || 0,
    );
    return { labels, values, timestamp: Date.now() };
  }

  return { labels: [], values: [] };
}

function useAutoQuery<T>(key: unknown[], fn: () => Promise<T>) {
  return useQuery({
    queryKey: key,
    queryFn: fn,
    refetchInterval: 30000, // ~real-time refresh every 30s
    refetchOnWindowFocus: true,
    staleTime: 15000,
  });
}

const defaultColors = ['#f56630', '#0f973d', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'];

const useGetOverviewCharts = () => {
  const revenueQuery = useAutoQuery(['overview-revenue'], fetchOverviewRevenue);
  const serviceTypeQuery = useAutoQuery(['overview-service-type'], fetchOverviewServiceType);
  const paymentMethodQuery = useAutoQuery(['overview-payment-method'], fetchOverviewPaymentMethod);

  const revenue = normalizeToLabelsValues(revenueQuery.data);
  const serviceType = normalizeToLabelsValues(serviceTypeQuery.data);
  const paymentMethod = normalizeToLabelsValues(paymentMethodQuery.data);

  // Fit colors count to labels length for Doughnut chart
  const paymentColors = paymentMethod.labels.length
    ? paymentMethod.labels.map((_, i) => defaultColors[i % defaultColors.length])
    : defaultColors.slice(0, 2);

  return {
    revenue: {
      labels: revenue.labels,
      values: revenue.values,
      isLoading: revenueQuery.isLoading,
    },
    serviceType: {
      labels: serviceType.labels,
      values: serviceType.values,
      isLoading: serviceTypeQuery.isLoading,
    },
    paymentMethod: {
      labels: paymentMethod.labels,
      values: paymentMethod.values,
      colors: paymentColors,
      timestamp: paymentMethod.timestamp ?? Date.now(),
      isLoading: paymentMethodQuery.isLoading,
    },
  };
};

export default useGetOverviewCharts;
