// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { PRODUCT_STOCK_TYPE } from '../renderer/app/constants';
import CustomerModel from './models/customer.model';
import ExaminationModel from './models/examination.model';
import ExaminationTypeModel from './models/examinationType.model';
import SaleModel from './models/order.model';
import SaleByPeriodModel from './models/orderByPeriod.model';
import ProductModel from './models/product.model';
import ProductMonturaModel from './models/productMontura.model';
import ProductTypeModel from './models/productType.model';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcGeneric: {
    fetchAddressCoordinates: (city: string): Promise<any> => ipcRenderer.invoke('fetch-address-coordinates', city),
  },
  ipcMysql: {
    // CUSTOMER
    getCustomers: (): Promise<CustomerModel[]> => ipcRenderer.invoke('mysql-get-customers'),
    getCustomerById: (customerId: number): Promise<CustomerModel | null> => ipcRenderer.invoke('mysql-get-customer-by-id', customerId),

    createCustomer: (customer: CustomerModel): Promise<number> => ipcRenderer.invoke('mysql-create-customer', customer),
    updateCustomer: (customer: CustomerModel): Promise<void> => ipcRenderer.invoke('mysql-update-customer', customer),

    // PRODUCT MONTURAS
    getAllProducts: (): Promise<ProductMonturaModel[]> => ipcRenderer.invoke('mysql-get-all-products'),
    getProductsCheckingOrders: (type: PRODUCT_STOCK_TYPE): Promise<ProductModel[]> => ipcRenderer.invoke('mysql-get-products-checking-orders-exists', type),
    getAllProductsForSale: (productId?: number): Promise<ProductMonturaModel[]> => ipcRenderer.invoke('mysql-get-all-products-for-sale', productId),
    getProductTypes: (): Promise<ProductTypeModel[]> => ipcRenderer.invoke('mysql-get-product-types'),

    createProduct: (type: PRODUCT_STOCK_TYPE, product: ProductMonturaModel): Promise<number> => ipcRenderer.invoke('mysql-create-product', type, product),
    updateProduct: (type: PRODUCT_STOCK_TYPE, product: ProductMonturaModel): Promise<void> => ipcRenderer.invoke('mysql-update-product', type, product),
    deleteProduct: (type: PRODUCT_STOCK_TYPE, productId: number): Promise<void> => ipcRenderer.invoke('mysql-delete-product', type, productId),

    // EXAMINATION
    getExaminationTypes: (): Promise<ExaminationTypeModel[]> => ipcRenderer.invoke('mysql-get-examination-types'),
    getProductByReference: (reference: string): Promise<ProductModel | null> => ipcRenderer.invoke('mysql-get-product-by-reference', reference),
    getCustomerExaminationsById: (customerId: number): Promise<ExaminationModel[]> => ipcRenderer.invoke('mysql-get-customer-examinations-by-id', customerId),

    createExamination: (examination: ExaminationModel): Promise<number> => ipcRenderer.invoke('mysql-create-examination', examination),
    updateExamination: (examination: ExaminationModel): Promise<void> => ipcRenderer.invoke('mysql-update-examination', examination),
    deleteExamination: (examinationId: number): Promise<void> => ipcRenderer.invoke('mysql-delete-examination', examinationId),

    // ORDER
    getCustomerPurchasesById: (customerId: number): Promise<SaleModel[]> => ipcRenderer.invoke('mysql-get-purchases-by-customer-id', customerId),
    getSalesByProductId: (productId: number): Promise<SaleModel[]> => ipcRenderer.invoke('mysql-get-sales-by-product-id', productId),
    getSalesByYearAndMonth: (): Promise<SaleByPeriodModel[]> => ipcRenderer.invoke('mysql-get-sales-by-year-month'),

    createSale: (sale: SaleModel): Promise<number> => ipcRenderer.invoke('mysql-create-sale', sale),
    updateSale: (sale: SaleModel): Promise<void> => ipcRenderer.invoke('mysql-update-sale', sale),
    deleteSale: (saleId: number): Promise<void> => ipcRenderer.invoke('mysql-delete-sale', saleId),
  },
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
