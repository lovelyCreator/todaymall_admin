// src/pages/shipping/PositionInput.tsx

import { Form } from 'antd';
import React, { useState } from 'react';

interface ShippingPosition {
  key: string;
  trackingNo: string;
  orderNo: string;
  userName: string;
  memberType: '일반' | '사업자';
  position: string;
  registeredAt: string;
  registeredBy: string;
}

const PositionInput: React.FC = () => {
  const [_form] = Form.useForm();
  const [_searchForm] = Form.useForm();
  const [_positions, _setPositions] = useState<ShippingPosition[]>([]);

  return (
    <div>
      <p>Position Input Component - Under Development</p>
    </div>
  );
};

export default PositionInput;
