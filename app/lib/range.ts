import dayjs from 'dayjs';

export function getDateRange(filter: string, customRange?: [Date | null, Date | null]) {
  if (filter === 'all') {
    return { minDate: '', maxDate: '' };
  }
  if (filter === 'today') {
    const today = dayjs().format('YYYY-MM-DD');
    return { minDate: today, maxDate: today };
  }
  if (filter === '1 week') {
    return {
      minDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      maxDate: dayjs().format('YYYY-MM-DD'),
    };
  }
  if (filter === '2 months') {
    return {
      minDate: dayjs().subtract(2, 'month').format('YYYY-MM-DD'),
      maxDate: dayjs().format('YYYY-MM-DD'),
    };
  }
  if (filter === 'custom' && customRange && customRange[0] && customRange[1]) {
    return {
      minDate: dayjs(customRange[0]).format('YYYY-MM-DD'),
      maxDate: dayjs(customRange[1]).format('YYYY-MM-DD'),
    };
  }
  return { minDate: '', maxDate: '' };
}
