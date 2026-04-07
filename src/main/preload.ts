// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import ProductModel from './models/product.model';
import { get } from 'http';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcMysql: {
    getClients: () => ipcRenderer.invoke('mysql-get-clients'),
    getProducts: () => ipcRenderer.invoke('mysql-get-products'),
    getProductTypes: () => ipcRenderer.invoke('mysql-get-product-types'),

    getClientById: (clientId: number) => ipcRenderer.invoke('mysql-get-client-by-id', clientId),

    createProduct: (product: ProductModel) => ipcRenderer.invoke('mysql-create-product', product),

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
