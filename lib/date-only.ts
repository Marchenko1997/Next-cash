import { endOfMonth, format, isValid, parse, startOfMonth } from "date-fns";

export const DATE_ONLY_FORMAT = "yyyy-MM-dd";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parseDateOnly = (value: string) =>
  parse(value, DATE_ONLY_FORMAT, new Date());

export const isDateOnlyString = (value: string) => {
  if (!DATE_ONLY_PATTERN.test(value)) {
    return false;
  }

  const parsedDate = parseDateOnly(value);
  return isValid(parsedDate) && format(parsedDate, DATE_ONLY_FORMAT) === value;
};

export const formatDateOnly = (value: Date) => format(value, DATE_ONLY_FORMAT);

export const getDateParts = (value: string) => {
  const parsedDate = parseDateOnly(value);

  return {
    month: parsedDate.getMonth() + 1,
    year: parsedDate.getFullYear(),
  };
};

export const getMonthBounds = (year: number, month: number) => {
  const baseDate = new Date(year, month - 1, 1);

  return {
    start: formatDateOnly(startOfMonth(baseDate)),
    end: formatDateOnly(endOfMonth(baseDate)),
  };
};
