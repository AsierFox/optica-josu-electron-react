import dayjs from "dayjs";

export interface ProductStockFilterValue {
  // Mejor los UnionType, porque los enum generan código JavaScript extra al compilar
  type: 'SINGLE' | 'MULTIPLE' | 'RANGE_NUMBER' | 'RANGE_DATE';
  targetKey: string;
  value: string | string[] | { min: string | null; max: string | null };
}
