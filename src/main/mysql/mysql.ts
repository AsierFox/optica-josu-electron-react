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

  ipcMain.handle('mysql-get-clients', async (_event, params: any[] = []) => {
    try {
      const [rows] = await query(`
        SELECT * FROM CLIENTS`, params);
      return ModelParserService.parseClientModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-products', async (_event, params: any[] = []) => {
    try {
      const [rows] = await query(`
        SELECT PRODUCTS.*, PRODUCT_TYPES.TYPE FROM PRODUCTS
        INNER JOIN PRODUCT_TYPES ON
          (PRODUCTS.ID_PRODUCT_TYPE = PRODUCT_TYPES.ID)`, params);
      return ModelParserService.parseProductModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-client-by-id', async (_event, clientId: number) => {
    try {
      const [rows] = await query(`
        SELECT * FROM CLIENTS WHERE ID = ?`, [clientId]);
      if (rows.length <= 0) {
        return null;
      }
      return ModelParserService.parseClientModels(rows as any [])[0];
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-client-examinatios-by-id', async (_event, clientId: number) => {
    try {
      const [rows] = await query(`
        SELECT * FROM EXAMINATIONS WHERE ID_CLIENT = ? ORDER BY UPDATED_AT DESC`, [clientId]);
      return ModelParserService.parseExaminationModels(rows as any []);
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
      const [result] = await query(`INSERT INTO PRODUCTS
        (PROVEEDOR, FIRMA, ID_PRODUCT_TYPE, REFERENCIA, MODELO_COLOR, CALIBRE_PUENTE,
        CANTIDAD, FECHA_COMPRA, PRECIO_COMPRA, FECHA_VENTA, PRECIO_VENTA, NOTES)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
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
      const [rows] = await query(`DELETE FROM PRODUCTS WHERE ID = ${productId}`);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-product-types', async () => {
    try {
      const [rows] = await query(`SELECT * FROM PRODUCT_TYPES`);
      return ModelParserService.parseProductTypes(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });
}
