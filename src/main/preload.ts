// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import ClientModel from './models/client.model';
import ExaminationModel from './models/examination.model';
import ProductModel from './models/product.model';
import ProductTypeModel from './models/productType.model';
import ExaminationTypeModel from './models/examinationType.model';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcMysql: {
    getClients: (): Promise<ClientModel[]> => ipcRenderer.invoke('mysql-get-clients'),
    getProducts: (): Promise<ProductModel[]> => ipcRenderer.invoke('mysql-get-products'),
    getProductTypes: (): Promise<ProductTypeModel[]> => ipcRenderer.invoke('mysql-get-product-types'),
    getExaminationTypes: (): Promise<ExaminationTypeModel[]> => ipcRenderer.invoke('mysql-get-examination-types'),
    getClientExaminations: (): Promise<ExaminationModel[]> => ipcRenderer.invoke('mysql-get-client-examinations'),

    getClientById: (clientId: number): Promise<ClientModel> => ipcRenderer.invoke('mysql-get-client-by-id', clientId),
    getProductByReference: (reference: string): Promise<ProductModel> => ipcRenderer.invoke('mysql-get-product-by-reference', reference),
    getClientExaminationsById: (clientId: number): Promise<ExaminationModel[]> => ipcRenderer.invoke('mysql-get-client-examinations-by-id', clientId),

    createClient: (client: ClientModel): Promise<number> => ipcRenderer.invoke('mysql-create-client', client),
    createExamination: (examination: ExaminationModel): Promise<number> => ipcRenderer.invoke('mysql-create-examination', examination),
    createProduct: (product: ProductModel): Promise<number> => ipcRenderer.invoke('mysql-create-product', product),
    createProducts: (products: ProductModel[]): Promise<number> => ipcRenderer.invoke('mysql-create-products', products),

    updateClient: (client: ClientModel): Promise<void> => ipcRenderer.invoke('mysql-update-client', client),
    updateExamination: (examination: ExaminationModel): Promise<void> => ipcRenderer.invoke('mysql-update-examination', examination),
    updateProduct: (product: ProductModel): Promise<void> => ipcRenderer.invoke('mysql-update-product', product),

    deleteExamination: (examinationId: number): Promise<void> => ipcRenderer.invoke('mysql-delete-examination', examinationId),
    deleteProduct: (productId: number): Promise<void> => ipcRenderer.invoke('mysql-delete-product', productId),
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
