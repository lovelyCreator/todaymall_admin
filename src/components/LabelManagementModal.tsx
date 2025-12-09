import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, message, Select, Space } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

interface LabelManagementModalProps {
  visible: boolean;
  onClose: () => void;
}

interface OrderInfo {
  trackingNumber: string;
  orderNumber: string;
  customer: string;
  recipient: string;
  trackingNo: string;
}

const LabelManagementModal: React.FC<LabelManagementModalProps> = ({
  visible,
  onClose,
}) => {
  const [warehouse, setWarehouse] = useState('광저우');
  const [language, setLanguage] = useState('Korean');
  const [searchValue, setSearchValue] = useState('');
  const [orderList, setOrderList] = useState<OrderInfo[]>([]);

  const handleClose = () => {
    setSearchValue('');
    setOrderList([]);
    onClose();
  };

  const handleSearch = () => {
    if (!searchValue.trim()) {
      message.warning('주문번호를 입력하세요');
      return;
    }

    // Mock search results
    const mockResults: OrderInfo[] = [
      {
        trackingNumber: 'A25B03378',
        orderNumber: 'TJ11065',
        customer: '고객',
        recipient: '김덕화',
        trackingNo: '',
      },
      {
        trackingNumber: 'A25B03377',
        orderNumber: 'TJ12231',
        customer: '고객',
        recipient: '김혜림',
        trackingNo: '',
      },
      {
        trackingNumber: 'A25B02806',
        orderNumber: 'TJ5479',
        customer: '고객',
        recipient: '오혜미',
        trackingNo: '',
      },
      {
        trackingNumber: 'A25B02578',
        orderNumber: 'TJ10657',
        customer: '고객',
        recipient: '방정영',
        trackingNo: '',
      },
    ];

    setOrderList(mockResults);
    message.success(`${mockResults.length}건의 주문을 찾았습니다`);
  };

  const handleOrderDetail = (order: OrderInfo) => {
    message.success(`${order.trackingNumber} 상세 정보`);
  };

  return (
    <Modal
      title={
        <div
          style={{
            background: 'linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)',
            color: 'white',
            padding: '10px 16px',
            margin: '-20px -24px 20px -24px',
            fontSize: 18,
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Admin</span>
          </div>
          <span style={{ flex: 1, textAlign: 'center' }}>포장관리</span>
          <Space size="small">
            <Select
              value={warehouse}
              onChange={setWarehouse}
              style={{ width: 90 }}
              size="small"
              dropdownStyle={{ minWidth: 90 }}
            >
              <Option value="광저우">광저우</Option>
              <Option value="위해">위해</Option>
              <Option value="청도">청도</Option>
              <Option value="이우">이우</Option>
            </Select>
            <Select
              value={language}
              onChange={setLanguage}
              style={{ width: 90 }}
              size="small"
              dropdownStyle={{ minWidth: 90 }}
            >
              <Option value="Korean">Korean</Option>
              <Option value="English">English</Option>
              <Option value="Chinese">Chinese</Option>
            </Select>
          </Space>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
      closeIcon={null}
      styles={{
        header: { padding: 0, border: 'none', marginBottom: 0 },
        body: { padding: 0 },
      }}
    >
      <div
        style={{
          backgroundColor: '#f0f2f5',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        {/* Search Section */}
        <div style={{ padding: '16px', backgroundColor: 'white' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="주문번호"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
              style={{ fontSize: 16 }}
            />
            <Button
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{
                backgroundColor: '#8c8c8c',
                borderColor: '#8c8c8c',
                color: 'white',
                minWidth: 100,
              }}
            >
              검색 Q
            </Button>
          </Space.Compact>
        </div>

        {/* Order List */}
        {orderList.length > 0 ? (
          <div style={{ padding: '0 16px 16px 16px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {orderList.map((order, index) => (
                <Card
                  key={index}
                  style={{
                    borderRadius: 4,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e8e8e8',
                  }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 13, color: '#666' }}>
                        주문번호 :{' '}
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: '#ff4d4f',
                        }}
                      >
                        {order.trackingNumber}
                      </span>
                      <span
                        style={{ fontSize: 13, color: '#666', marginLeft: 4 }}
                      >
                        ({order.orderNumber})
                      </span>
                    </div>
                    <Button
                      type="primary"
                      onClick={() => handleOrderDetail(order)}
                      style={{ minWidth: 60, height: 32 }}
                    >
                      상세
                    </Button>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: 12,
                    }}
                  >
                    <Space
                      direction="vertical"
                      style={{ width: '100%' }}
                      size={8}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ color: '#666', fontSize: 14 }}>
                          고객
                        </span>
                        <span style={{ fontWeight: 400, fontSize: 14 }}>
                          {order.customer}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ color: '#666', fontSize: 14 }}>
                          수취인
                        </span>
                        <span style={{ fontWeight: 400, fontSize: 14 }}>
                          {order.recipient}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ color: '#666', fontSize: 14 }}>
                          택배번호
                        </span>
                        <span style={{ fontWeight: 400, fontSize: 14 }}>
                          {order.trackingNo || ''}
                        </span>
                      </div>
                    </Space>
                  </div>
                </Card>
              ))}
            </Space>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            <Card style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 15, color: '#999' }}>
                주문번호를 검색하여 포장 정보를 확인하세요
              </div>
            </Card>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LabelManagementModal;
