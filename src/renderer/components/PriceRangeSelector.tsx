import { SwapRightOutlined } from '@ant-design/icons';
import { InputNumber, Space } from 'antd';
import React from 'react';
import utils from '../utils/util';

interface PriceRangeSelectorProps {
  label: string;
  disabled?: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  onMinChange: (val: number | null) => void;
  onMaxChange: (val: number | null) => void;
}

const PriceRangeSelector: React.FC<PriceRangeSelectorProps> = ({
  label,
  disabled = false,
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}) => {
  return (
    <>
      <span style={{ fontWeight: 500, fontSize: '12px', marginLeft: '4px' }}>
        {label}
      </span>
      <Space.Compact>
        <InputNumber
          placeholder="Mínimo"
          disabled={disabled}
          value={minPrice}
          onChange={onMinChange}
          formatter={utils.priceInputFormatter}
          parser={utils.priceInputParser}
          style={{ width: 150 }}
          min={0}
          addonAfter="€"
          stringMode // Recomendado para manejar decimales con precisión
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
          disabled={disabled}
          value={maxPrice}
          onChange={onMaxChange}
          formatter={utils.priceInputFormatter}
          parser={utils.priceInputParser}
          style={{ width: 150 }}
          // Bloqueo físico para que el máximo nunca sea menor al mínimo
          min={minPrice ?? 0}
          addonAfter="€"
          stringMode // Recomendado para manejar decimales con precisión
        />
      </Space.Compact>
    </>
  );
};

export default PriceRangeSelector;
