import ProductModel from './product.model';

export default class SaleModel {
  id!: string;
  productId!: number | null;
  clientId!: number | null;
  fechaVenta!: string | null;
  createdAt!: string | null;
  updatedAt!: string | null;

  product: ProductModel | null = null;

  constructor(row?: any) {
    this.id = row.ID;

    this.productId = row.PRODUCT_ID;
    this.clientId = row.CLIENT_ID;
    this.fechaVenta = row.FECHA_VENTA;
    this.createdAt = row.CREATED_AT;
    this.updatedAt = row.UPDATED_AT;

    this.product = row.product ?? null;
  }

}
