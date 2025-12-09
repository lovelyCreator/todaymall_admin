import {
  ExportOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Tag,
} from 'antd';
import React, { useRef } from 'react';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';

interface DepositUsageItem {
  id: string;
  memberId: string;
  memberName: string;
  memberType: 'general' | 'business';
  amount: number;
  currency: 'KRW' | 'USD' | 'CNY';
  usageClassification: 'paymentCost' | 'depositTopup' | 'adminAccrual' | 'adminDeduction' | 'refund';
  content?: string;
  paymentOrderNumber?: string;
  depositPaymentOrderNumber?: string;
  balance: number;
  usageDate: string;
  description?: string;
}

const DepositUsageDetailed: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);

  const columns: ProColumns<DepositUsageItem>[] = [
    {
      title: 'No',
      dataIndex: 'id',
      width: 50,
      align: 'center',
      hideInSearch: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositUsage.memberName' }),
      dataIndex: 'memberName',
      width: 120,
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          <Tag color={record.memberType === 'business' ? 'gold' : 'blue'}>
            {record.memberType === 'business'
              ? intl.formatMessage({ id: 'pages.orders.pendingPayment.businessMemberTag' })
              : intl.formatMessage({ id: 'pages.orders.pendingPayment.regularMemberTag' })}
          </Tag>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositUsage.usageClassification' }),
      dataIndex: 'usageClassification',
      width: 180,
      valueType: 'select',
      valueEnum: {
        paymentCost: { text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationPaymentCost' }) },
        depositTopup: { text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationDepositTopup' }) },
        adminAccrual: { text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationAdminAccrual' }) },
        adminDeduction: { text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationAdminDeduction' }) },
        refund: { text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationRefund' }) },
      },
      render: (_, record) => {
        const classificationMap = {
          paymentCost: { color: 'blue', text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationPaymentCost' }) },
          depositTopup: { color: 'green', text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationDepositTopup' }) },
          adminAccrual: { color: 'cyan', text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationAdminAccrual' }) },
          adminDeduction: { color: 'orange', text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationAdminDeduction' }) },
          refund: { color: 'purple', text: intl.formatMessage({ id: 'pages.members.depositUsage.classificationRefund' }) },
        };
        const classification = classificationMap[record.usageClassification];
        return <Tag color={classification.color}>{classification.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositUsage.content' }),
      dataIndex: 'content',
      width: 200,
      hideInSearch: true,
      render: (text) => text || '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositUsage.amount' }),
      dataIndex: 'amount',
      width: 120,
      align: 'right',
      hideInSearch: true,
      render: (amount, record) => (
        <strong style={{ color: '#ff4d4f' }}>
          -{amount != null ? amount.toLocaleString() : '-'} {record.currency}
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositUsage.balance' }),
      dataIndex: 'balance',
      width: 120,
      align: 'right',
      hideInSearch: true,
      render: (balance, record) => (
        <strong>
          {balance != null ? balance.toLocaleString() : '-'} {record.currency}
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositUsage.usageDate' }),
      dataIndex: 'usageDate',
      width: 150,
      valueType: 'dateRange',
      render: (_, record) => dayjs(record.usageDate).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '-',
      width: 250,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => {
        if (record.paymentOrderNumber) {
          return (
            <div>
              {intl.formatMessage({ id: 'pages.members.depositUsage.paymentOrderNumber' })}: {record.paymentOrderNumber}
            </div>
          );
        }
        if (record.depositPaymentOrderNumber) {
          return (
            <div>
              {intl.formatMessage({ id: 'pages.members.depositUsage.depositPaymentOrderNumber' })}: {record.depositPaymentOrderNumber}
            </div>
          );
        }
        return '-';
      },
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.members.depositUsage' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.members' }) },
          { title: intl.formatMessage({ id: 'menu.members.depositUsage' }) },
        ],
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.depositUsage.totalUsage' })}
              value={892}
              prefix={<MinusOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.depositUsage.totalAmount' })}
              value={45600000}
              precision={0}
              suffix="KRW"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.depositUsage.averageAmount' })}
              value={51121}
              precision={0}
              suffix="KRW"
            />
          </Card>
        </Col>
      </Row>

      <ProTable<DepositUsageItem>
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: true,
        }}
        columns={columns}
        request={async (params) => {
          await new Promise((r) => setTimeout(r, 500));
          const mockData: DepositUsageItem[] = Array.from({ length: 20 }, (_, i) => {
            const classifications: Array<'paymentCost' | 'depositTopup' | 'adminAccrual' | 'adminDeduction' | 'refund'> = [
              'paymentCost',
              'depositTopup',
              'adminAccrual',
              'adminDeduction',
              'refund',
            ];
            const classification = classifications[Math.floor(Math.random() * classifications.length)];
            const hasPaymentOrder = i % 2 === 0;
            const hasDepositPaymentOrder = i % 3 === 0 && !hasPaymentOrder;
            
            return {
              id: `DU${String(10000 + i).padStart(5, '0')}`,
              memberId: `M${String(1000 + i).padStart(4, '0')}`,
              memberName: i % 3 === 0 ? '(주)무역상사' : `홍길동${i}`,
              memberType: i % 3 === 0 ? 'business' : 'general',
              amount: Math.floor(Math.random() * 500000) + 10000,
              currency: 'KRW',
              usageClassification: classification,
              content: i % 4 === 0 ? '주문 결제 관련 내용' : undefined,
              paymentOrderNumber: hasPaymentOrder ? `PAY${String(10000 + i).padStart(5, '0')}` : undefined,
              depositPaymentOrderNumber: hasDepositPaymentOrder ? `DEP${String(10000 + i).padStart(5, '0')}` : undefined,
              balance: Math.floor(Math.random() * 10000000) + 100000,
              usageDate: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm'),
              description: '주문 결제',
            };
          });
          return { data: mockData, success: true, total: 892 };
        }}
        toolBarRender={() => [
          <Button key="export" icon={<ExportOutlined />}>
            {intl.formatMessage({ id: 'pages.orders.user.excelDownload' })}
          </Button>,
        ]}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
};

export default DepositUsageDetailed;

