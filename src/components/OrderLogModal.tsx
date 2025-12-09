// src/components/OrderLogModal.tsx

import { Button, Modal } from 'antd';
import React from 'react';

interface OrderLog {
  timestamp: string;
  status: string;
  action: string;
  user: string;
  memo?: string;
}

interface OrderLogModalProps {
  visible: boolean;
  onClose: () => void;
  orderNo: string;
  logs: OrderLog[];
}

const OrderLogModal: React.FC<OrderLogModalProps> = ({
  visible,
  onClose,
  orderNo,
  logs,
}) => {
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
          ■ 주문 로그 - 주문번호 : {orderNo}
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button onClick={onClose} style={{ minWidth: 100 }}>
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
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d9d9d9',
            backgroundColor: 'white',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#5a6c7d' }}>
              <th
                style={{
                  padding: '12px',
                  border: '1px solid #d9d9d9',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: 80,
                }}
              >
                No
              </th>
              <th
                style={{
                  padding: '12px',
                  border: '1px solid #d9d9d9',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: 150,
                }}
              >
                시간
              </th>
              <th
                style={{
                  padding: '12px',
                  border: '1px solid #d9d9d9',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: 120,
                }}
              >
                상태
              </th>
              <th
                style={{
                  padding: '12px',
                  border: '1px solid #d9d9d9',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                내용
              </th>
              <th
                style={{
                  padding: '12px',
                  border: '1px solid #d9d9d9',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: 120,
                }}
              >
                처리자
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: 13,
                  }}
                >
                  로그 기록이 없습니다
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                  }}
                >
                  <td
                    style={{
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      textAlign: 'center',
                      fontSize: 12,
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      textAlign: 'center',
                      fontSize: 12,
                    }}
                  >
                    {log.timestamp}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      textAlign: 'center',
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: log.status.includes('완료')
                        ? '#52c41a'
                        : log.status.includes('취소')
                          ? '#ff4d4f'
                          : '#1890ff',
                    }}
                  >
                    {log.status}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      border: '1px solid #d9d9d9',
                      fontSize: 12,
                      lineHeight: 1.8,
                    }}
                  >
                    <div>{log.action}</div>
                    {log.memo && (
                      <div style={{ color: '#666', marginTop: 4 }}>
                        메모: {log.memo}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      textAlign: 'center',
                      fontSize: 12,
                    }}
                  >
                    {log.user}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default OrderLogModal;
