import { AlertOutlined, ShopOutlined, TagOutlined } from '@ant-design/icons';
import { Collapse, Divider, Input, Space, Typography } from 'antd';
import CheckableTag from 'antd/es/tag/CheckableTag';
import React, { useEffect, useMemo, useState } from 'react';
import ProductModel from '../../../main/models/product.model';

const { Text } = Typography;

interface FilterValue {
  // Mejor los UnionType, porque los enum generan código JavaScript extra al compilar
  type: 'SINGLE' | 'MULTIPLE';
  targetKey: string;
  value: string | string[];
}

interface Props {
  products: ProductModel[];
  onFilterChange: (filters: Record<string, FilterValue>) => void;
}

const ProductStockFilters: React.FC<Props> = ({ products, onFilterChange }) => {
  const [filters, setFilters] = useState<Record<string, FilterValue>>({
    proveedorInput: {
      type: 'SINGLE',
      targetKey: 'proveedor',
      value: '',
    },
    firmaInput: {
      type: 'SINGLE',
      targetKey: 'firma',
      value: '',
    },
    referenciaInput: {
      type: 'SINGLE',
      targetKey: 'referencia',
      value: '',
    },
    proveedorCollapse: {
      type: 'MULTIPLE',
      targetKey: 'firma',
      value: [],
    },
    firmaCollapse: {
      type: 'MULTIPLE',
      targetKey: 'firma',
      value: [],
    },
  });

  const proveedoresUnicos = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.firma.toUpperCase()))).sort(),
    [products],
  );

  const firmasUnicas = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.firma.toUpperCase()))).sort(),
    [products],
  );

  // Notificar al padre cuando cambie cualquier filtro
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleInputChange = (filterKey: string, newValue: string) => {
    setFilters((prev) => {
      const prevFilter = prev[filterKey];
      return {
        ...prev,
        [filterKey]: { ...prevFilter, value: newValue },
      };
    });
  };

  const handleTagChange = (key: string, checked: boolean, tag: string) => {
    const multipleFilter = filters[key];
    if (checked) {
      multipleFilter.value.push(tag);
    } else {
      multipleFilter.value = multipleFilter.value.filter(
        (filterValue: string) => filterValue !== tag,
      );
    }

    setFilters({
      ...filters,
      [key]: {
        ...multipleFilter,
        value: multipleFilter.value,
      },
    });
  };

  return (
    <div
      style={{
        background: '#fff',
      }}
    >
      <Text strong style={{ fontSize: '18px', color: '#141414' }}>
        Gestión de Inventario
      </Text>
      <Divider />

      <Space size="middle">
        <Input
          placeholder="Buscar Proveedor..."
          prefix={<ShopOutlined style={{ color: '#bfbfbf' }} />}
          value={filters.proveedorInput.value}
          onChange={(e) => handleInputChange('proveedorInput', e.target.value)}
          style={{ width: 220, borderRadius: '8px' }}
          allowClear
        />

        <Input
          placeholder="Buscar Firma..."
          prefix={<TagOutlined style={{ color: '#bfbfbf' }} />}
          value={filters.firmaInput.value}
          onChange={(e) => handleInputChange('firmaInput', e.target.value)}
          style={{ width: 220, borderRadius: '8px' }}
          allowClear
        />

        <Input
          placeholder="Buscar Referencia..."
          prefix={<TagOutlined style={{ color: '#bfbfbf' }} />}
          value={filters.referenciaInput.value}
          onChange={(e) => handleInputChange('referenciaInput', e.target.value)}
          style={{ width: 220, borderRadius: '8px' }}
          allowClear
        />
      </Space>

      <Divider />

      <Collapse
        ghost
        className="collapse"
        style={{
          marginTop: 8,
        }}
        items={[
          {
            key: '1',
            label: 'Agrupación de Proovedores',
            extra:
              filters.proveedorCollapse.value.length > 0 ? (
                <Text type="danger" style={{ fontWeight: 700 }}>
                  <AlertOutlined /> FILTROS ACTIVOS
                </Text>
              ) : null,
            children: (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                {proveedoresUnicos.map((firma) => {
                  const isActive = filters.proveedorCollapse.value.includes(
                    firma.toUpperCase(),
                  );
                  return (
                    <CheckableTag
                      key={firma}
                      className="tag"
                      checked={isActive}
                      onChange={(checked) =>
                        handleTagChange('proveedorCollapse', checked, firma)
                      }
                      style={{
                        fontSize: '13px',
                        padding: '5px 14px',
                        height: 'auto',
                        color: isActive ? 'white' : 'black',
                        backgroundColor: isActive ? '#2389ff' : '#f2f2f2',
                        transition: 'all 0.2s',
                        margin: 0,
                        boxShadow: isActive
                          ? '0 2px 4px rgba(24, 144, 255, 0.15)'
                          : 'none',
                      }}
                    >
                      <span style={{ fontWeight: isActive ? 600 : 400 }}>
                        {firma}
                      </span>
                    </CheckableTag>
                  );
                })}
              </div>
            ),
          },
        ]}
      />

      <Collapse
        ghost
        className="collapse"
        style={{
          marginTop: 8,
        }}
        items={[
          {
            key: '1',
            label: 'Agrupación de Firmas',
            extra:
              filters.firmaCollapse.value.length > 0 ? (
                <Text type="danger" style={{ fontWeight: 700 }}>
                  <AlertOutlined /> FILTROS ACTIVOS
                </Text>
              ) : null,
            children: (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                {firmasUnicas.map((firma) => {
                  const isActive = filters.firmaCollapse.value.includes(
                    firma.toUpperCase(),
                  );
                  return (
                    <CheckableTag
                      key={firma}
                      className="tag"
                      checked={isActive}
                      onChange={(checked) =>
                        handleTagChange('firmaCollapse', checked, firma)
                      }
                      style={{
                        fontSize: '13px',
                        padding: '5px 14px',
                        height: 'auto',
                        color: isActive ? 'white' : 'black',
                        backgroundColor: isActive ? '#2389ff' : '#f2f2f2',
                        transition: 'all 0.2s',
                        margin: 0,
                        boxShadow: isActive
                          ? '0 2px 4px rgba(24, 144, 255, 0.15)'
                          : 'none',
                      }}
                    >
                      <span style={{ fontWeight: isActive ? 600 : 400 }}>
                        {firma}
                      </span>
                    </CheckableTag>
                  );
                })}
              </div>
            ),
          },
        ]}
      />

      <Divider />
    </div>
  );
};

export default React.memo(ProductStockFilters);
