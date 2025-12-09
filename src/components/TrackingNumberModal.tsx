import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Modal, message } from 'antd';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';

interface TrackingNumberModalProps {
  visible: boolean;
  onClose: () => void;
  orderNo?: string;
}

const TrackingNumberModal: React.FC<TrackingNumberModalProps> = ({
  visible,
  onClose,
  orderNo,
}) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingDate, setShippingDate] = useState<Dayjs | null>(null);

  const handleSave = () => {
    if (!trackingNumber.trim()) {
      message.warning('운송장번호를 입력해주세요');
      return;
    }
    if (!shippingDate) {
      message.warning('출고일자를 입력해주세요');
      return;
    }

    message.success('운송장번호가 등록되었습니다');
    console.log('Tracking info:', {
      trackingNumber,
      shippingDate: shippingDate.format('YYYY-MM-DD'),
      orderNo,
    });
    handleClose();
  };

  const handleClose = () => {
    setTrackingNumber('');
    setShippingDate(null);
    onClose();
  };

  const clearShippingDate = () => {
    setShippingDate(null);
  };

  return (
    <Modal
      title={
        <div
          style={{
            background: 'linear-gradient(135deg, #4db8a8 0%, #7b68c4 100%)',
            color: 'white',
            padding: '12px 20px',
            margin: '-20px -24px 20px -24px',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          ■ 운송장번호 등록
        </div>
      }
      open={visible}
      onCancel={handleClose}
      width={700}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={handleSave}
            style={{ minWidth: 100, marginRight: 8 }}
          >
            저 장
          </Button>
          <Button onClick={handleClose} style={{ minWidth: 100 }}>
            닫 기
          </Button>
        </div>
      }
      closeIcon={null}
      styles={{
        header: { padding: 0, border: 'none', marginBottom: 0 },
        body: { padding: '20px 24px' },
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td
              style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                fontWeight: 'bold',
                width: '200px',
                fontSize: 14,
                color: '#666',
              }}
            >
              운송장번호
            </td>
            <td
              style={{
                padding: '16px',
                border: '1px solid #d9d9d9',
              }}
            >
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="운송장번호"
                style={{
                  fontSize: 14,
                  border: '2px solid #ff7875',
                  borderRadius: 4,
                }}
              />
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                fontWeight: 'bold',
                fontSize: 14,
                color: '#666',
              }}
            >
              출고일자
            </td>
            <td
              style={{
                padding: '16px',
                border: '1px solid #d9d9d9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DatePicker
                  value={shippingDate}
                  onChange={(date) => setShippingDate(date)}
                  placeholder="출고일자"
                  format="YYYY-MM-DD"
                  style={{
                    fontSize: 14,
                    border: '2px solid #ff7875',
                    borderRadius: 4,
                    flex: 1,
                  }}
                />
                <Button
                  icon={<CloseCircleOutlined />}
                  onClick={clearShippingDate}
                  style={{
                    backgroundColor: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

export default TrackingNumberModal;
