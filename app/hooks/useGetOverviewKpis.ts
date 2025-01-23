'use client';
import { useQuery } from '@tanstack/react-query';
import { ComponentType, useEffect, useState } from 'react';

type FlattenedKpiResponse = Record<string, { count: number; growth: number } | undefined>;

type NestedKpiResponse = {
  data: FlattenedKpiResponse;
};

type KpiResponse = FlattenedKpiResponse | NestedKpiResponse;

const useGetOverviewKpis = (
  dataStructure: {
    icon: ComponentType;
    title: string;
    id: string;
    count: number;
    growth: number;
  }[],
  selectedDates: {
    maxDate: string;
    minDate: string;
  },
  fetchKpiData: (maxDate?: string, minDate?: string) => Promise<KpiResponse>,
) => {
  const [kpiData, setKpiData] = useState(dataStructure);

  const useFetchOverviewKpis = useQuery({
    queryKey: ['fetchPageKpis', selectedDates.maxDate, selectedDates.minDate],
    queryFn: () => fetchKpiData(selectedDates.maxDate, selectedDates.minDate),
  });

  useEffect(() => {
    if (!useFetchOverviewKpis.isLoading && useFetchOverviewKpis.data) {
      const response = useFetchOverviewKpis.data;

      // handle both cases
      const data: FlattenedKpiResponse =
        'data' in response && response.data
          ? (response.data as FlattenedKpiResponse) // case 1: proper `data` object exists
          : (response as FlattenedKpiResponse); // case 2: flattened structure

      const newKpiData = dataStructure.map((kpi) => ({
        ...kpi,
        count: data[kpi.id]?.count ?? kpi.count,
        growth: data[kpi.id]?.growth ?? kpi.growth,
      }));

      setKpiData((prev) => {
        const isSame = JSON.stringify(prev) === JSON.stringify(newKpiData);
        return isSame ? prev : newKpiData;
      });
    }
  }, [useFetchOverviewKpis.data, useFetchOverviewKpis.isLoading, dataStructure]);

  return { kpiData, useFetchOverviewKpis };
};
export default useGetOverviewKpis;
