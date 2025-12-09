import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, message, Select, Space } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

interface OutputScanModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ShipmentResult {
  orderNo: string;
  recipient: string;
  boxCount: number;
  weight: string;
  trackingNo: string;
}

const OutputScanModal: React.FC<OutputScanModalProps> = ({
  visible,
  onClose,
}) => {
  const [warehouse, setWarehouse] = useState('광저우');
  const [language, setLanguage] = useState('Korean');
  const [searchValue, setSearchValue] = useState('');
  const [activeSection, setActiveSection] = useState<'payment' | 'waiting'>(
    'payment',
  );
  const [activeTab, setActiveTab] = useState('평택');
  const [shipmentResults, setShipmentResults] = useState<ShipmentResult[]>([]);
  const [totalSent, _setTotalSent] = useState(2);
  const [totalRemaining, _setTotalRemaining] = useState(22);
  const [moveTrackingNo, setMoveTrackingNo] = useState('');

  const handleSearch = () => {
    if (!searchValue.trim()) {
      message.warning('검색어를 입력하세요');
      return;
    }

    // Mock search results
    const mockResults: ShipmentResult[] = [
      {
        orderNo: 'A25B02757',
        recipient: '이은성',
        boxCount: 1,
        weight: '12.00 kg',
        trackingNo: '517638687893',
      },
      {
        orderNo: 'A25B02417',
        recipient: '김동훈',
        boxCount: 1,
        weight: '10.00 kg',
        trackingNo: '517638687661',
      },
    ];

    setShipmentResults(mockResults);
    message.success(`${mockResults.length}건의 주문을 찾았습니다`);
  };

  const handleClose = () => {
    setSearchValue('');
    setShipmentResults([]);
    setMoveTrackingNo('');
    onClose();
  };

  const handleMove = () => {
    if (!moveTrackingNo.trim()) {
      message.warning('운송장번호를 입력하세요');
      return;
    }
    message.success('이동되었습니다');
    setMoveTrackingNo('');
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
          <span style={{ flex: 1, textAlign: 'center' }}>출고스캔</span>
          <Space size="small">
            <Select
              value={warehouse}
              onChange={setWarehouse}
              style={{ width: 90 }}
              size="small"
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
        body: { padding: '24px' },
      }}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '4px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Search Input */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              placeholder="검색"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
              style={{ flex: 1, fontSize: 16 }}
            />
            <Button
              size="large"
              icon={<SearchOutlined />}
              style={{
                backgroundColor: '#595959',
                color: 'white',
                border: 'none',
                minWidth: 100,
              }}
              onClick={handleSearch}
            >
              검색 Q
            </Button>
          </div>

          {/* Payment Complete Section */}
          <div
            style={{
              border:
                activeSection === 'payment' ? 'none' : '1px solid #d9d9d9',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor:
                  activeSection === 'payment' ? '#1890ff' : '#fff',
                color: activeSection === 'payment' ? 'white' : '#000',
                padding: '12px',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                borderBottom:
                  activeSection === 'payment' ? 'none' : '1px solid #d9d9d9',
                transition: 'all 0.3s',
              }}
            >
              결제완료
            </div>
            <div
              style={{
                display: 'flex',
                backgroundColor: 'white',
              }}
            >
              {['평택', '인천', '항공'].map((tab, index) => {
                const isActive =
                  activeSection === 'payment' && activeTab === tab;
                return (
                  <div
                    key={tab}
                    onClick={() => {
                      setActiveSection('payment');
                      setActiveTab(tab);
                      message.info(`결제완료 - ${tab} 선택됨`);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? '#1890ff' : '#666',
                      backgroundColor: isActive ? '#e6f7ff' : 'white',
                      borderBottom: isActive
                        ? '2px solid #1890ff'
                        : '2px solid transparent',
                      borderRight: index < 2 ? '1px solid #f0f0f0' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {tab}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Waiting for Output Section */}
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                borderBottom: '1px solid #d9d9d9',
                backgroundColor:
                  activeSection === 'waiting' ? '#1890ff' : '#fff',
                color: activeSection === 'waiting' ? 'white' : '#000',
                transition: 'all 0.3s',
              }}
            >
              출고대기
            </div>
            <div
              style={{
                display: 'flex',
                backgroundColor: 'white',
              }}
            >
              {['항공', '인천', '평택'].map((tab, index) => {
                const isActive =
                  activeSection === 'waiting' && activeTab === tab;
                return (
                  <div
                    key={tab}
                    onClick={() => {
                      setActiveSection('waiting');
                      setActiveTab(tab);
                      message.info(`출고대기 - ${tab} 선택됨`);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? '#1890ff' : '#666',
                      backgroundColor: isActive ? '#e6f7ff' : 'white',
                      borderBottom: isActive
                        ? '2px solid #1890ff'
                        : '2px solid transparent',
                      borderRight: index < 2 ? '1px solid #f0f0f0' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {tab}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#595959' }}>
                <th
                  style={{
                    color: 'white',
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: 14,
                    fontWeight: 'bold',
                    border: '1px solid #fff',
                  }}
                >
                  총 수량
                </th>
                <th
                  style={{
                    color: 'white',
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: 14,
                    fontWeight: 'bold',
                    border: '1px solid #fff',
                  }}
                >
                  총 무게
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    border: '1px solid #d9d9d9',
                  }}
                >
                  {totalSent}
                </td>
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    border: '1px solid #d9d9d9',
                  }}
                >
                  {totalRemaining}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Move Section */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              placeholder="운송장번호"
              value={moveTrackingNo}
              onChange={(e) => setMoveTrackingNo(e.target.value)}
              onPressEnter={handleMove}
              size="large"
              style={{ flex: 1, fontSize: 16 }}
            />
            <Button
              type="primary"
              size="large"
              onClick={handleMove}
              style={{ minWidth: 80 }}
            >
              이동
            </Button>
          </div>

          {/* Shipment Results */}
          {shipmentResults.length > 0 && (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {shipmentResults.map((result, index) => (
                <Card
                  key={index}
                  style={{
                    borderRadius: 4,
                    border: '1px solid #e8e8e8',
                    backgroundColor: '#fff',
                  }}
                  styles={{ body: { padding: '16px' } }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: 14, color: '#666' }}>
                      주문번호 :{' '}
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#ff4d4f',
                      }}
                    >
                      {result.orderNo}
                    </span>
                  </div>

                  <table style={{ width: '100%', fontSize: 14 }}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            color: '#666',
                            padding: '6px 0',
                            width: '35%',
                          }}
                        >
                          수취인
                        </td>
                        <td style={{ padding: '6px 0' }}>{result.recipient}</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#666', padding: '6px 0' }}>
                          박스수 / 무게
                        </td>
                        <td style={{ padding: '6px 0' }}>
                          {result.boxCount} / {result.weight}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ color: '#666', padding: '6px 0' }}>
                          운송장번호
                        </td>
                        <td style={{ padding: '6px 0' }}>
                          {result.trackingNo}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              ))}
            </Space>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default OutputScanModal;
