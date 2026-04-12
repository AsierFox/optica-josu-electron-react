import { ipcMain } from 'electron';
import mysql from 'mysql2/promise';
import ClientModel from '../models/client.model';
import ExaminationModel from '../models/examination.model';
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

  ipcMain.handle('mysql-get-product-types', async () => {
    try {
      const [rows] = await query(`SELECT * FROM PRODUCT_TYPES`);
      return ModelParserService.parseProductTypes(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-examination-types', async () => {
    try {
      const [rows] = await query(`SELECT * FROM EXAMINATION_TYPES`);
      return ModelParserService.parseProductTypes(rows as any []);
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

  ipcMain.handle('mysql-create-client', async (_event, client: ClientModel): Promise<number> => {
    try {
      const params = [
        client.nombre ?? null,
        client.apellidos ?? null,
        client.DNI ?? null,
        client.fechaNacimiento ?? null,
        client.telefono ?? null,
        client.direccion ?? null,
        client.ciudad ?? null,
        client.codigoPostal ?? null,
        client.notes ?? null,
      ];
      const [result] = await query(`INSERT INTO CLIENTS
        (NOMBRE, APELLIDOS, DNI, FECHA_NACIMIENTO, TELEFONO, DIRECCION, CIUDAD, CODIGO_POSTAL, NOTES)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
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
        examination.dip ?? null,
        examination.createdAt ?? null,
        examination.updatedAt ?? null,
      ];
      const [result] = await query(`INSERT INTO EXAMINATIONS
        (ID_CLIENT, ID_EXAMINATION_TYPE, OD_ESFERA, OD_CILINDRO, OD_EJE, OD_ADD, OD_AV, OD_VP, OD_VL, OD_QUERATOMETRIA,
        OI_ESFERA, OI_CILINDRO, OI_EJE, OI_ADD, OI_AV, OI_VP, OI_VL, OI_QUERATOMETRIA, DIP, CREATED_AT, UPDATED_AT)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
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
        product.cantidad ?? 1,
        product.fechaCompra ?? null,
        product.precioCompra ?? null,
        product.fechaVenta ?? null,
        product.precioVenta ?? null,
        product.notes ?? null,
      ];
      const [result] = await query(`INSERT INTO PRODUCTS
        (PROVEEDOR, FIRMA, ID_PRODUCT_TYPE, REFERENCIA, MODELO, COLOR, CALIBRE_PUENTE,
        CANTIDAD, FECHA_COMPRA, PRECIO_COMPRA, FECHA_VENTA, PRECIO_VENTA, NOTES)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-client', async (_event, client: ClientModel) => {
    try {
      const [rows] = await query(`UPDATE CLIENTS
        SET
          NOMBRE = ${client.nombre ? `'${client.nombre}'` : 'NULL'},
          APELLIDOS = ${client.apellidos ? `'${client.apellidos}'` : 'NULL'},
          DNI = ${client.DNI ? `'${client.DNI}'` : 'NULL'},
          FECHA_NACIMIENTO = ${client.fechaNacimiento ? `'${client.fechaNacimiento}'` : 'NULL'},
          TELEFONO = ${client.telefono ? `'${client.telefono}'` : 'NULL'},
          DIRECCION = ${client.direccion ? `'${client.direccion}'` : 'NULL'},
          CIUDAD = ${client.ciudad ? `'${client.ciudad}'` : 'NULL'},
          CODIGO_POSTAL = ${client.codigoPostal ? `'${client.codigoPostal}'` : 'NULL'},
          NOTES = ${client.notes ? `'${client.notes}'` : 'NULL'}
        WHERE ID = ${client.id}
      `);
      // @ts-ignore - MySQL insert result contains insertId
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-examination', async (_event, examination: ExaminationModel) => {
    try {
      const [rows] = await query(`UPDATE EXAMINATIONS
        SET
          ID_CLIENT = ${examination.idClient ? `${examination.idClient}` : 'NULL'},
          ID_EXAMINATION_TYPE = ${examination.idExaminationType ? `${examination.idExaminationType}` : 'NULL'},
          OD_ESFERA = ${examination.odEsfera ? `'${examination.odEsfera}'` : 'NULL'},
          OD_CILINDRO = ${examination.odCilindro ? `'${examination.odCilindro}'` : 'NULL'},
          OD_EJE = ${examination.odEje ? `'${examination.odEje}'` : 'NULL'},
          OD_ADD = ${examination.odADD ? `'${examination.odADD}'` : 'NULL'},
          OD_AV = ${examination.odAV ? `'${examination.odAV}'` : 'NULL'},
          OD_VP = ${examination.odVP ? `'${examination.odVP}'` : 'NULL'},
          OD_VL = ${examination.odVL ? `'${examination.odVL}'` : 'NULL'},
          OD_QUERATOMETRIA = ${examination.odQueratometria ? `'${examination.odQueratometria}'` : 'NULL'},
          OI_ESFERA = ${examination.oiEsfera ? `'${examination.oiEsfera}'` : 'NULL'},
          OI_CILINDRO = ${examination.oiCilindro ? `'${examination.oiCilindro}'` : 'NULL'},
          OI_EJE = ${examination.oiEje ? `'${examination.oiEje}'` : 'NULL'},
          OI_ADD = ${examination.oiADD ? `'${examination.oiADD}'` : 'NULL'},
          OI_AV = ${examination.oiAV ? `'${examination.oiAV}'` : 'NULL'},
          OI_VP = ${examination.oiVP ? `'${examination.oiVP}'` : 'NULL'},
          OI_VL = ${examination.oiVL ? `'${examination.oiVL}'` : 'NULL'},
          OI_QUERATOMETRIA = ${examination.oiQueratometria ? `'${examination.oiQueratometria}'` : 'NULL'},
          DIP = ${examination.dip ? `'${examination.dip}'` : 'NULL'}
        WHERE ID = ${examination.id}
      `);
      // @ts-ignore - MySQL insert result contains insertId
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-product', async (_event, product: ProductModel) => {
    try {
      const [rows] = await query(`UPDATE PRODUCTS
        SET
          PROVEEDOR = ${product.proveedor ? `'${product.proveedor}'` : 'NULL'},
          FIRMA = ${product.firma ? `'${product.firma}'` : 'NULL'},
          ID_PRODUCT_TYPE = ${product.typeId},
          REFERENCIA = '${product.referencia}',
          MODELO = ${product.modelo ? `'${product.modelo}'` : 'NULL'},
          COLOR = ${product.color ? `'${product.color}'` : 'NULL'},
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

}
