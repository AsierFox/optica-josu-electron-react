export interface ProductStockFilterValue {
  // Mejor los UnionType, porque los enum generan código JavaScript extra al compilar
  type: 'SINGLE' | 'MULTIPLE';
  targetKey: string;
  value: string | string[];
}
