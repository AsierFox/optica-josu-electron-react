import { ipcMain } from 'electron';
import mysql from 'mysql2/promise';
import ClientModel from '../models/client.model';
import ExaminationModel from '../models/examination.model';
import ExaminationTypeModel from '../models/examinationType.model';
import ModelParserService from '../models/modelParser.service';
import ProductModel from '../models/product.model';
import ProductTypeModel from '../models/productType.model';
import SaleModel from '../models/sale.model';

async function query(sql: string, params: any[] = []) {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "optica_josu",
  });
  const [rows] = await connection.execute(sql, params);
  await connection.end();
  return [rows];
}

export const registerMysqlIPCHandlers = () => {

  ipcMain.handle('mysql-get-clients', async () : Promise<ClientModel[]> => {
    try {
      const [rows] = await query(`
        SELECT * FROM CLIENTS`);
      return ModelParserService.parseClientModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-products', async () : Promise<ProductModel[]> => {
    try {
      const [rows] = await query(`
        SELECT PRODUCTS.*, PRODUCT_TYPES.TYPE FROM PRODUCTS
        INNER JOIN PRODUCT_TYPES ON
          (PRODUCTS.ID_PRODUCT_TYPE = PRODUCT_TYPES.ID)`);
      return ModelParserService.parseProductModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-all-products-references-and-models', async () : Promise<ProductModel[]> => {
    try {
      const [rows] = await query(`SELECT ID, REFERENCIA, MODELO FROM PRODUCTS`);
      return ModelParserService.parseProductModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-product-types', async () : Promise<ProductTypeModel[]> => {
    try {
      const [rows] = await query(`SELECT * FROM PRODUCT_TYPES`);
      return ModelParserService.parseProductTypes(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-examination-types', async () : Promise<ExaminationTypeModel[]> => {
    try {
      const [rows] = await query(`SELECT * FROM EXAMINATION_TYPES`);
      return ModelParserService.parseProductTypes(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-client-examinations', async () : Promise<ExaminationModel[]> => {
    try {
      const [rows] = await query(`SELECT * FROM EXAMINATIONS`);
      return ModelParserService.parseExaminationModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-product-by-reference', async (_event, reference: string) : Promise<ProductModel | null> => {
    try {
      const [rows] = await query(`
        SELECT * FROM PRODUCTS WHERE REFERENCIA = ?`, [reference]);
      const foundProducts = ModelParserService.parseProductModels(rows as any []);
      return foundProducts.length > 0 ? foundProducts[0] : null;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-client-by-id', async (_event, clientId: number) : Promise<ClientModel | null> => {
    try {
      const [rows] = await query(`SELECT * FROM CLIENTS WHERE ID = ?`, [clientId]);
      const clients = ModelParserService.parseClientModels(rows as any []);
      return clients.length > 0 ? clients[0] : null;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-client-examinations-by-id', async (_event, clientId: number) : Promise<ExaminationModel[]> => {
    try {
      const [rows] = await query(`
        SELECT * FROM EXAMINATIONS WHERE ID_CLIENT = ? ORDER BY UPDATED_AT DESC`, [clientId]);
      return ModelParserService.parseExaminationModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-purchases-by-client-id', async (_event, clientId: number) : Promise<SaleModel[]> => {
    try {
      const [rows] = await query(`
        SELECT s.ID, s.FECHA_VENTA, s.PRECIO_VENTA,
               p.PROVEEDOR, p.FIRMA, p.REFERENCIA, p.MODELO, p.NOTES, p.PRECIO_COMPRA
        FROM SALES s
        RIGHT JOIN PRODUCTS p ON s.ID_PRODUCT = p.ID
        WHERE s.ID_CLIENT = ? ORDER BY s.UPDATED_AT DESC`, [clientId]);
      return ModelParserService.parseSaleModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-client', async (_event, client: ClientModel): Promise<number> => {
    try {
      const params = [
        client.nombre ?? null,
        client.apellidos ?? null,
        client.DNI ?? null,
        client.fechaNacimiento ?? null,
        client.telefono ?? null,
        client.telefonoAdicional ?? null,
        client.direccion ?? null,
        client.ciudad ?? null,
        client.codigoPostal ?? null,
        client.notes ?? null,
      ];

      const [result] = await query(`INSERT INTO CLIENTS
        (NOMBRE, APELLIDOS, DNI, FECHA_NACIMIENTO, TELEFONO, TELEFONO_ADICIONAL, DIRECCION, CIUDAD, CODIGO_POSTAL, NOTES)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
      // @ts-ignore - MySQL insert result contains insertId
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-examination', async (_event, examination: ExaminationModel): Promise<number> => {
    try {
      const params = [
        examination.idClient,
        examination.idExaminationType,
        examination.odEsfera ?? null,
        examination.odCilindro ?? null,
        examination.odEje ?? null,
        examination.odADD ?? null,
        examination.odAV ?? null,
        examination.odVP ?? null,
        examination.odVL ?? null,
        examination.odQueratometria ?? null,
        examination.oiEsfera ?? null,
        examination.oiCilindro ?? null,
        examination.oiEje ?? null,
        examination.oiADD ?? null,
        examination.oiAV ?? null,
        examination.oiVP ?? null,
        examination.oiVL ?? null,
        examination.oiQueratometria ?? null,
        examination.dipCerca ?? null,
        examination.dipLejos ?? null,
        examination.observaciones ?? null,
        examination.examinationDate ?? null,
      ];

      const [result] = await query(`INSERT INTO EXAMINATIONS
        (ID_CLIENT, ID_EXAMINATION_TYPE, OD_ESFERA, OD_CILINDRO, OD_EJE, OD_ADD, OD_AV, OD_VP, OD_VL, OD_QUERATOMETRIA,
        OI_ESFERA, OI_CILINDRO, OI_EJE, OI_ADD, OI_AV, OI_VP, OI_VL, OI_QUERATOMETRIA, DIP_CERCA, DIP_LEJOS, OBSERVACIONES, EXAMINATION_DATE)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
      // @ts-ignore - MySQL insert result contains insertId
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-product', async (_event, product: ProductModel): Promise<number> => {
    try {
      const params = [
        product.proveedor ?? null,
        product.firma ?? null,
        product.typeId,
        product.referencia,
        product.modelo ?? null,
        product.color ?? null,
        product.calibrePuente ?? null,
        product.fechaCompra ?? null,
        product.precioCompra ?? null,
        product.fechaVenta ?? null,
        product.precioVenta ?? null,
        product.notes ?? null,
      ];

      const [result] = await query(`INSERT INTO PRODUCTS
        (PROVEEDOR, FIRMA, ID_PRODUCT_TYPE, REFERENCIA, MODELO, COLOR, CALIBRE_PUENTE,
        FECHA_COMPRA, PRECIO_COMPRA, FECHA_VENTA, PRECIO_VENTA, NOTES)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
      // @ts-ignore - MySQL insert result contains insertId
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-products', async (_event, products: ProductModel[]) : Promise<number> => {
    try {
      const values = products.map((product) => [
        product.proveedor ?? null,
        product.firma ?? null,
        product.typeId,
        product.referencia,
        product.modelo ?? null,
        product.color ?? null,
        product.calibrePuente ?? null,
        product.fechaCompra ?? null,
        product.precioCompra ?? null,
        product.fechaVenta ?? null,
        product.precioVenta ?? null,
        product.notes ?? null,
      ]);

      const sql = `INSERT INTO PRODUCTS
        (PROVEEDOR, FIRMA, ID_PRODUCT_TYPE, REFERENCIA, MODELO, COLOR, CALIBRE_PUENTE,
        FECHA_COMPRA, PRECIO_COMPRA, FECHA_VENTA, PRECIO_VENTA, NOTES)
        VALUES ?`;

      const [result] = await query(sql, [values]);
      // @ts-ignore - MySQL insert result contains insertId
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-sale', async (_event, sale: SaleModel) : Promise<number> => {
    try {
      const sql = `INSERT INTO SALES
        (ID_PRODUCT, ID_CLIENT, FECHA_VENTA, PRECIO_VENTA)
        VALUES (
          ?,
          ?,
          ?,
          ?
        )`;

      const values = [
        sale.productId,
        sale.clientId,
        sale.fechaVenta,
        sale.precioVenta,
      ];

      const [result] = await query(sql, values);
      // @ts-ignore - MySQL insert result contains insertId
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-sales', async (_event, sales: SaleModel[]) : Promise<number> => {
    try {
      const sql = `INSERT INTO SALES
        (ID_PRODUCT, ID_CLIENT, FECHA_VENTA, PRECIO_VENTA)
        VALUES ${sales
          .map((sale) => `(
            ${sale.productId},
            ${sale.clientId},
            ${sale.fechaVenta ? `'${sale.fechaVenta}'` : 'NULL'},
            ${sale.precioVenta}
          )`).join(', ')}`;

      const [result] = await query(sql);
      // @ts-ignore - MySQL insert result contains insertId
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-client', async (_event, client: ClientModel) : Promise<void> => {
    try {
      const sql = `UPDATE CLIENTS
        SET
          NOMBRE = ?,
          APELLIDOS = ?,
          DNI = ?,
          FECHA_NACIMIENTO = ?,
          TELEFONO = ?,
          TELEFONO_ADICIONAL = ?,
          DIRECCION = ?,
          CIUDAD = ?,
          CODIGO_POSTAL = ?,
          NOTES = ?
        WHERE ID = ?`;

      const values = [
        client.nombre ?? null,
        client.apellidos ?? null,
        client.DNI ?? null,
        client.fechaNacimiento ?? null,
        client.telefono ?? null,
        client.telefonoAdicional ?? null,
        client.direccion ?? null,
        client.ciudad ?? null,
        client.codigoPostal ?? null,
        client.notes ?? null,
        client.id
      ];

      const [rows] = await query(sql, values);
      // @ts-ignore - MySQL insert result contains insertId
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-examination', async (_event, examination: ExaminationModel) : Promise<void> => {
    try {
      const sql = `UPDATE EXAMINATIONS
        SET
          ID_CLIENT = ?,
          ID_EXAMINATION_TYPE = ?,
          OD_ESFERA = ?,
          OD_CILINDRO = ?,
          OD_EJE = ?,
          OD_ADD = ?,
          OD_AV = ?,
          OD_VP = ?,
          OD_VL = ?,
          OD_QUERATOMETRIA = ?,
          OI_ESFERA = ?,
          OI_CILINDRO = ?,
          OI_EJE = ?,
          OI_ADD = ?,
          OI_AV = ?,
          OI_VP = ?,
          OI_VL = ?,
          OI_QUERATOMETRIA = ?,
          DIP_CERCA = ?,
          DIP_LEJOS = ?,
          OBSERVACIONES = ?,
          EXAMINATION_DATE = ?
        WHERE ID = ?`;

      const values = [
        examination.idClient ?? null,
        examination.idExaminationType ?? null,
        examination.odEsfera ?? null,
        examination.odCilindro ?? null,
        examination.odEje ?? null,
        examination.odADD ?? null,
        examination.odAV ?? null,
        examination.odVP ?? null,
        examination.odVL ?? null,
        examination.odQueratometria ?? null,
        examination.oiEsfera ?? null,
        examination.oiCilindro ?? null,
        examination.oiEje ?? null,
        examination.oiADD ?? null,
        examination.oiAV ?? null,
        examination.oiVP ?? null,
        examination.oiVL ?? null,
        examination.oiQueratometria ?? null,
        examination.dipCerca ?? null,
        examination.dipLejos ?? null,
        examination.observaciones ?? null,
        examination.examinationDate ?? null,
        examination.id
      ];

      console.log('Updating examination with values:', values);
      const [rows] = await query(sql, values);
      // @ts-ignore - MySQL insert result contains insertId
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-product', async (_event, product: ProductModel) : Promise<void> => {
    try {
      const sql = `UPDATE PRODUCTS
        SET
          PROVEEDOR = ?,
          FIRMA = ?,
          ID_PRODUCT_TYPE = ?,
          REFERENCIA = ?,
          MODELO = ?,
          COLOR = ?,
          CALIBRE_PUENTE = ?,
          FECHA_COMPRA = ?,
          PRECIO_COMPRA = ?,
          FECHA_VENTA = ?,
          PRECIO_VENTA = ?,
          NOTES = ?
        WHERE ID = ?`;

      const values = [
        product.proveedor ?? null,
        product.firma ?? null,
        product.typeId,
        product.referencia,
        product.modelo ?? null,
        product.color ?? null,
        product.calibrePuente ?? null,
        product.fechaCompra ?? null,
        product.precioCompra ?? null,
        product.fechaVenta ?? null,
        product.precioVenta ?? null,
        product.notes ?? null,
        product.id
      ];

      const [rows] = await query(sql, values);
      // @ts-ignore - MySQL insert result contains insertId
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-delete-examination', async (_event, examinationId: number) : Promise<void> => {
    try {
      const [rows] = await query(`DELETE FROM EXAMINATIONS WHERE ID = ${examinationId}`);
      // @ts-ignore - MySQL delete result contains affectedRows
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-delete-product', async (_event, productId: number) : Promise<void> => {
    try {
      const [rows] = await query(`DELETE FROM PRODUCTS WHERE ID = ${productId}`);
      // @ts-ignore - MySQL delete result contains affectedRows
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

};
