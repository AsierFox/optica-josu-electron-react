import dayjs, { Dayjs } from 'dayjs';
import { DATE_FORMATS, NEW_ROW_ID_PREFIX, PRODUCT_STOCK_TYPE } from '../app/constants';
import ProductModel from '../../main/models/product.model';
import ProductGenericoModel from '../../main/models/productGenerico.model';
import ProductMonturaModel from '../../main/models/productMontura.model';
import ProductLenteLentillaModel from '../../main/models/productLenteLentilla.model';

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

const generateNewTempProductByType = (type: PRODUCT_STOCK_TYPE): ProductModel => {
  let newProduct: ProductModel;

  switch (type) {
    case PRODUCT_STOCK_TYPE.GENERICO:
      newProduct = new ProductGenericoModel();
      break;
    case PRODUCT_STOCK_TYPE.MONTURA:
      newProduct = new ProductMonturaModel();
      break;
    case PRODUCT_STOCK_TYPE.LENTE_LENTILLA:
      newProduct =  new ProductLenteLentillaModel();
      break;
  }

  const newTemporalId = NEW_ROW_ID_PREFIX + Date.now();
  newProduct.id = newTemporalId;

  return newProduct;
}


const util = {
  uniq,
  sortAlphabetically,
  equalsStrings,
  includesStrings,
  formatDateToYYYYMMDD,
  isNumeric,
  priceInputFormatter,
  priceInputParser,
  generateNewTempProductByType,
};

export default util;
