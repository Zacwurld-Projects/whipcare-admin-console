'use client';
import { useQuery } from '@tanstack/react-query';
import { ComponentType, useEffect, useState } from 'react';

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
  fetchKpiData: (
    maxDate?: string,
    minDate?: string,
  ) => Promise<{ data: { [key: string]: { count: number; growth: number } } }>,
) => {
  const [kpiData, setKpiData] = useState(dataStructure);

  const useFetchOverviewKpis = useQuery({
    queryKey: ['fetchOverviewKpis', selectedDates.maxDate, selectedDates.minDate],
    queryFn: () => fetchKpiData(selectedDates.maxDate, selectedDates.minDate),
  });

  useEffect(() => {
    if (!useFetchOverviewKpis.isLoading && useFetchOverviewKpis.data) {
      const { data } = useFetchOverviewKpis.data;

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
