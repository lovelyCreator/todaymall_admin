import { Button, Modal } from 'antd';
import React from 'react';

interface ProductLog {
  no: number;
  manager: string;
  content: string;
  timestamp: string;
}

interface ProductLogModalProps {
  visible: boolean;
  onClose: () => void;
  productNo: string;
  logs: ProductLog[];
}

const ProductLogModal: React.FC<ProductLogModalProps> = ({
  visible,
  onClose,
  productNo,
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
          ■ 상품 로그 - 상품번호 : {productNo}
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
                  width: 120,
                }}
              >
                작업자
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
                  width: 150,
                }}
              >
                등록일
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
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
              logs.map((log) => (
                <tr
                  key={log.no}
                  style={{
                    backgroundColor: log.no % 2 === 0 ? '#fafafa' : 'white',
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
                    {log.no}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      textAlign: 'center',
                      fontSize: 12,
                    }}
                  >
                    {log.manager}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      border: '1px solid #d9d9d9',
                      fontSize: 12,
                      lineHeight: 1.8,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {log.content}
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default ProductLogModal;
