import dayjs, { Dayjs } from 'dayjs';
import { DATE_FORMATS } from '../app/constants';

const uniq = <T,>(a: T[]): T[] => [...new Set(a)];

const sortAlphabetically = (a: string, b: string) => a?.localeCompare(b);

const equalsStrings = (a: string, b: string) => a?.toUpperCase().localeCompare(b?.toUpperCase());

const includesStrings = (a: string, b: string) => a?.toUpperCase().includes(b?.toUpperCase());

const formatDateToYYYYMMDD = (date: Dayjs) : string | null => date ? dayjs(date).format(DATE_FORMATS.YYYY_MM_DD) : null;

const util = {
  uniq,
  sortAlphabetically,
  equalsStrings,
  includesStrings,
  formatDateToYYYYMMDD,
};

export default util;
