import dayjs from 'dayjs';

export default {
  dateFormatter: (date: Date): string => dayjs(date).format('YYYY-MM-DD'),
  dateCustomFormatter: (date: Date | string | number, format: string): string =>
    dayjs(date).format(format),
  monthMaxDate: (date: Date): number => {
    const nowMaxDate = new Date(date.getFullYear(), date.getMonth() + 1, -1);
    return nowMaxDate.getDate() + 1;
  },
  getOneMonthRange: (year: string, month: string) => {
    if (month === '12') {
      return {
        start: `${year}-${month}`,
        end: `${Number(year) + 1}-${1}`,
      };
    }
    return {
      start: `${year}-${month}`,
      end: `${year}-${Number(month) + 1}`,
    };
  },
  getNextDate: (date: Date | string) =>
    dayjs(date).add(1, 'day').format('YYYY-MM-DD'),
};
