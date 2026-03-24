import { ipcMain } from 'electron';
import mysql from 'mysql2/promise';
import ModelParserService from '../models/modelParser.service';
import ProductModel from '../models/product.model';

async function query(sql: string, params: any[] = []) {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "optica_josu",
  });
  const [rows] = await connection.execute(sql, params);
  await connection.end();
  return [rows];
}

export const registerMysqlIPCHandlers = () => {

  ipcMain.handle('mysql-get-products', async (_event, params: any[] = []) => {
    try {
      const [rows] = await query(`
        SELECT PRODUCT.*, PRODUCT_TYPE.TYPE FROM PRODUCT
        INNER JOIN PRODUCT_TYPE ON
          (PRODUCT.ID_PRODUCT_TYPE = PRODUCT_TYPE.ID)`, params);
      return ModelParserService.parseProductModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-product', async (_event, product: ProductModel) => {
    try {
      const params = [
        product.proveedor ?? null,
        product.firma ?? null,
        product.typeId,
        product.referencia,
        product.modeloColor ?? null,
        product.calibrePuente ?? null,
        product.cantidad ?? 1,
        product.fechaCompra ?? null,
        product.precioCompra ?? null,
        product.fechaVenta ?? null,
        product.precioVenta ?? null,
        product.notes ?? null,
      ];
      const [result] = await query(`INSERT INTO PRODUCT
        (PROVEEDOR, FIRMA, ID_PRODUCT_TYPE, REFERENCIA, MODELO_COLOR, CALIBRE_PUENTE,
        CANTIDAD, FECHA_COMPRA, PRECIO_COMPRA, FECHA_VENTA, PRECIO_VENTA, NOTES)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
      // @ts-ignore - MySQL insert result contains insertId
      console.log(result.insertId)
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-product', async (_event, product: ProductModel) => {
    try {
      const [rows] = await query(`UPDATE PRODUCT
        SET
          PROVEEDOR = ${product.proveedor ? `'${product.proveedor}'` : 'NULL'},
          FIRMA = ${product.firma ? `'${product.firma}'` : 'NULL'},
          ID_PRODUCT_TYPE = ${product.typeId},
          REFERENCIA = '${product.referencia}',
          MODELO_COLOR = ${product.modeloColor ? `'${product.modeloColor}'` : 'NULL'},
          CALIBRE_PUENTE = ${product.calibrePuente ? `'${product.calibrePuente}'` : 'NULL'},
          CANTIDAD = ${product.cantidad ?? 0},
          FECHA_COMPRA = ${product.fechaCompra ? `'${product.fechaCompra}'` : 'NULL'},
          PRECIO_COMPRA = ${product.precioCompra ? `'${product.precioCompra}'` : 'NULL'},
          FECHA_VENTA = ${product.fechaVenta ? `'${product.fechaVenta}'` : 'NULL'},
          PRECIO_VENTA = ${product.precioVenta ? `'${product.precioVenta}'` : 'NULL'},
          NOTES = ${product.notes ? `'${product.notes}'` : 'NULL'}
        WHERE ID = ${product.id}
      `);
      // @ts-ignore - MySQL insert result contains insertId
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-delete-product', async (_event, productId: number) => {
    try {
      const [rows] = await query(`DELETE FROM PRODUCT WHERE ID = ${productId}`);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-product-types', async () => {
    try {
      const [rows] = await query(`SELECT * FROM PRODUCT_TYPE`);
      return ModelParserService.parseProductTypes(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });
}
