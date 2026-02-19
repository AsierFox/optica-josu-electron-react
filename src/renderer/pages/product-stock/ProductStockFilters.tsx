import { AlertOutlined, ShopOutlined } from '@ant-design/icons';
import { Collapse, Divider, Input, Select, Space, Typography } from 'antd';
import CheckableTag from 'antd/es/tag/CheckableTag';
import React, { useEffect, useMemo, useState } from 'react';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import { PRODUCT_FIELD_NAMES } from '../../app/constants';
import { ProductStockFilterValue } from './ProductStockFilterValue';

const { Text } = Typography;

interface Props {
  allDisabled: boolean;
  products: ProductModel[];
  productTypes: ProductTypeModel[];
  onFilterChange: (
    filters: Readonly<Record<string, ProductStockFilterValue>>,
  ) => void;
}

const ProductStockFilters: React.FC<Props> = ({
  allDisabled = false,
  products,
  productTypes,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<
    Record<string, ProductStockFilterValue>
  >({
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
    modeloColorInput: {
      type: 'SINGLE',
      targetKey: 'modeloColor',
      value: '',
    },
    calibrePuenteInput: {
      type: 'SINGLE',
      targetKey: 'calibrePuente',
      value: '',
    },
    proveedorCollapse: {
      type: 'MULTIPLE',
      targetKey: 'proveedor',
      value: [],
    },
    firmaCollapse: {
      type: 'MULTIPLE',
      targetKey: 'firma',
      value: [],
    },
    typeSelect: {
      type: 'MULTIPLE',
      targetKey: 'typeId',
      value: [],
    },
  });

  const proveedoresUnicos = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.proveedor.toUpperCase())),
      ).sort(),
    [products],
  );

  const firmasUnicas = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.firma.toUpperCase()))).sort(),
    [products],
  );

  const searchFilterInputs: string[] = [
    'proveedorInput',
    'firmaInput',
    'referenciaInput',
    'modeloColorInput',
    'calibrePuenteInput',
  ];

  const searchFilterCollapses: { name: string; tags: string[] }[] = [
    {
      name: 'proveedorCollapse',
      tags: proveedoresUnicos,
    },
    {
      name: 'firmaCollapse',
      tags: firmasUnicas,
    },
  ];

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

  const handleSelectChange = (key: string, values: string | string[]) => {
    setFilters({
      ...filters,
      [key]: {
        ...filters[key],
        value: values,
      },
    });
  };

  return (
    <div
      style={{
        background: '#fff',
      }}
    >
      <Text strong style={{ fontSize: '15px', color: '#141414' }}>
        Gestión de Inventario
      </Text>

      <Divider />

      <Space size="middle">
        {searchFilterInputs.map((searchFilterInput: string) => (
          <div
            key={`input_${searchFilterInput}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            <span
              style={{
                fontWeight: 500,
                fontSize: '12px',
                marginLeft: '4px',
              }}
            >
              {PRODUCT_FIELD_NAMES[filters[searchFilterInput].targetKey]}
            </span>

            <Input
              disabled={allDisabled}
              placeholder={`Buscar ${PRODUCT_FIELD_NAMES[filters[searchFilterInput].targetKey]}...`}
              prefix={<ShopOutlined style={{ color: '#bfbfbf' }} />}
              value={filters[searchFilterInput].value}
              onChange={(e) =>
                handleInputChange(searchFilterInput, e.target.value)
              }
              style={{ width: 220, borderRadius: '8px' }}
              allowClear
            />
          </div>
        ))}
      </Space>

      <Divider />

      {searchFilterCollapses.map((searchFilterCollapse) => (
        <Collapse
          key={`collapse_${searchFilterCollapse.name}`}
          ghost
          className="collapse"
          style={{
            marginTop: 8,
          }}
          items={[
            {
              key: `collapse_children_${searchFilterCollapse.name}`,
              label: `Agrupaciones de ${PRODUCT_FIELD_NAMES[filters[searchFilterCollapse.name].targetKey]}`,
              extra:
                filters[searchFilterCollapse.name].value.length > 0 ? (
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
                  {searchFilterCollapse.tags.map((tag) => {
                    const isActive = filters[
                      searchFilterCollapse.name
                    ].value.includes(tag.toUpperCase());
                    return (
                      <CheckableTag
                        key={`tag_${tag}`}
                        className="tag"
                        checked={isActive}
                        onChange={(checked) => {
                          if (!allDisabled) {
                            handleTagChange(
                              searchFilterCollapse.name,
                              checked,
                              tag,
                            );
                          }
                        }}
                        style={{
                          pointerEvents: allDisabled ? 'none' : 'auto',
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
                          {tag}
                        </span>
                      </CheckableTag>
                    );
                  })}
                </div>
              ),
            },
          ]}
        />
      ))}

      <Divider />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span
          style={{ fontWeight: 'bold', fontSize: '12px', marginLeft: '4px' }}
        >
          Tipo de Producto
        </span>

        <Select
          disabled={allDisabled}
          mode="multiple"
          allowClear
          placeholder="Seleccionar Tipo de Producto..."
          // El valor viene de tu estado global de filtros
          value={filters.typeSelect.value}
          // Al cambiar, mandamos el array completo de strings
          onChange={(selectedValues) =>
            handleSelectChange('typeSelect', selectedValues)
          }
          // Opciones (esto podría venir de un searchFilterCollapse.tags)
          options={productTypes.map((productType: ProductTypeModel) => ({
            label: productType.type,
            value: productType.id,
          }))}
          // Para que al buscar no importe mayúsculas/minúsculas
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>

      <Divider />
    </div>
  );
};

export default React.memo(ProductStockFilters);
