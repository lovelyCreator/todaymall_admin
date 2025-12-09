import {
  DollarOutlined,
  ExportOutlined,
  EyeOutlined,
  FallOutlined,
  LineChartOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Modal,
  message,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface PlatformFeeItem {
  id: string;
  period: string;
  year: number;
  month: number;
  totalSales: number;
  commissionRate: number;
  commissionAmount: number;
  shippingFee: number;
  additionalFee: number;
  totalFee: number;
  orderCount: number;
  sellerCount: number;
  avgOrderValue: number;
  growthRate: number;
}

const PlatformSettlement: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlatformFeeItem | null>(
    null,
  );
  const [chartData, setChartData] = useState<any[]>([]);

  const handleViewDetail = (record: PlatformFeeItem) => {
    setSelectedItem(record);
    setDetailModalVisible(true);
  };

  const handleExportExcel = () => {
    message.success('엑셀 파일 다운로드를 시작합니다');
  };

  // Generate chart data
  React.useEffect(() => {
    const data = Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}월`,
      수수료: Math.floor(Math.random() * 50000000) + 30000000,
      배송비: Math.floor(Math.random() * 10000000) + 5000000,
    }));
    setChartData(data);
  }, []);

  const columns: ProColumns<PlatformFeeItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '정산 기간',
      dataIndex: 'period',
      width: 120,
      render: (_, record) => <Tag color="blue">{record.period}</Tag>,
    },
    {
      title: '년도',
      dataIndex: 'year',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        2025: '2025년',
        2024: '2024년',
        2023: '2023년',
      },
    },
    {
      title: '월',
      dataIndex: 'month',
      hideInTable: true,
      valueType: 'select',
      valueEnum: Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [i + 1, `${i + 1}월`]),
      ),
    },
    {
      title: '총 매출',
      dataIndex: 'totalSales',
      width: 150,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <strong>{record.totalSales.toLocaleString()}원</strong>
      ),
    },
    {
      title: '수수료율',
      dataIndex: 'commissionRate',
      width: 100,
      hideInSearch: true,
      render: (_, record) => <Tag color="purple">{record.commissionRate}%</Tag>,
    },
    {
      title: '수수료 수익',
      dataIndex: 'commissionAmount',
      width: 150,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <strong style={{ color: '#52c41a' }}>
          {record.commissionAmount.toLocaleString()}원
        </strong>
      ),
    },
    {
      title: '배송비 수익',
      dataIndex: 'shippingFee',
      width: 130,
      hideInSearch: true,
      render: (_, record) => (
        <span>{record.shippingFee.toLocaleString()}원</span>
      ),
    },
    {
      title: '기타 수익',
      dataIndex: 'additionalFee',
      width: 130,
      hideInSearch: true,
      render: (_, record) => (
        <span>{record.additionalFee.toLocaleString()}원</span>
      ),
    },
    {
      title: '총 수익',
      dataIndex: 'totalFee',
      width: 150,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <strong style={{ color: '#1890ff', fontSize: 14 }}>
          {record.totalFee.toLocaleString()}원
        </strong>
      ),
    },
    {
      title: '주문/판매자',
      dataIndex: 'counts',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>{record.orderCount.toLocaleString()}건</div>
          <div style={{ color: '#888' }}>{record.sellerCount}명</div>
        </div>
      ),
    },
    {
      title: '평균 주문액',
      dataIndex: 'avgOrderValue',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <span>{record.avgOrderValue.toLocaleString()}원</span>
      ),
    },
    {
      title: '성장률',
      dataIndex: 'growthRate',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          {record.growthRate >= 0 ? (
            <RiseOutlined style={{ color: '#52c41a' }} />
          ) : (
            <FallOutlined style={{ color: '#ff4d4f' }} />
          )}
          <span
            style={{ color: record.growthRate >= 0 ? '#52c41a' : '#ff4d4f' }}
          >
            {Math.abs(record.growthRate)}%
          </span>
        </Space>
      ),
    },
    {
      title: '작업',
      width: 100,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          type="link"
          onClick={() => handleViewDetail(record)}
        >
          상세
        </Button>
      ),
    },
  ];

  const _config = {
    data: chartData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  return (
    <PageContainer title="플랫폼 수수료 정산">
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="이번 달 총 수익"
              value={456780000}
              prefix={<DollarOutlined />}
              suffix="원"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="수수료 수익"
              value={356780000}
              prefix="¥"
              suffix="원"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="배송비 수익"
              value={85000000}
              prefix="¥"
              suffix="원"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="전월 대비"
              value={12.5}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Card
        title={
          <Space>
            <LineChartOutlined />
            월별 수익 추이
          </Space>
        }
        style={{ marginBottom: 24 }}
        extra={
          <Space>
            <Select defaultValue="2025" style={{ width: 100 }}>
              <Option value="2025">2025년</Option>
              <Option value="2024">2024년</Option>
              <Option value="2023">2023년</Option>
            </Select>
          </Space>
        }
      >
        <div style={{ height: 300 }}>
          {/* Chart placeholder - in real app, use recharts or antv */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '100%',
              padding: '20px 0',
            }}
          >
            {chartData.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: '80%',
                    height: `${(item.수수료 / 50000000) * 200}px`,
                    backgroundColor: '#1890ff',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: 4,
                  }}
                />
                <div style={{ fontSize: 12, color: '#888' }}>{item.month}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <ProTable<PlatformFeeItem>
        headerTitle="월별 수수료 내역"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="export"
            icon={<ExportOutlined />}
            onClick={handleExportExcel}
          >
            엑셀 다운로드
          </Button>,
        ]}
        request={async (_params) => {
          // Mock data
          const mockData: PlatformFeeItem[] = Array.from(
            { length: 24 },
            (_, i) => {
              const year = 2025 - Math.floor(i / 12);
              const month = 12 - (i % 12);
              const totalSales =
                Math.floor(Math.random() * 500000000) + 300000000;
              const commissionRate = 10;
              const commissionAmount = Math.floor(
                totalSales * (commissionRate / 100),
              );
              const shippingFee =
                Math.floor(Math.random() * 50000000) + 20000000;
              const additionalFee = Math.floor(Math.random() * 10000000);
              const orderCount = Math.floor(Math.random() * 5000) + 2000;

              return {
                id: `PLT${String(10000 + i).padStart(6, '0')}`,
                period: `${year}-${String(month).padStart(2, '0')}`,
                year,
                month,
                totalSales,
                commissionRate,
                commissionAmount,
                shippingFee,
                additionalFee,
                totalFee: commissionAmount + shippingFee + additionalFee,
                orderCount,
                sellerCount: Math.floor(Math.random() * 200) + 100,
                avgOrderValue: Math.floor(totalSales / orderCount),
                growthRate: Math.floor(Math.random() * 30) - 10,
              };
            },
          );

          return { data: mockData, success: true, total: mockData.length };
        }}
        columns={columns}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 12,
          showSizeChanger: true,
        }}
      />

      {/* Detail Modal */}
      <Modal
        title={`수수료 상세 - ${selectedItem?.period}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            닫기
          </Button>,
          <Button key="export" type="primary" icon={<ExportOutlined />}>
            리포트 다운로드
          </Button>,
        ]}
        width={800}
      >
        {selectedItem && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="수익 요약" size="small">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="정산 기간" span={2}>
                  <Tag color="blue">{selectedItem.period}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="총 매출">
                  <strong>{selectedItem.totalSales.toLocaleString()}원</strong>
                </Descriptions.Item>
                <Descriptions.Item label="주문 건수">
                  {selectedItem.orderCount.toLocaleString()}건
                </Descriptions.Item>
                <Descriptions.Item label="판매자 수">
                  {selectedItem.sellerCount}명
                </Descriptions.Item>
                <Descriptions.Item label="평균 주문액">
                  {selectedItem.avgOrderValue.toLocaleString()}원
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="수익 상세" size="small">
              <Descriptions bordered column={1}>
                <Descriptions.Item
                  label={`플랫폼 수수료 (${selectedItem.commissionRate}%)`}
                >
                  <strong style={{ fontSize: 16, color: '#52c41a' }}>
                    {selectedItem.commissionAmount.toLocaleString()}원
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item label="배송비 수익">
                  <strong style={{ fontSize: 16, color: '#faad14' }}>
                    {selectedItem.shippingFee.toLocaleString()}원
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item label="기타 수익">
                  <strong style={{ fontSize: 16 }}>
                    {selectedItem.additionalFee.toLocaleString()}원
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item label="총 수익">
                  <strong style={{ fontSize: 20, color: '#1890ff' }}>
                    {selectedItem.totalFee.toLocaleString()}원
                  </strong>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="성장 지표" size="small">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="전월 대비 성장률">
                  <Space>
                    {selectedItem.growthRate >= 0 ? (
                      <RiseOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <FallOutlined style={{ color: '#ff4d4f' }} />
                    )}
                    <strong
                      style={{
                        color:
                          selectedItem.growthRate >= 0 ? '#52c41a' : '#ff4d4f',
                        fontSize: 16,
                      }}
                    >
                      {Math.abs(selectedItem.growthRate)}%
                    </strong>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="수익률">
                  <strong style={{ fontSize: 16 }}>
                    {(
                      (selectedItem.totalFee / selectedItem.totalSales) *
                      100
                    ).toFixed(2)}
                    %
                  </strong>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="수익 구성" size="small">
              <div style={{ padding: '20px 0' }}>
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <span>플랫폼 수수료</span>
                    <strong>
                      {(
                        (selectedItem.commissionAmount /
                          selectedItem.totalFee) *
                        100
                      ).toFixed(1)}
                      %
                    </strong>
                  </div>
                  <div
                    style={{
                      height: 20,
                      backgroundColor: '#52c41a',
                      borderRadius: 4,
                      width: `${(selectedItem.commissionAmount / selectedItem.totalFee) * 100}%`,
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <span>배송비 수익</span>
                    <strong>
                      {(
                        (selectedItem.shippingFee / selectedItem.totalFee) *
                        100
                      ).toFixed(1)}
                      %
                    </strong>
                  </div>
                  <div
                    style={{
                      height: 20,
                      backgroundColor: '#faad14',
                      borderRadius: 4,
                      width: `${(selectedItem.shippingFee / selectedItem.totalFee) * 100}%`,
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <span>기타 수익</span>
                    <strong>
                      {(
                        (selectedItem.additionalFee / selectedItem.totalFee) *
                        100
                      ).toFixed(1)}
                      %
                    </strong>
                  </div>
                  <div
                    style={{
                      height: 20,
                      backgroundColor: '#1890ff',
                      borderRadius: 4,
                      width: `${(selectedItem.additionalFee / selectedItem.totalFee) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          </Space>
        )}
      </Modal>
    </PageContainer>
  );
};

export default PlatformSettlement;
