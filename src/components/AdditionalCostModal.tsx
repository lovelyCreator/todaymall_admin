import { Button, Input, Modal, message } from 'antd';
import React, { useState } from 'react';

interface AdditionalCostModalProps {
  visible: boolean;
  onClose: () => void;
  orderNo: string;
  memberName: string;
  memberId: string;
  center: string;
  shippingMethod: string;
}

const AdditionalCostModal: React.FC<AdditionalCostModalProps> = ({
  visible,
  onClose,
  orderNo,
  memberName,
  memberId,
  center,
  shippingMethod,
}) => {
  const [vvicCost, setVvicCost] = useState('0.00');
  const [purchaseCost, setPurchaseCost] = useState('0');
  const [shippingCost, setShippingCost] = useState('0');

  const handleSave = () => {
    message.success('추가비용이 저장되었습니다');
    console.log('Additional costs:', { vvicCost, purchaseCost, shippingCost });
    onClose();
  };

  const handleClose = () => {
    // Reset values
    setVvicCost('0.00');
    setPurchaseCost('0');
    setShippingCost('0');
    onClose();
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
          ■ 대행추가비용 등록
        </div>
      }
      open={visible}
      onCancel={handleClose}
      width={800}
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
      {/* 주문정보 Section */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            backgroundColor: '#e8f5f3',
            padding: '10px 16px',
            borderLeft: '4px solid #4db8a8',
            marginBottom: 12,
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          주문정보
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d9d9d9',
                  fontWeight: 'bold',
                  width: '200px',
                  fontSize: 13,
                }}
              >
                주문번호 / 회원명
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d9d9d9',
                  fontSize: 13,
                }}
              >
                {orderNo} / {memberName}( {memberId} )
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d9d9d9',
                  fontWeight: 'bold',
                  fontSize: 13,
                }}
              >
                센터
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d9d9d9',
                  fontSize: 13,
                }}
              >
                {center} / {shippingMethod}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 추가비용 Section */}
      <div>
        <div
          style={{
            backgroundColor: '#e8f5f3',
            padding: '10px 16px',
            borderLeft: '4px solid #4db8a8',
            marginBottom: 12,
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          추가비용
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d9d9d9',
                  fontWeight: 'bold',
                  width: '200px',
                  fontSize: 13,
                }}
              >
                VVIC 추가비용
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d9d9d9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 'bold' }}>¥</span>
                  <Input
                    value={vvicCost}
                    onChange={(e) => setVvicCost(e.target.value)}
                    style={{ width: 150, fontSize: 13 }}
                    placeholder="0.00"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d9d9d9',
                  fontWeight: 'bold',
                  fontSize: 13,
                }}
              >
                구매대행 추가비용
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d9d9d9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 'bold' }}>¥</span>
                  <Input
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(e.target.value)}
                    style={{ width: 150, fontSize: 13 }}
                    placeholder="0"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d9d9d9',
                  fontWeight: 'bold',
                  fontSize: 13,
                }}
              >
                배송대행 추가비용
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d9d9d9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 'bold' }}>¥</span>
                  <Input
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    style={{ width: 150, fontSize: 13 }}
                    placeholder="0"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default AdditionalCostModal;
