import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  ExportOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  message,
  Progress,
  Row,
  Space,
  Statistic,
  Tabs,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';

interface SellerSettlementItem {
  id: string;
  sellerId: string;
  sellerName: string;
  period: string;
  totalSales: number;
  commission: number;
  shippingFee: number;
  additionalFee: number;
  deduction: number;
  settlementAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  orderCount: number;
  productCount: number;
  requestDate: string;
  completedDate?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

const SellerSettlement: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SellerSettlementItem | null>(
    null,
  );

  const handleViewDetail = (record: SellerSettlementItem) => {
    setSelectedItem(record);
    setDetailModalVisible(true);
  };

  const handleProcessSettlement = (record: SellerSettlementItem) => {
    Modal.confirm({
      title: '정산 처리',
      content: `${record.sellerName}의 정산을 처리하시겠습니까? (${record.settlementAmount.toLocaleString()}원)`,
      onOk: () => {
        message.success('정산이 처리되었습니다');
        actionRef.current?.reload();
      },
    });
  };

  const handleExportExcel = () => {
    message.success('엑셀 파일 다운로드를 시작합니다');
  };

  const columns: ProColumns<SellerSettlementItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '판매자 정보',
      dataIndex: 'sellerName',
      width: 150,
      render: (text, record) => (
        <div>
          <div>
            <strong>{text}</strong>
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.sellerId}</div>
        </div>
      ),
    },
    {
      title: '정산 기간',
      dataIndex: 'period',
      width: 150,
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startDate: value[0],
            endDate: value[1],
          };
        },
      },
    },
    {
      title: '정산 기간',
      dataIndex: 'period',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <Tag color="blue">{record.period}</Tag>,
    },
    {
      title: '총 매출',
      dataIndex: 'totalSales',
      width: 130,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <strong>{record.totalSales.toLocaleString()}원</strong>
      ),
    },
    {
      title: '수수료',
      dataIndex: 'commission',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <span style={{ color: '#ff4d4f' }}>
          -{record.commission.toLocaleString()}원
        </span>
      ),
    },
    {
      title: '배송비',
      dataIndex: 'shippingFee',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <span>{record.shippingFee.toLocaleString()}원</span>
      ),
    },
    {
      title: '정산 금액',
      dataIndex: 'settlementAmount',
      width: 150,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <strong style={{ color: '#52c41a', fontSize: 14 }}>
          {record.settlementAmount.toLocaleString()}원
        </strong>
      ),
    },
    {
      title: '주문/상품',
      dataIndex: 'counts',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>{record.orderCount}건</div>
          <div style={{ color: '#888' }}>{record.productCount}개</div>
        </div>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: 120,
      valueType: 'select',
      valueEnum: {
        pending: { text: '대기', status: 'Default' },
        processing: { text: '처리중', status: 'Processing' },
        completed: { text: '완료', status: 'Success' },
        failed: { text: '실패', status: 'Error' },
      },
      render: (_, record) => {
        const statusConfig = {
          pending: {
            color: 'default',
            icon: <ClockCircleOutlined />,
            text: '대기',
          },
          processing: {
            color: 'processing',
            icon: <ClockCircleOutlined />,
            text: '처리중',
          },
          completed: {
            color: 'success',
            icon: <CheckCircleOutlined />,
            text: '완료',
          },
          failed: {
            color: 'error',
            icon: <ClockCircleOutlined />,
            text: '실패',
          },
        };
        const config = statusConfig[record.status];
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '신청일',
      dataIndex: 'requestDate',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>{record.requestDate}</div>
      ),
    },
    {
      title: '완료일',
      dataIndex: 'completedDate',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>{record.completedDate || '-'}</div>
      ),
    },
    {
      title: '작업',
      width: 180,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            type="link"
            onClick={() => handleViewDetail(record)}
          >
            상세
          </Button>
          {record.status === 'pending' && (
            <Button
              size="small"
              type="link"
              onClick={() => handleProcessSettlement(record)}
            >
              처리
            </Button>
          )}
          <Button size="small" icon={<DownloadOutlined />} type="link">
            명세서
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="판매자 정산">
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="이번 달 총 정산액"
              value={156780000}
              prefix={<DollarOutlined />}
              suffix="원"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="대기중"
              value={23}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix="건"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="처리 완료"
              value={187}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="건"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="평균 정산액"
              value={8450000}
              prefix="¥"
              suffix="원"
            />
          </Card>
        </Col>
      </Row>

      <Alert
        message="정산 안내"
        description="매월 1일~말일까지의 매출을 익월 10일에 정산합니다. 정산 금액은 총 매출에서 수수료, 배송비, 기타 비용을 차감한 금액입니다."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <ProTable<SellerSettlementItem>
        headerTitle="판매자 정산 내역"
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
          const statuses: Array<
            'pending' | 'processing' | 'completed' | 'failed'
          > = ['pending', 'processing', 'completed', 'failed'];

          const mockData: SellerSettlementItem[] = Array.from(
            { length: 30 },
            (_, i) => {
              const totalSales = Math.floor(Math.random() * 50000000) + 5000000;
              const commission = Math.floor(totalSales * 0.1);
              const shippingFee = Math.floor(Math.random() * 500000);
              const additionalFee = Math.floor(Math.random() * 200000);
              const deduction = Math.floor(Math.random() * 100000);
              const status = statuses[i % 4];

              return {
                id: `STL${String(10000 + i).padStart(6, '0')}`,
                sellerId: `seller${1000 + (i % 20)}`,
                sellerName: `판매자${(i % 20) + 1}`,
                period: `2025-${String((i % 12) + 1).padStart(2, '0')}`,
                totalSales,
                commission,
                shippingFee,
                additionalFee,
                deduction,
                settlementAmount:
                  totalSales - commission - deduction + shippingFee,
                status,
                orderCount: Math.floor(Math.random() * 200) + 50,
                productCount: Math.floor(Math.random() * 500) + 100,
                requestDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-10`,
                completedDate:
                  status === 'completed'
                    ? `2025-${String((i % 12) + 1).padStart(2, '0')}-15`
                    : undefined,
                bankName: ['국민은행', '신한은행', '우리은행', '하나은행'][
                  i % 4
                ],
                accountNumber: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
                accountHolder: `판매자${(i % 20) + 1}`,
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
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
      />

      {/* Detail Modal */}
      <Modal
        title={`정산 상세 - ${selectedItem?.sellerName}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            닫기
          </Button>,
          <Button key="download" icon={<DownloadOutlined />}>
            명세서 다운로드
          </Button>,
          selectedItem?.status === 'pending' && (
            <Button
              key="process"
              type="primary"
              onClick={() => {
                handleProcessSettlement(selectedItem);
                setDetailModalVisible(false);
              }}
            >
              정산 처리
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedItem && (
          <Tabs
            items={[
              {
                key: 'summary',
                label: '정산 요약',
                children: (
                  <Space
                    direction="vertical"
                    style={{ width: '100%' }}
                    size="large"
                  >
                    <Descriptions bordered column={2}>
                      <Descriptions.Item label="판매자 ID">
                        {selectedItem.sellerId}
                      </Descriptions.Item>
                      <Descriptions.Item label="판매자명">
                        {selectedItem.sellerName}
                      </Descriptions.Item>
                      <Descriptions.Item label="정산 기간" span={2}>
                        <Tag color="blue">{selectedItem.period}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="주문 건수">
                        {selectedItem.orderCount}건
                      </Descriptions.Item>
                      <Descriptions.Item label="상품 수">
                        {selectedItem.productCount}개
                      </Descriptions.Item>
                    </Descriptions>

                    <Card title="정산 금액 상세" size="small">
                      <Descriptions bordered column={1}>
                        <Descriptions.Item label="총 매출">
                          <strong style={{ fontSize: 16 }}>
                            {selectedItem.totalSales.toLocaleString()}원
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="플랫폼 수수료 (10%)">
                          <span style={{ color: '#ff4d4f' }}>
                            -{selectedItem.commission.toLocaleString()}원
                          </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="배송비">
                          <span style={{ color: '#52c41a' }}>
                            +{selectedItem.shippingFee.toLocaleString()}원
                          </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="기타 차감">
                          <span style={{ color: '#ff4d4f' }}>
                            -{selectedItem.deduction.toLocaleString()}원
                          </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="최종 정산 금액">
                          <strong style={{ fontSize: 18, color: '#1890ff' }}>
                            {selectedItem.settlementAmount.toLocaleString()}원
                          </strong>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    <Progress
                      percent={Math.round(
                        (selectedItem.settlementAmount /
                          selectedItem.totalSales) *
                          100,
                      )}
                      status="active"
                      format={(percent) => `정산율 ${percent}%`}
                    />
                  </Space>
                ),
              },
              {
                key: 'account',
                label: '입금 정보',
                children: (
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="은행명">
                      {selectedItem.bankName}
                    </Descriptions.Item>
                    <Descriptions.Item label="계좌번호">
                      {selectedItem.accountNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="예금주">
                      {selectedItem.accountHolder}
                    </Descriptions.Item>
                    <Descriptions.Item label="신청일">
                      {selectedItem.requestDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="완료일">
                      {selectedItem.completedDate || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="상태">
                      <Tag
                        color={
                          {
                            pending: 'default',
                            processing: 'processing',
                            completed: 'success',
                            failed: 'error',
                          }[selectedItem.status]
                        }
                      >
                        {
                          {
                            pending: '대기',
                            processing: '처리중',
                            completed: '완료',
                            failed: '실패',
                          }[selectedItem.status]
                        }
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default SellerSettlement;
