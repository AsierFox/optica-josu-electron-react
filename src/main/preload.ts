// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import ClientModel from './models/client.model';
import ProductModel from './models/product.model';
import ExaminationModel from './models/examination.model';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcMysql: {
    getClients: () => ipcRenderer.invoke('mysql-get-clients'),
    getProducts: () => ipcRenderer.invoke('mysql-get-products'),
    getProductTypes: () => ipcRenderer.invoke('mysql-get-product-types'),
    getExaminationTypes: () => ipcRenderer.invoke('mysql-get-examination-types'),

    getClientById: (clientId: number) => ipcRenderer.invoke('mysql-get-client-by-id', clientId),
    getExaminationsClientById: (clientId: number) => ipcRenderer.invoke('mysql-get-client-examinatios-by-id', clientId),

    createClient: (client: ClientModel) => ipcRenderer.invoke('mysql-create-client', client),
    createExamination: (examination: ExaminationModel) => ipcRenderer.invoke('mysql-create-examination', examination),
    createProduct: (product: ProductModel) => ipcRenderer.invoke('mysql-create-product', product),

    updateClient: (client: ClientModel) => ipcRenderer.invoke('mysql-update-client', client),
    updateExamination: (examination: ExaminationModel) => ipcRenderer.invoke('mysql-update-examination', examination),
    updateProduct: (product: ProductModel) => ipcRenderer.invoke('mysql-update-product', product),

    deleteProduct: (productId: number) => ipcRenderer.invoke('mysql-delete-product', productId),
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
