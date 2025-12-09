import {
  ExportOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  message,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';

const { Option } = Select;

interface ForexDepositPaymentItem {
  id: string;
  memberName: string;
  mailbox?: string;
  applicationClassification: 'deposit' | 'withdrawal' | 'refund';
  siteId?: string;
  request?: string;
  applicationAmount: number;
  currency: 'USD' | 'CNY' | 'JPY';
  status: 'completed' | 'pending' | 'failed';
  applicationDate: string;
  adminDesignatedDate?: string;
  smsNotSent: boolean;
  adminMemo?: string;
}

const ForexDepositPaymentDetailed: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [allRowKeys, setAllRowKeys] = useState<React.Key[]>([]);

  const expandedRowRender = (record: ForexDepositPaymentItem) => {
    return (
      <div
        style={{
          padding: '2px 0 4px 0',
          backgroundColor: 'transparent',
          border: 'none',
          width: '100%',
          boxSizing: 'border-box',
          margin: 0,
        }}
      >
        <Space
          direction="vertical"
          size={0}
          style={{ width: '100%', boxSizing: 'border-box', margin: 0 }}
        >
          {/* 관리자 메모 (Admin Memo) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '0 16px', boxSizing: 'border-box' }}>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                whiteSpace: 'nowrap',
                minWidth: 120,
              }}
            >
              {intl.formatMessage({ id: 'pages.members.forexDepositPayment.adminMemo' })}:
            </span>
            <Input.TextArea
              defaultValue={record.adminMemo || ''}
              placeholder={intl.formatMessage({ id: 'pages.members.forexDepositPayment.adminMemoPlaceholder' })}
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{ fontSize: 12, flex: 1 }}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => message.success(intl.formatMessage({ id: 'pages.members.forexDepositPayment.adminMemoRegistered' }))}
            >
              {intl.formatMessage({ id: 'pages.orders.user.register' })}
            </Button>
          </div>
        </Space>
      </div>
    );
  };

  const columns: ProColumns<ForexDepositPaymentItem>[] = [
    {
      title: 'No',
      dataIndex: 'id',
      width: 60,
      align: 'center',
      hideInSearch: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositPayment.memberNameWithMailbox' }),
      dataIndex: 'memberName',
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
      title: intl.formatMessage({ id: 'pages.members.forexDepositPayment.applicationClassification' }),
      dataIndex: 'applicationClassification',
      valueType: 'select',
      valueEnum: {
        deposit: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.classificationDeposit' }),
        },
        withdrawal: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.classificationWithdrawal' }),
        },
        refund: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.classificationRefund' }),
        },
      },
      render: (_, record) => {
        const classificationMap = {
          deposit: { color: 'blue', text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.classificationDeposit' }) },
          withdrawal: { color: 'orange', text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.classificationWithdrawal' }) },
          refund: { color: 'purple', text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.classificationRefund' }) },
        };
        const classification = classificationMap[record.applicationClassification];
        return <Tag color={classification.color}>{classification.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositPayment.applicationInfo' }),
      dataIndex: 'applicationInfo',
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'pages.members.forexDepositPayment.siteId' })}: 
            </span>
            <span style={{ marginLeft: 4 }}>
              {record.siteId || '-'}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>
              {intl.formatMessage({ id: 'pages.members.forexDepositPayment.request' })}: 
            </span>
            <span style={{ marginLeft: 4 }}>
              {record.request || '-'}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositPayment.applicationAmount' }),
      dataIndex: 'applicationAmount',
      align: 'right',
      hideInSearch: true,
      render: (amount, record) => (
        <strong>
          {amount != null ? amount.toLocaleString() : '-'} {record.currency}
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositPayment.status' }),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        completed: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.statusCompleted' }),
          status: 'Success',
        },
        pending: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.statusPending' }),
          status: 'Warning',
        },
        failed: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.statusFailed' }),
          status: 'Error',
        },
      },
      render: (_, record) => {
        const statusMap = {
          completed: { color: 'success', text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.statusCompleted' }) },
          pending: { color: 'warning', text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.statusPending' }) },
          failed: { color: 'error', text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.statusFailed' }) },
        };
        const status = statusMap[record.status];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositPayment.applicationDate' }),
      dataIndex: 'applicationDate',
      valueType: 'dateRange',
      render: (_, record) => dayjs(record.applicationDate).format('YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositPayment.adminDesignatedDate' }),
      dataIndex: 'adminDesignatedDate',
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) => record.adminDesignatedDate ? dayjs(record.adminDesignatedDate).format('YYYY-MM-DD') : '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositPayment.smsNotSent' }),
      dataIndex: 'smsNotSent',
      valueType: 'select',
      valueEnum: {
        true: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.smsNotSent' }),
          status: 'Default',
        },
        false: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositPayment.smsSent' }),
          status: 'Success',
        },
      },
      render: (_, record) => {
        if (record.smsNotSent) {
          return (
            <Tag color="default">
              {intl.formatMessage({ id: 'pages.members.forexDepositPayment.smsNotSent' })}
            </Tag>
          );
        }
        return (
          <Tag color="success">
            {intl.formatMessage({ id: 'pages.members.forexDepositPayment.smsSent' })}
          </Tag>
        );
      },
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.members.forexDepositPayment' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.members' }) },
          { title: intl.formatMessage({ id: 'menu.members.forexDepositPayment' }) },
        ],
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositPayment.totalPayments' })}
              value={567}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositPayment.completedPayments' })}
              value={542}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositPayment.totalAmount' })}
              value={125000}
              precision={0}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositPayment.totalFee' })}
              value={1250}
              precision={0}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      <ProTable<ForexDepositPaymentItem>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: true,
        }}
        columns={columns}
        expandable={{
          expandedRowKeys: allRowKeys, // Always expand all rows
          onExpandedRowsChange: () => {}, // Prevent collapse
          expandedRowRender,
          expandIcon: () => null, // Hide expand icon
          expandRowByClick: false, // Disable click to expand/collapse
          indentSize: 0, // Remove indent space
        }}
        className="forex-deposit-table"
        request={async (params) => {
          await new Promise((r) => setTimeout(r, 500));
          const mockData: ForexDepositPaymentItem[] = Array.from({ length: 20 }, (_, i) => {
            const currency = ['USD', 'CNY', 'JPY'][Math.floor(Math.random() * 3)] as 'USD' | 'CNY' | 'JPY';
            const amount = Math.floor(Math.random() * 10000) + 100;
            const classifications: Array<'deposit' | 'withdrawal' | 'refund'> = ['deposit', 'withdrawal', 'refund'];
            const classification = classifications[Math.floor(Math.random() * classifications.length)];
            
            return {
              id: `FDP${String(10000 + i).padStart(5, '0')}`,
              memberName: i % 3 === 0 ? '(주)무역상사' : `홍길동${i}`,
              mailbox: i % 2 === 0 ? `MB${String(1000 + i).padStart(4, '0')}` : undefined,
              applicationClassification: classification,
              siteId: i % 3 === 0 ? `SITE${String(1000 + i).padStart(4, '0')}` : undefined,
              request: i % 4 === 0 ? `REQ${String(1000 + i).padStart(4, '0')}` : undefined,
              applicationAmount: amount,
              currency,
              status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 10) % 3] as any,
              applicationDate: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
              adminDesignatedDate: i % 3 === 0 ? dayjs().subtract(i - 1, 'day').format('YYYY-MM-DD') : undefined,
              smsNotSent: i % 3 === 0,
              adminMemo: i % 5 === 0 ? '관리자 메모 내용입니다' : undefined,
            };
          });
          // Update all row keys to always expand all rows
          setAllRowKeys(mockData.map((item) => item.id));
          return { data: mockData, success: true, total: 567 };
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

export default ForexDepositPaymentDetailed;

