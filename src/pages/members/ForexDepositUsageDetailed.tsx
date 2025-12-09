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
  Input,
  Row,
  Space,
  Statistic,
  Tag,
  message,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';

interface ForexDepositUsageItem {
  id: string;
  memberName: string;
  mailbox?: string;
  usageClassification: 'paymentCost' | 'depositTopup' | 'adminAccrual' | 'adminDeduction' | 'refund';
  content?: string;
  paymentNumber?: string;
  order1688Number?: string;
  alipayPaymentNumber?: string;
  depositAmountCNY: number;
  remainingDepositCNY: number;
  usageDate: string;
  adminDesignatedDate?: string;
}

const ForexDepositUsageDetailed: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [inputValues, setInputValues] = useState<Record<string, { order1688?: string; alipay?: string }>>({});

  const handleRegister = (recordId: string, type: 'order1688' | 'alipay') => {
    const value = inputValues[recordId]?.[type] || '';
    if (value.trim()) {
      message.success(intl.formatMessage({ id: 'pages.members.forexDepositUsage.registered' }));
      // Here you would typically update the record with the new value
    } else {
      message.warning(intl.formatMessage({ id: 'pages.members.forexDepositUsage.pleaseEnterValue' }));
    }
  };

  const handleInputChange = (recordId: string, type: 'order1688' | 'alipay', value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [recordId]: {
        ...prev[recordId],
        [type]: value,
      },
    }));
  };

  const columns: ProColumns<ForexDepositUsageItem>[] = [
    {
      title: 'No',
      dataIndex: 'id',
      width: 50,
      align: 'center',
      hideInSearch: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositUsage.memberNameWithMailbox' }),
      dataIndex: 'memberName',
      width: 150,
      hideInSearch: true,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          {record.mailbox && (
            <div style={{ fontSize: 12, color: '#666' }}>({record.mailbox})</div>
          )}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositUsage.usageClassification' }),
      dataIndex: 'usageClassification',
      width: 120,
      valueType: 'select',
      valueEnum: {
        paymentCost: { text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationPaymentCost' }) },
        depositTopup: { text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationDepositTopup' }) },
        adminAccrual: { text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationAdminAccrual' }) },
        adminDeduction: { text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationAdminDeduction' }) },
        refund: { text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationRefund' }) },
      },
      render: (_, record) => {
        const classificationMap = {
          paymentCost: { color: 'blue', text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationPaymentCost' }) },
          depositTopup: { color: 'green', text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationDepositTopup' }) },
          adminAccrual: { color: 'cyan', text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationAdminAccrual' }) },
          adminDeduction: { color: 'orange', text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationAdminDeduction' }) },
          refund: { color: 'purple', text: intl.formatMessage({ id: 'pages.members.forexDepositUsage.classificationRefund' }) },
        };
        const classification = classificationMap[record.usageClassification];
        return <Tag color={classification.color}>{classification.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositUsage.content' }),
      dataIndex: 'content',
      width: 300,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {record.paymentNumber && (
            <div style={{ fontSize: 12 }}>
              {intl.formatMessage({ id: 'pages.members.forexDepositUsage.paymentNumber' })}: {record.paymentNumber}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, minWidth: 100 }}>
              {intl.formatMessage({ id: 'pages.members.forexDepositUsage.order1688Number' })}:
            </span>
            <Input
              size="small"
              style={{ flex: 1, fontSize: 12 }}
              value={inputValues[record.id]?.order1688 || record.order1688Number || ''}
              onChange={(e) => handleInputChange(record.id, 'order1688', e.target.value)}
              placeholder={intl.formatMessage({ id: 'pages.members.forexDepositUsage.enterOrder1688Number' })}
            />
            <Button
              size="small"
              type="primary"
              onClick={() => handleRegister(record.id, 'order1688')}
            >
              {intl.formatMessage({ id: 'pages.members.forexDepositUsage.register' })}
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, minWidth: 100 }}>
              {intl.formatMessage({ id: 'pages.members.forexDepositUsage.alipayPaymentNumber' })}:
            </span>
            <Input
              size="small"
              style={{ flex: 1, fontSize: 12 }}
              value={inputValues[record.id]?.alipay || record.alipayPaymentNumber || ''}
              onChange={(e) => handleInputChange(record.id, 'alipay', e.target.value)}
              placeholder={intl.formatMessage({ id: 'pages.members.forexDepositUsage.enterAlipayPaymentNumber' })}
            />
            <Button
              size="small"
              type="primary"
              onClick={() => handleRegister(record.id, 'alipay')}
            >
              {intl.formatMessage({ id: 'pages.members.forexDepositUsage.register' })}
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositUsage.depositAmountCNY' }),
      dataIndex: 'depositAmountCNY',
      width: 130,
      align: 'right',
      hideInSearch: true,
      render: (amount) => (
        <strong style={{ color: '#ff4d4f' }}>
          -{amount != null ? amount.toLocaleString() : 0} ¥
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositUsage.remainingDepositCNY' }),
      dataIndex: 'remainingDepositCNY',
      width: 140,
      align: 'right',
      hideInSearch: true,
      render: (amount) => (
        <strong>{amount != null ? amount.toLocaleString() : 0} ¥</strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositUsage.usageDate' }),
      dataIndex: 'usageDate',
      width: 120,
      valueType: 'dateRange',
      render: (_, record) => dayjs(record.usageDate).format('YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositUsage.adminDesignatedDate' }),
      dataIndex: 'adminDesignatedDate',
      width: 130,
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) => record.adminDesignatedDate ? dayjs(record.adminDesignatedDate).format('YYYY-MM-DD') : '-',
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.members.forexDepositUsage' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.members' }) },
          { title: intl.formatMessage({ id: 'menu.members.forexDepositUsage' }) },
        ],
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositUsage.totalUsage' })}
              value={234}
              prefix={<MinusOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositUsage.totalAmount' })}
              value={12500}
              precision={0}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositUsage.averageAmount' })}
              value={53}
              precision={0}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      <ProTable<ForexDepositUsageItem>
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
          const mockData: ForexDepositUsageItem[] = Array.from({ length: 20 }, (_, i) => {
            const classifications: Array<'paymentCost' | 'depositTopup' | 'adminAccrual' | 'adminDeduction' | 'refund'> = [
              'paymentCost',
              'depositTopup',
              'adminAccrual',
              'adminDeduction',
              'refund',
            ];
            const classification = classifications[Math.floor(Math.random() * classifications.length)];
            const depositAmountCNY = Math.floor(Math.random() * 50000) + 1000;
            const remainingDepositCNY = Math.floor(Math.random() * 100000) + 5000;
            
            return {
              id: `FDU${String(10000 + i).padStart(5, '0')}`,
              memberName: i % 3 === 0 ? '(주)무역상사' : `홍길동${i}`,
              mailbox: i % 2 === 0 ? `MB${String(1000 + i).padStart(4, '0')}` : undefined,
              usageClassification: classification,
              paymentNumber: i % 3 === 0 ? String(6000 + i) : undefined,
              order1688Number: i % 4 === 0 ? `1688${String(10000 + i).padStart(5, '0')}` : undefined,
              alipayPaymentNumber: i % 5 === 0 ? `ALI${String(10000 + i).padStart(5, '0')}` : undefined,
              depositAmountCNY,
              remainingDepositCNY,
              usageDate: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
              adminDesignatedDate: i % 3 === 0 ? dayjs().subtract(i - 1, 'day').format('YYYY-MM-DD') : undefined,
            };
          });
          return { data: mockData, success: true, total: 234 };
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

export default ForexDepositUsageDetailed;

