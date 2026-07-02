import { App as AntdApp, ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import { Provider } from 'react-redux';
import {
  Navigate,
  Route,
  MemoryRouter as Router,
  Routes,
} from 'react-router-dom';
import './App.css';
import { ROUTES } from './app/constants';
import { store } from './app/store';
import ClientManagerPage from './pages/client-manager/ClientManagerPage';
import ClientManagerFormPage from './pages/client-manager/ClientManagerFormPage';
import ExcelManagerPage from './pages/excel-manager/ExcelManagerPage';
import HomeSelector from './pages/HomeSelectorPage';
import PresupuestoGenerator from './pages/presupuesto-generator/PresupuestoGeneratorPage';
import ProductStockPage from './pages/product-stock/ProductStockPage';
import StatisticsPage from './pages/statistics/StatisticsPage';

require('dayjs/locale/es');

dayjs.locale('es');

// eslint-disable-next-line react/function-component-definition
export default function App() {
  return (
    <ConfigProvider locale={esES}>
      <AntdApp>
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path={ROUTES.HOME} element={<HomeSelector />} />
              <Route
                path={ROUTES.CLIENT_MANAGER}
                element={<ClientManagerPage />}
              />
              <Route
                path={ROUTES.CLIENT_MANAGER_FORM}
                element={<ClientManagerFormPage />}
              />
              <Route
                path={ROUTES.PRODUCT_STOCK}
                element={<ProductStockPage />}
              />
              <Route
                path={ROUTES.PRESUPUESTO_GENERATOR}
                element={<PresupuestoGenerator />}
              />
              <Route path={ROUTES.STATISTICS} element={<StatisticsPage />} />
              <Route
                path={ROUTES.EXCEL_MANAGER}
                element={<ExcelManagerPage />}
              />
              <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
            </Routes>
          </Router>
        </Provider>
      </AntdApp>
    </ConfigProvider>
  );
}
