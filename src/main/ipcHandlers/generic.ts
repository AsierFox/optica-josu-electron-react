import { ipcMain } from 'electron';

export const registerGenericIPCHandlers = () => {

  ipcMain.handle('fetch-address-coordinates', async (_event, city: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`,
        {
          headers: {
            // Es buena práctica poner un User-Agent para que Nominatim no bloquee la app
            'User-Agent': 'ElectronOpticalApp'
          }
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en la geocodificación nativa:', error);
      return null;
    }
  });

};
