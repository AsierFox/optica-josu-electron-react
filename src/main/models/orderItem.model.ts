import BaseModel from './base.model';
import ProductModel from './product.model';

export default class OrderItemModel extends BaseModel {
  id!: string;
  productId!: string | null;
  product!: ProductModel | null;
  precioVenta!: number | null;
  cantidad!: number | null;

  constructor(row?: any) {
    super();

    this.id = row.ID;

    this.productId = row.PRODUCT_ID;
    this.productId = row.PRODUCT;
    this.precioVenta = row.PRECIO_VENTA;
    this.cantidad = row.CANTIDAD;
  }

}
