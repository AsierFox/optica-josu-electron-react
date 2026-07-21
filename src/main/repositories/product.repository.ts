import { PRODUCT_STOCK_TYPE } from '../../renderer/app/constants';
import { TABLE_NAME } from '../ipcHandlers/mysql';
import ProductModel from '../models/product.model';
import BaseRepository from './base.repository';

export default class ProductRepository extends BaseRepository {

  static SPECIFIC_PRODUCT_TYPE_IDS = {
    MONTURA: [1, 2, 3, 4],
    LENTE_LENTILLAS: [5, 7],
  };

  private getQueryProductTypeWhereFilter(type: PRODUCT_STOCK_TYPE): string {
    switch (type) {
      case PRODUCT_STOCK_TYPE.MONTURA:
        return `${TABLE_NAME.product_type}.ID
          IN (${ProductRepository.SPECIFIC_PRODUCT_TYPE_IDS.MONTURA.join(', ')})`;
      case PRODUCT_STOCK_TYPE.LENTE_LENTILLA:
        return `${TABLE_NAME.product_type}.ID
          IN (${ProductRepository.SPECIFIC_PRODUCT_TYPE_IDS.LENTE_LENTILLAS.join(', ')})`;
      case PRODUCT_STOCK_TYPE.GENERICO:
      default:
        // Productos Genéricos
        return `${TABLE_NAME.product_type}.ID
          NOT IN (${[
            ...ProductRepository.SPECIFIC_PRODUCT_TYPE_IDS.MONTURA,
            ...ProductRepository.SPECIFIC_PRODUCT_TYPE_IDS.LENTE_LENTILLAS].join(', ')
          })`;
    }
  }

  getQueryProductTableByType(type: PRODUCT_STOCK_TYPE): string {
    switch (type) {
      case PRODUCT_STOCK_TYPE.MONTURA:
        return TABLE_NAME.product_montura;
      case PRODUCT_STOCK_TYPE.LENTE_LENTILLA:
        return TABLE_NAME.product_lente_lentilla;
      case PRODUCT_STOCK_TYPE.GENERICO:
      default:
        return TABLE_NAME.product_generico;
    }
  }

  getQueryAllProducts(): string {
    return `
      SELECT *,
      p.ID as ID,
      ${TABLE_NAME.product_type}.TYPE
      FROM ${TABLE_NAME.product} p
      INNER JOIN ${TABLE_NAME.product_type} ON
        (${TABLE_NAME.product_type}.id = p.product_type_id)
      LEFT JOIN ${TABLE_NAME.product_montura} p_montura ON
        (p_montura.product_id = p.id)
      LEFT JOIN ${TABLE_NAME.product_lente_lentilla} p_lente_lentilla ON
        (p_lente_lentilla.product_id = p.id)
      LEFT JOIN ${TABLE_NAME.product_generico} p_generico ON
        (p_generico.product_id = p.id)`;
  }

  getQueryProductsByTypeCheckingOrders(type: PRODUCT_STOCK_TYPE): string {
    return `
      SELECT p.*, p_specific.*,
      p_specific.PRODUCT_ID as ID,
      ${TABLE_NAME.product_type}.TYPE,
        EXISTS (
          SELECT 1
          FROM ${TABLE_NAME.order_item} oi
          JOIN ${TABLE_NAME.order} o
            ON o.id = oi.order_id
          WHERE oi.product_id = p.id
            AND o.fecha_venta IS NOT NULL
        ) AS HAS_ORDER
      FROM ${TABLE_NAME.product} p
      INNER JOIN ${TABLE_NAME.product_type} ON
        (${TABLE_NAME.product_type}.id = p.product_type_id)
      INNER JOIN ${this.getQueryProductTableByType(type)} p_specific ON
        (p_specific.product_id = p.id)
      WHERE ${this.getQueryProductTypeWhereFilter(type)}`;
  }

  getProductParamsByType(type: PRODUCT_STOCK_TYPE, productId: string, product: ProductModel) {
    switch (type) {
      case PRODUCT_STOCK_TYPE.MONTURA:
        return [
          productId,
          product.proveedor ?? null,
          product.firma,
          product.referencia,
          product.modelo ?? null,
          product.color ?? null,
          product.calibrePuente ?? null,
          productId,
        ];
      case PRODUCT_STOCK_TYPE.LENTE_LENTILLA:
        return [
          productId,
          product.numeroPedido ?? null,
          product.odGraduacion ?? null,
          product.oiGraduacion ?? null,
          product.odAdicion ?? null,
          product.oiAdicion ?? null,
          product.odPrisma ?? null,
          product.oiPrisma ?? null,
          productId,
        ];
      case PRODUCT_STOCK_TYPE.GENERICO:
      default:
        // Productos Genéricos
        return [
          productId,
          product.description ?? null,
          productId,
        ];
    }
  }

  getProductInsertQuery(type: PRODUCT_STOCK_TYPE) {
    let insertQuery = 'INSERT INTO ';
    switch (type) {
      case PRODUCT_STOCK_TYPE.MONTURA:
        insertQuery += `${TABLE_NAME.product_montura}
          (PRODUCT_ID, PROVEEDOR, FIRMA, REFERENCIA, MODELO, COLOR, CALIBRE_PUENTE)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
        break;
      case PRODUCT_STOCK_TYPE.LENTE_LENTILLA:
        insertQuery += `${TABLE_NAME.product_lente_lentilla}
          (PRODUCT_ID, NUMERO_PEDIDO, OD_GRADUACION, OI_GRADUACION, OD_ADICION, OI_ADICION, OD_PRISMA, OI_PRISMA)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        break;
      case PRODUCT_STOCK_TYPE.GENERICO:
      default:
        // Productos Genéricos
        insertQuery += `${TABLE_NAME.product_generico}
          (PRODUCT_ID, DESCRIPTION)
          VALUES (?, ?)`;
      break;
    }
    return insertQuery;
  }

  getProductUpdateQuery(type: PRODUCT_STOCK_TYPE) {
    let insertQuery = 'UPDATE ';
    switch (type) {
      case PRODUCT_STOCK_TYPE.MONTURA:
        insertQuery += `${TABLE_NAME.product_montura}
          SET
            PRODUCT_ID = ?,
            PROVEEDOR = ?,
            FIRMA = ?,
            REFERENCIA = ?,
            MODELO = ?,
            COLOR = ?,
            CALIBRE_PUENTE = ?
          WHERE PRODUCT_ID = ?`;
        break;
      case PRODUCT_STOCK_TYPE.LENTE_LENTILLA:
        insertQuery += `${TABLE_NAME.product_lente_lentilla}
          SET
            PRODUCT_ID = ?,
            NUMERO_PEDIDO = ?,
            OD_GRADUACION = ?,
            OI_GRADUACION = ?,
            OD_ADICION = ?,
            OI_ADICION = ?,
            OD_PRISMA = ?,
            OI_PRISMA = ?
          WHERE PRODUCT_ID = ?`;
        break;
      case PRODUCT_STOCK_TYPE.GENERICO:
      default:
        // Productos Genéricos
        insertQuery += `${TABLE_NAME.product_generico}
          SET
            PRODUCT_ID = ?,
            DESCRIPTION = ?
          WHERE PRODUCT_ID = ?`;
      break;
    }
    return insertQuery;
  }

}
