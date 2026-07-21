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
import { PRODUCT_STOCK_TYPE, ROUTES } from './app/constants';
import { store } from './app/store';
import CustomerManagerFormPage from './pages/customer-manager/CustomerManagerFormPage';
import CustomerManagerPage from './pages/customer-manager/CustomerManagerPage';
import HomeSelector from './pages/HomeSelectorPage';
import PresupuestoGenerator from './pages/presupuesto-generator/PresupuestoGeneratorPage';
import ProductStockTablePage from './pages/product-stock/ProductStockTablePage';
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
                path={ROUTES.CUSTOMERS_MANAGER}
                element={<CustomerManagerPage />}
              />
              <Route
                path={ROUTES.CUSTOMERS_MANAGER_FORM}
                element={<CustomerManagerFormPage />}
              />
              <Route
                path={ROUTES.STOCK_MONTURAS}
                element={
                  <ProductStockTablePage type={PRODUCT_STOCK_TYPE.MONTURA} />
                }
              />
              <Route
                path={ROUTES.STOCK_LENTES_LENTILLAS}
                element={
                  <ProductStockTablePage
                    type={PRODUCT_STOCK_TYPE.LENTE_LENTILLA}
                  />
                }
              />
              <Route
                path={ROUTES.STOCK_GENERICO}
                element={
                  <ProductStockTablePage type={PRODUCT_STOCK_TYPE.GENERICO} />
                }
              />
              <Route
                path={ROUTES.PRESUPUESTO_GENERATOR}
                element={<PresupuestoGenerator />}
              />
              <Route path={ROUTES.STATISTICS} element={<StatisticsPage />} />
              <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
            </Routes>
          </Router>
        </Provider>
      </AntdApp>
    </ConfigProvider>
  );
}
