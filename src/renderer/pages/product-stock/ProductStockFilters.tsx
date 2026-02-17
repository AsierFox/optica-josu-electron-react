import { FilterOutlined, ShopOutlined, TagOutlined } from '@ant-design/icons';
import { Divider, Input, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Text } = Typography;

interface FilterValues {
  proveedor: string;
  firma: string;
}

interface Props {
  onFilterChange: (filters: FilterValues) => void;
}

const ProductStockFilters: React.FC<Props> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>({
    proveedor: '',
    firma: '',
  });

  // Notificar al padre cuando cambie cualquier filtro
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleInputChange = (key: keyof FilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      style={{
        padding: '16px 0px',
        borderRadius: '8px 8px 0 0', // Redondeamos solo arriba para unirlo a la tabla
        border: '1px solid #f0f0f0',
        borderBottom: 'none', // Quitamos el borde inferior para que "encaje" con la tabla
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Space size="middle">
        <Text strong style={{ marginRight: 8, fontSize: '16px' }}>
          Gestión de Inventario
        </Text>
        <Divider
          type="vertical"
          style={{ height: '24px', borderColor: '#d9d9d9' }}
        />

        <Input
          placeholder="Buscar Proveedor..."
          variant="filled" // Un estilo más moderno que el outline clásico
          prefix={<ShopOutlined style={{ color: '#bfbfbf' }} />}
          value={filters.proveedor}
          onChange={(e) => handleInputChange('proveedor', e.target.value)}
          style={{ width: 220, borderRadius: '6px' }}
          allowClear
        />

        <Input
          placeholder="Buscar Firma..."
          variant="filled"
          prefix={<TagOutlined style={{ color: '#bfbfbf' }} />}
          value={filters.firma}
          onChange={(e) => handleInputChange('firma', e.target.value)}
          style={{ width: 220, borderRadius: '6px' }}
          allowClear
        />
      </Space>
    </div>
  );
};

export default React.memo(ProductStockFilters);
