import { NEW_PRODUCT_ID_PREFIX } from '../../renderer/app/constants';
import util from '../../renderer/utils/util';

export default class ProductModel {
  id!: string;
  proveedor!: string | null;
  firma!: string | null;
  referencia!: string;
  modeloColor!: string | null;
  typeId!: number | null;
  type!: string | null;
  calibrePuente!: string | null;
  precioCompra!: number | null;
  precioVenta!: number | null;
  cantidad!: number;
  fechaCompra!: string | null;
  fechaVenta!: string | null;
  notes!: string | null;
  createdAt!: string | null;
  updatedAt!: string | null;

  constructor(row?: any) {
    if (row)
      this.createNewProductFromDDBB(row);
    else
      this.createNewProduct();
  }

  createNewProduct() {
    const newGeneratedId = NEW_PRODUCT_ID_PREFIX + Date.now();

    this.id = newGeneratedId;
    this.proveedor = null;
    this.firma = null;
    this.referencia = '';
    this.modeloColor = null;
    this.typeId = null;
    this.type = null;
    this.precioCompra = null;
    this.precioVenta = null;
    this.calibrePuente = null;
    this.cantidad = 1;

    this.fechaCompra = null;
    this.fechaVenta = null;

    this.notes = null;

    this.createdAt = null;
    this.updatedAt = null;
  }

  createNewProductFromDDBB(row: any) {
    this.id = row.ID;
    this.proveedor = row.PROVEEDOR;
    this.firma = row.FIRMA;
    this.referencia = row.REFERENCIA;
    this.modeloColor = row.MODELO_COLOR;
    this.typeId = row.ID_PRODUCT_TYPE;
    this.type = row.TYPE;
    this.precioCompra = row.PRECIO_COMPRA;
    this.precioVenta = row.PRECIO_VENTA;
    this.calibrePuente = row.CALIBRE_PUENTE;
    this.cantidad = row.CANTIDAD;

    this.fechaCompra = util.formatDateToYYYYMMDD(row.FECHA_COMPRA);
    this.fechaVenta = util.formatDateToYYYYMMDD(row.FECHA_VENTA);

    this.notes = row.NOTES;

    this.createdAt = row.CREATED_AT;
    this.updatedAt = row.UDPATED_AT;
  }
}
