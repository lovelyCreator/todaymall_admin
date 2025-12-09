import {
  ArrowLeftOutlined,
  MenuOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, message, Select, Space } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

interface OrderInfo {
  trackingNumber: string;
  orderNumber: string;
  customer: string;
  recipient: string;
  trackingNo: string;
}

const LabelManagement: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [orderList, setOrderList] = useState<OrderInfo[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [warehouse, setWarehouse] = useState('광저우');
  const [language, setLanguage] = useState('Korean');

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

  const handlePrintLabel = (order: OrderInfo) => {
    message.success(`${order.trackingNumber} 라벨 출력 준비 중...`);
  };

  const menuItems = [
    { key: 'logout', label: '로그아웃' },
    { key: 'warehouse-scan', label: '입고스캔/실사' },
    { key: 'rack-management', label: '랙운송관리' },
    { key: 'label-management', label: '포장관리' },
    { key: 'shipping-scan', label: '출고스캔' },
  ];

  const handleMenuClick = (key: string) => {
    setShowMenu(false);
    switch (key) {
      case 'logout':
        message.info('로그아웃');
        break;
      case 'warehouse-scan':
        message.info('입고스캔/실사 페이지로 이동');
        window.location.href = '/logistics/warehouse-scan';
        break;
      case 'rack-management':
        message.info('랙운송관리 페이지로 이동');
        window.location.href = '/logistics/rack';
        break;
      case 'label-management':
        message.info('포장관리 페이지로 이동');
        break;
      case 'shipping-scan':
        message.info('출고스캔 페이지로 이동');
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Header Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          Admin
        </div>
        <Space size="small">
          <Select
            value={warehouse}
            onChange={setWarehouse}
            style={{ width: 110 }}
            dropdownStyle={{ minWidth: 110 }}
          >
            <Option value="광저우">광저우</Option>
            <Option value="위해">위해</Option>
            <Option value="청도">청도</Option>
            <Option value="이우">이우</Option>
          </Select>
          <Select
            value={language}
            onChange={setLanguage}
            style={{ width: 110 }}
            dropdownStyle={{ minWidth: 110 }}
          >
            <Option value="Korean">Korean</Option>
            <Option value="English">English</Option>
            <Option value="Chinese">Chinese</Option>
          </Select>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 22, color: 'white' }} />}
            onClick={() => setShowMenu(!showMenu)}
            style={{ padding: '4px 8px', height: 'auto' }}
          />
        </Space>
      </div>

      {/* Menu Overlay */}
      {showMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
          onClick={() => setShowMenu(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 350,
              height: '100%',
              backgroundColor: '#2c2c2c',
              boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #444',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <Button
                type="text"
                icon={
                  <ArrowLeftOutlined style={{ fontSize: 20, color: 'white' }} />
                }
                onClick={() => setShowMenu(false)}
                style={{ padding: 0 }}
              />
              <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                Menu
              </div>
            </div>
            {menuItems.map((item) => (
              <div
                key={item.key}
                onClick={() => handleMenuClick(item.key)}
                style={{
                  padding: '20px 24px',
                  color: 'white',
                  fontSize: 16,
                  cursor: 'pointer',
                  borderBottom: '1px solid #444',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3c3c3c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '0' }}>
        {/* Back Button and Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e8e8e8',
          }}
        >
          <Button
            type="text"
            icon={<ArrowLeftOutlined style={{ fontSize: 18 }} />}
            onClick={() => window.history.back()}
            style={{ padding: 0 }}
          />
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>포장관리</div>
        </div>

        {/* Search Section */}
        <div style={{ padding: '16px', backgroundColor: 'white' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="주문번호"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
              style={{ fontSize: 16, borderRadius: '4px 0 0 4px' }}
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
                borderRadius: '0 4px 4px 0',
              }}
            >
              검색 Q
            </Button>
          </Space.Compact>
        </div>

        {/* Order List */}
        {orderList.length > 0 && (
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
                      onClick={() => handlePrintLabel(order)}
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
        )}

        {orderList.length === 0 && (
          <div style={{ padding: '16px' }}>
            <Card style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 15, color: '#999' }}>
                주문번호를 검색하여 포장 정보를 확인하세요
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelManagement;
