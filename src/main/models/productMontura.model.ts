import { NEW_ROW_ID_PREFIX } from '../../renderer/app/constants';
import util from '../../renderer/utils/util';
import ProductModel from './product.model';

export default class ProductMonturaModel extends ProductModel {
  proveedor!: string | null;
  firma!: string | null;
  referencia!: string;
  modelo!: string | null;
  color!: string | null;
  calibrePuente!: string | null;

  constructor(row?: any) {
    super(row);

    if (!row) {
      return;
    }

    this.proveedor = row.PROVEEDOR;
    this.firma = row.FIRMA;
    this.referencia = row.REFERENCIA;
    this.modelo = row.MODELO;
    this.color = row.COLOR;
    this.calibrePuente = row.CALIBRE_PUENTE;
  }
}
