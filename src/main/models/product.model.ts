import BaseModel from './base.model';
import OrderModel from './order.model';

export default abstract class ProductModel extends BaseModel {
  id!: string;
  typeId!: number | null;
  type!: string | null;
  fechaCompra!: string | null;
  precioCompra!: number | null;
  precioVenta!: number | null;
  notes!: string | null;
  createdAt!: string | null;
  updatedAt!: string | null;

  hasOrder!: boolean;
  order!: OrderModel | null;

  constructor(row?: any) {
    super();

    if (!row) {
      return;
    }

    this.id = row.ID;
    this.typeId = row.PRODUCT_TYPE_ID;
    this.type = row.TYPE;
    this.fechaCompra = row.FECHA_COMPRA;
    this.precioCompra = row.PRECIO_COMPRA;
    this.precioVenta = row.PRECIO_VENTA;

    this.notes = row.NOTES;

    this.createdAt = row.CREATED_AT;
    this.updatedAt = row.UDPATED_AT;

    this.hasOrder = row.HAS_ORDER || false;
    this.order = row.order ?? null;
  }

}
