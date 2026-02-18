import { Line, Pie } from '@ant-design/charts';
import { Card, Col, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';

interface Props {
  products: ProductModel[];
  productTypes: ProductTypeModel[];
}

// Usamos useMemo para que el cálculo solo se haga cuando 'products' cambie de verdad
const ProductStockStats: React.FC<Props> = ({ products, productTypes }) => {
  const productsByMonthsData = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    const groupByMonth = products.reduce((acc: any, product: ProductModel) => {
      const dateFormatted = dayjs(product.createdAt || new Date()).format(
        'YYYY-MM',
      );
      if (!acc[dateFormatted]) {
        acc[dateFormatted] = { fecha: dateFormatted, cantidad: 0 };
      }
      acc[dateFormatted].cantidad += 1;
      return acc;
    }, {});

    // Ordenamos por fecha
    return Object.values(groupByMonth).sort(
      (a: any, b: any) => dayjs(a.fecha).unix() - dayjs(b.fecha).unix(),
    );
  }, [products]);

  const productsByTypesData = useMemo(() => {
    if (!products || products.length <= 0) return [];
    if (!productTypes || productTypes.length <= 0) return [];

    const groupByTypes = productTypes.reduce(
      (acc: any, productType: ProductTypeModel) => {
        const productsWithTypeCount = products.filter(
          (product: ProductModel) => product.typeId === productType.id,
        ).length;

        if (productsWithTypeCount > 0) {
          acc[productType.id] = {
            type: productType.type,
            cantidad: productsWithTypeCount,
          };
        }

        return acc;
      },
      {},
    );

    return Object.values(groupByTypes);
  }, [products]);

  const productsByMonthsConfig = {
    data: productsByMonthsData,
    xField: 'fecha',
    yField: 'cantidad',
    height: 300,
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    color: '#1890ff',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const productByTypesConfig = {
    data: productsByTypesData,
    angleField: 'cantidad',
    colorField: 'type',
    label: {
      text: 'type',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: true,
        position: 'left',
      },
    },
  };

  return (
    <div style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        {/* Gráfica de Línea - Ocupa 14 de 24 columnas (aprox 60%) */}
        <Col xs={24} lg={14}>
          <Card
            style={{
              borderRadius: 8,
              height: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
            title={
              <span
                style={{ color: '#595959', fontSize: '18px', fontWeight: 600 }}
              >
                Evolución de Inventario
              </span>
            }
          >
            <Line {...productsByMonthsConfig} height={250} />
          </Card>
        </Col>

        {/* Gráfica de Tarta - Ocupa 10 de 24 columnas (aprox 40%) */}
        <Col xs={24} lg={10}>
          <Card
            style={{
              borderRadius: 8,
              height: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
            title={
              <span
                style={{ color: '#595959', fontSize: '18px', fontWeight: 600 }}
              >
                Distribución por Tipo de Producto
              </span>
            }
          >
            <Pie {...productByTypesConfig} height={250} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// React.memo evita que la gráfica se repinte si el padre cambia
// por algo que no sean los productos (como el estado de edición de la tabla)
export default React.memo(ProductStockStats);
