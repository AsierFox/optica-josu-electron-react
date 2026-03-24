import { SwapRightOutlined } from '@ant-design/icons';
import { InputNumber, Space } from 'antd';
import React from 'react';

interface PriceRangeSelectorProps {
  label: string;
  minPrice: number | null;
  maxPrice: number | null;
  onMinChange: (val: number | null) => void;
  onMaxChange: (val: number | null) => void;
}

const PriceRangeSelector: React.FC<PriceRangeSelectorProps> = ({
  label,
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}) => {
  // Formateador común para moneda con puntos de miles
  const priceFormatter = (value: any) =>
    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const priceParser = (value: any) => value!.replace(/\./g, '');

  return (
    <>
      <span style={{ fontWeight: 500, fontSize: '12px', marginLeft: '4px' }}>
        {label}
      </span>
      <Space.Compact>
        <InputNumber
          placeholder="Mínimo"
          value={minPrice}
          onChange={onMinChange}
          formatter={priceFormatter}
          parser={priceParser}
          style={{ width: 105 }}
          min={0}
          addonAfter="€"
        />
        <div
          style={{
            width: 32,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderTop: '1px solid #d9d9d9',
            borderBottom: '1px solid #d9d9d9',
          }}
        >
          <SwapRightOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
        </div>
        <InputNumber
          placeholder="Máximo"
          value={maxPrice}
          onChange={onMaxChange}
          formatter={priceFormatter}
          parser={priceParser}
          style={{ width: 105 }}
          // Bloqueo físico para que el máximo nunca sea menor al mínimo
          min={minPrice ?? 0}
          addonAfter="€"
        />
      </Space.Compact>
    </>
  );
};

export default PriceRangeSelector;
