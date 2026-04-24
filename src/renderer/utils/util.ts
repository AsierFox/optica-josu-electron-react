import dayjs, { Dayjs } from 'dayjs';
import { DATE_FORMATS } from '../app/constants';

const uniq = <T,>(a: T[]): T[] => [...new Set(a)];

const sortAlphabetically = (a: string, b: string) => a?.localeCompare(b);

const equalsStrings = (a: string, b: string) => a?.toUpperCase().localeCompare(b?.toUpperCase());

const includesStrings = (a: string, b: string) => a?.toUpperCase().includes(b?.toUpperCase());

const formatDateToYYYYMMDD = (date: Dayjs) : string | null => date ? dayjs(date).format(DATE_FORMATS.YYYY_MM_DD) : null;

function isNumeric(str: string) {
  if (typeof str != "string") {
    return false; // we only process strings!
  }
  return !isNaN(str) && !isNaN(parseFloat(str));
}

const priceInputFormatter = (value: any) => {
  if (!value) return '';
  const parts = `${value}`.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
};

const priceInputParser = (value: any) => {
  if (!value) return '';
  return value.replace(/\./g, '').replace(',', '.');
};

const util = {
  uniq,
  sortAlphabetically,
  equalsStrings,
  includesStrings,
  formatDateToYYYYMMDD,
  isNumeric,
  priceInputFormatter,
  priceInputParser,
};

export default util;
