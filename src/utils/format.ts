import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** "4月11日 周五" */
export function formatDate(date: string): string {
  const d = dayjs(date);
  return `${d.month() + 1}月${d.date()}日 ${WEEKDAYS[d.day()]}`;
}

/** "3,165.00" */
export function formatAmount(amount: number): string {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 返回某月的起止日期 YYYY-MM-DD */
export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const d = dayjs().year(year).month(month - 1);
  return {
    start: d.startOf('month').format('YYYY-MM-DD'),
    end: d.endOf('month').format('YYYY-MM-DD'),
  };
}

/** 返回当前年月 */
export function getCurrentYearMonth(): { year: number; month: number } {
  const now = dayjs();
  return { year: now.year(), month: now.month() + 1 };
}
