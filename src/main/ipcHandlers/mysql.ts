import { ipcMain } from 'electron';
import mysql from 'mysql2/promise';
import { PRODUCT_STOCK_TYPE } from '../../renderer/app/constants';
import CustomerModel from '../models/customer.model';
import ExaminationModel from '../models/examination.model';
import ExaminationTypeModel from '../models/examinationType.model';
import ModelParserService from '../models/modelParser.service';
import OrderModel from '../models/order.model';
import SaleByPeriodModel from '../models/orderByPeriod.model';
import ProductModel from '../models/product.model';
import ProductTypeModel from '../models/productType.model';
import ProductRepository from '../repositories/product.repository';

export const TABLE_NAME = {
  customer: 'CUSTOMER',
  examination: 'EXAMINATION',
  examination_type: 'EXAMINATION_TYPE',
  order: '`ORDER`', // Las comillas son necesarias porque es un keyword de SQL
  order_item: 'ORDER_ITEM',
  order_status: 'ORDER_STATUS',
  product_type: 'PRODUCT_TYPE',
  product: 'PRODUCT',
  product_generico: 'PRODUCT_GENERICO',
  product_montura: 'PRODUCT_MONTURA',
  product_lente_lentilla: 'PRODUCT_LENTE_LENTILLA',
};

const CONNECTION_PARAMS = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "optica_josu_new",
};

async function query(sql: string, params: any[] = []) {
  const connection = await mysql.createConnection(CONNECTION_PARAMS);
  const [rows] = await connection.execute(sql, params);
  await connection.end();
  return [rows];
}

async function transaction<T>(callback: (connection: mysql.Connection) => Promise<T>) {
  const connection = await mysql.createConnection(CONNECTION_PARAMS);
  try {
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

export const registerMysqlIPCHandlers = () => {

  ipcMain.handle('mysql-get-customers', async () : Promise<CustomerModel[]> => {
    try {
      const [rows] = await query(`
        SELECT * FROM ${TABLE_NAME.customer}`);
      return ModelParserService.parseCustomerModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-all-products', async () : Promise<ProductModel[]> => {
    try {
      const productRepository = new ProductRepository();
      const queryString = productRepository.getQueryAllProducts();
      const [rows] = await query(queryString);
      return ModelParserService.parseProductsModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-products-checking-orders-exists', async (_event, type: PRODUCT_STOCK_TYPE) : Promise<ProductModel[]> => {
    try {
      const productRepository = new ProductRepository();
      const queryString = productRepository.getQueryProductsByTypeCheckingOrders(type);
      const [rows] = await query(queryString);
      return ModelParserService.parseProductsModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-all-products-for-sale', async (_event, productId?: number) : Promise<ProductModel[]> => {
    try {
      const [rows] = await query(`
        SELECT *
        FROM ${TABLE_NAME.product}
        WHERE ID NOT IN (
            SELECT PRODUCT_ID
            FROM ${TABLE_NAME.order}
          )
          OR ID = ?`,
        [
          productId ?? null
        ]);
      return ModelParserService.parseProductModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-product-types', async () : Promise<ProductTypeModel[]> => {
    try {
      const [rows] = await query(`SELECT * FROM ${TABLE_NAME.product_type}`);
      return ModelParserService.parseProductTypes(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-examination-types', async () : Promise<ExaminationTypeModel[]> => {
    try {
      const [rows] = await query(`SELECT * FROM ${TABLE_NAME.examination_type}`);
      return ModelParserService.parseProductTypes(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-customer-by-id', async (_event, customerId: number) : Promise<CustomerModel | null> => {
    try {
      const [rows] = await query(`SELECT * FROM ${TABLE_NAME.customer} WHERE ID = ?`, [customerId]);
      const customers = ModelParserService.parseCustomerModels(rows as any []);
      return customers.length > 0 ? customers[0] : null;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-customer-examinations-by-id', async (_event, customerId: number) : Promise<ExaminationModel[]> => {
    try {
      const [rows] = await query(`
        SELECT * FROM ${TABLE_NAME.examination} WHERE CUSTOMER_ID = ? ORDER BY UPDATED_AT DESC`, [customerId]);
      return ModelParserService.parseExaminationModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-orders-with-items-by-customer-id', async (_event, customerId: number) : Promise<OrderModel[]> => {
    try {
      const [rows] = await query(`
        SELECT o.*, oi.*,
          p.*, pt.*, p_montura.*, p_lente_lentilla.*, p_generico.*,
          o.ID as ID,
          os.STATUS as ORDER_STATUS,
          o.FECHA_VENTA,
          oi.PRECIO_VENTA
        FROM ${TABLE_NAME.order} o
        RIGHT JOIN ${TABLE_NAME.order_status} os ON os.ID = o.ORDER_STATUS_ID
        RIGHT JOIN ${TABLE_NAME.order_item} oi ON oi.ORDER_ID = o.ID
        RIGHT JOIN ${TABLE_NAME.product} p ON p.ID = oi.PRODUCT_ID
        RIGHT JOIN ${TABLE_NAME.product_type} pt ON pt.ID = p.PRODUCT_TYPE_ID
        LEFT JOIN ${TABLE_NAME.product_montura} p_montura ON p_montura.product_id = p.id
        LEFT JOIN ${TABLE_NAME.product_lente_lentilla} p_lente_lentilla ON p_lente_lentilla.product_id = p.id
        LEFT JOIN ${TABLE_NAME.product_generico} p_generico ON p_generico.product_id = p.id
        WHERE o.CUSTOMER_ID = ?
        ORDER BY o.FECHA_VENTA DESC`, [customerId]);
      return ModelParserService.parseOrdersModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-orders-by-product-id', async (_event, productId: number) : Promise<OrderModel[]> => {
    try {
      const [rows] = await query(`
        SELECT o.ID, o.ORDER_STATUS_ID, o.CUSTOMER_ID, o.FECHA_VENTA,
          os.STATUS as ORDER_STATUS
        FROM ${TABLE_NAME.order} o
        RIGHT JOIN ${TABLE_NAME.order_status} os ON os.ID = o.ORDER_STATUS_ID
        RIGHT JOIN ${TABLE_NAME.order_item} oi ON oi.ORDER_ID = o.ID
        WHERE oi.PRODUCT_ID = ?
        GROUP BY o.ID, o.ORDER_STATUS_ID, o.CUSTOMER_ID, o.FECHA_VENTA, os.STATUS
        ORDER BY o.FECHA_VENTA DESC`, [productId]);
      return ModelParserService.parseOrdersModels(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-get-sales-by-year-month', async (_event) : Promise<SaleByPeriodModel[]> => {
    try {
      const [rows] = await query(`
        SELECT
          COUNT(*) AS TOTAL,
          DATE_FORMAT(FECHA_VENTA, '%Y-%m') AS PERIOD
        FROM ${TABLE_NAME.order}
        GROUP BY YEAR(FECHA_VENTA), MONTH(FECHA_VENTA);`);
      return ModelParserService.parseSaleByPeriodModel(rows as any []);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-customer', async (_event, customer: CustomerModel): Promise<number> => {
    try {
      const params = [
        customer.nombre ?? null,
        customer.apellidos ?? null,
        customer.DNI ?? null,
        customer.fechaNacimiento ?? null,
        customer.telefono ?? null,
        customer.telefonoAdicional ?? null,
        customer.direccion ?? null,
        customer.ciudad ?? null,
        customer.codigoPostal ?? null,
        customer.notes ?? null,
      ];

      const [result] = await query(`INSERT INTO ${TABLE_NAME.customer}
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
        examination.customerId,
        examination.examinationTypeId,
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

      const [result] = await query(`INSERT INTO ${TABLE_NAME.examination}
        (CUSTOMER_ID, EXAMINATION_TYPE_ID, OD_ESFERA, OD_CILINDRO, OD_EJE, OD_ADD, OD_AV, OD_VP, OD_VL, OD_QUERATOMETRIA,
        OI_ESFERA, OI_CILINDRO, OI_EJE, OI_ADD, OI_AV, OI_VP, OI_VL, OI_QUERATOMETRIA, DIP_CERCA, DIP_LEJOS, OBSERVACIONES, EXAMINATION_DATE)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
      // @ts-ignore - MySQL insert result contains insertId
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-product', async (_event, type: PRODUCT_STOCK_TYPE, product: ProductModel): Promise<void> => {
    try {
      return await transaction(async (connection) => {
        const productRepository = new ProductRepository();

        // 1. Insertamos los datos en product
        const productParams = [
          product.typeId,
          product.fechaCompra ?? null,
          product.precioCompra ?? null,
          product.precioVenta ?? null,
          product.notes ?? null,
        ];

        const [productResult] = await connection.execute(`INSERT INTO ${TABLE_NAME.product}
          (PRODUCT_TYPE_ID, FECHA_COMPRA, PRECIO_COMPRA, PRECIO_VENTA, NOTES)
          VALUES (?, ?, ?, ?, ?)`, productParams);

        // @ts-ignore - MySQL insert result contains insertId
        const productId = productResult.insertId;

        const specificProductParams = productRepository.getProductParamsByType(type, productId, product);

        await connection.execute(productRepository.getProductInsertQuery(type), specificProductParams);

        return productId;
      });
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-create-sale', async (_event, sale: OrderModel) : Promise<number> => {
    try {
      const sql = `INSERT INTO ${TABLE_NAME.order}
        (PRODUCT_ID, CUSTOMER_ID, FECHA_VENTA)
        VALUES (
          ?,
          ?,
          ?
        )`;

      const values = [
        sale.productId,
        sale.customerId,
        sale.fechaVenta,
      ];

      const [result] = await query(sql, values);
      // @ts-ignore - MySQL insert result contains insertId
      return result.insertId;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-customer', async (_event, customer: CustomerModel) : Promise<void> => {
    try {
      const sql = `UPDATE ${TABLE_NAME.customer}
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
        customer.nombre ?? null,
        customer.apellidos ?? null,
        customer.DNI ?? null,
        customer.fechaNacimiento ?? null,
        customer.telefono ?? null,
        customer.telefonoAdicional ?? null,
        customer.direccion ?? null,
        customer.ciudad ?? null,
        customer.codigoPostal ?? null,
        customer.notes ?? null,
        customer.id
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
      const sql = `UPDATE ${TABLE_NAME.examination}
        SET
          CUSTOMER_ID = ?,
          EXAMINATION_TYPE_ID = ?,
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
        examination.customerId ?? null,
        examination.examinationTypeId ?? null,
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

      const [rows] = await query(sql, values);
      // @ts-ignore - MySQL insert result contains insertId
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-product', async (_event, type: PRODUCT_STOCK_TYPE, product: ProductModel) : Promise<void> => {
    try {
      return await transaction(async (connection) => {
        const productRepository = new ProductRepository();

        // 1. Actualizamos los datos en product
        const productParams = [
          product.typeId,
          product.fechaCompra ?? null,
          product.precioCompra ?? null,
          product.precioVenta ?? null,
          product.notes ?? null,
          product.id,
        ];

        const productSql = `UPDATE ${TABLE_NAME.product}
          SET
            PRODUCT_TYPE_ID = ?,
            FECHA_COMPRA = ?,
            PRECIO_COMPRA = ?,
            PRECIO_VENTA = ?,
            NOTES = ?
          WHERE ID = ?`;

        await connection.execute(productSql, productParams);

        const specificProductParams = productRepository.getProductParamsByType(type, product.id, product);

        await connection.execute(productRepository.getProductUpdateQuery(type), specificProductParams);
      });
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-update-sale', async (_event, sale: OrderModel) : Promise<void> => {
    try {
      const sql = `UPDATE ${TABLE_NAME.order}
        SET
          PRODUCT_ID = ?,
          CUSTOMER_ID = ?,
          FECHA_VENTA = ?
        WHERE ID = ?`;

      const values = [
        sale.productId,
        sale.customerId,
        sale.fechaVenta,
        sale.id
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
      const [rows] = await query(`DELETE FROM ${TABLE_NAME.examination} WHERE ID = ${examinationId}`);
      // @ts-ignore - MySQL delete result contains affectedRows
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-delete-product', async (_event, type: PRODUCT_STOCK_TYPE, productId: number) : Promise<void> => {
    try {
      return await transaction(async (connection) => {
        const productRepository = new ProductRepository();

        const specificProductTable = productRepository.getQueryProductTableByType(type);
        const specificProductSql = `DELETE FROM ${specificProductTable} WHERE PRODUCT_ID = ?`;

        await connection.execute(specificProductSql, [ productId ]);

        const productSql = `DELETE FROM ${TABLE_NAME.product} WHERE ID = ?`;

        await connection.execute(productSql, [ productId ]);
      });
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

  ipcMain.handle('mysql-delete-sale', async (_event, saleId: number) : Promise<void> => {
    try {
      const [rows] = await query(`DELETE FROM ${TABLE_NAME.order} WHERE ID = ${saleId}`);
      // @ts-ignore - MySQL delete result contains affectedRows
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    }
  });

};
