import {
  ExportOutlined,
  PlusOutlined,
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

interface ForexDepositApplicationItem {
  id: string;
  memberName: string;
  depositorCompanyName: string;
  applicationAmountUSD: number;
  usdDepositAmount: number;
  actualDepositAmountCNY: number;
  feeRatePercent: number;
  actualFeeCNY: number;
  actualRechargeAmountCNY: number;
  remittanceDate?: string;
  isCompleted: boolean;
  applicationDate: string;
  completionDate?: string;
  adminDesignatedDate?: string;
  smsNotSent: boolean;
  memo?: string;
}

const ForexDepositApplicationDetailed: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [allRowKeys, setAllRowKeys] = useState<React.Key[]>([]);

  const expandedRowRender = (record: ForexDepositApplicationItem) => {
    return (
      <div
        style={{
          padding: '2px 0 4px 20px',
          backgroundColor: 'transparent',
          border: 'none',
          width: '100%',
          boxSizing: 'border-box',
          alignItems: 'center',
        }}
      >
        <Space
          direction="vertical"
          size={0}
          style={{ width: '80%', boxSizing: 'border-box', margin: 0 }}
        >
          {/* 비고 (Notes/Memo) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '0 16px', boxSizing: 'border-box' }}>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                whiteSpace: 'nowrap',
                minWidth: 120,
              }}
            >
              {intl.formatMessage({ id: 'pages.members.forexDepositApplication.memo' })}:
            </span>
            <Input.TextArea
              defaultValue={record.memo || ''}
              placeholder={intl.formatMessage({ id: 'pages.members.forexDepositApplication.memoPlaceholder' })}
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{ fontSize: 12, flex: 1 }}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => message.success(intl.formatMessage({ id: 'pages.members.forexDepositApplication.memoRegistered' }))}
            >
              {intl.formatMessage({ id: 'pages.orders.user.register' })}
            </Button>
          </div>
        </Space>
      </div>
    );
  };

  const columns: ProColumns<ForexDepositApplicationItem>[] = [
    {
      title: 'No',
      dataIndex: 'id',
      width: 50,
      align: 'center',
      hideInSearch: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.memberName' }),
      dataIndex: 'memberName',
      width: 120,
      hideInSearch: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.depositorCompanyName' }),
      dataIndex: 'depositorCompanyName',
      width: 150,
      hideInSearch: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.applicationAmountUSD' }),
      dataIndex: 'applicationAmountUSD',
      width: 130,
      align: 'right',
      hideInSearch: true,
      render: (amount) =>
        <strong>
          {amount != null ? amount.toLocaleString() : '-'} $
        </strong>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.usdDepositAmount' }),
      dataIndex: 'usdDepositAmount',
      width: 130,
      align: 'right',
      hideInSearch: true,
      render: (amount) => (
        <strong>
          {amount != null ? amount.toLocaleString() : '-'} $
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.actualDepositAmountCNY' }),
      dataIndex: 'actualDepositAmountCNY',
      width: 140,
      align: 'right',
      hideInSearch: true,
      render: (amount) => (
        <strong>
          {amount != null ? amount.toLocaleString() : '-'} ¥
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.feeRatePercent' }),
      dataIndex: 'feeRatePercent',
      width: 110,
      align: 'right',
      hideInSearch: true,
      render: (rate) => <span>{rate}%</span>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.actualFeeCNY' }),
      dataIndex: 'actualFeeCNY',
      width: 130,
      align: 'right',
      hideInSearch: true,
      render: (amount) => (
        <strong>
          {amount != null ? amount.toLocaleString() : '-'} ¥
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.actualRechargeAmountCNY' }),
      dataIndex: 'actualRechargeAmountCNY',
      width: 150,
      align: 'right',
      hideInSearch: true,
      render: (amount) => (
        <strong>
          {amount != null ? amount.toLocaleString() : '-'} ¥
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.remittanceDate' }),
      dataIndex: 'remittanceDate',
      width: 120,
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) => record.remittanceDate ? dayjs(record.remittanceDate).format('YYYY-MM-DD') : '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.completionStatus' }),
      dataIndex: 'isCompleted',
      width: 100,
      valueType: 'select',
      valueEnum: {
        true: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositApplication.completed' }),
          status: 'Success',
        },
        false: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositApplication.notCompleted' }),
          status: 'Default',
        },
      },
      render: (_, record) => {
        if (record.isCompleted) {
          return (
            <Tag color="success">
              {intl.formatMessage({ id: 'pages.members.forexDepositApplication.completed' })}
            </Tag>
          );
        }
        return (
          <Tag color="default">
            {intl.formatMessage({ id: 'pages.members.forexDepositApplication.notCompleted' })}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.applicationDate' }),
      dataIndex: 'applicationDate',
      width: 120,
      valueType: 'dateRange',
      render: (_, record) => dayjs(record.applicationDate).format('YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.completionDate' }),
      dataIndex: 'completionDate',
      width: 120,
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) => record.completionDate ? dayjs(record.completionDate).format('YYYY-MM-DD') : '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.adminDesignatedDate' }),
      dataIndex: 'adminDesignatedDate',
      width: 130,
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) => record.adminDesignatedDate ? dayjs(record.adminDesignatedDate).format('YYYY-MM-DD') : '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.members.forexDepositApplication.smsNotSent' }),
      dataIndex: 'smsNotSent',
      width: 100,
      valueType: 'select',
      valueEnum: {
        true: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositApplication.smsNotSent' }),
          status: 'Default',
        },
        false: {
          text: intl.formatMessage({ id: 'pages.members.forexDepositApplication.smsSent' }),
          status: 'Success',
        },
      },
      render: (_, record) => {
        if (record.smsNotSent) {
          return (
            <Tag color="default">
              {intl.formatMessage({ id: 'pages.members.forexDepositApplication.smsNotSent' })}
            </Tag>
          );
        }
        return (
          <Tag color="success">
            {intl.formatMessage({ id: 'pages.members.forexDepositApplication.smsSent' })}
          </Tag>
        );
      },
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.members.forexDepositApplication' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.members' }) },
          { title: intl.formatMessage({ id: 'menu.members.forexDepositApplication' }) },
        ],
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositApplication.totalApplications' })}
              value={89}
              prefix={<PlusOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositApplication.pendingApplications' })}
              value={12}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositApplication.approvedApplications' })}
              value={74}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.forexDepositApplication.totalAmount' })}
              value={125000}
              precision={0}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      <ProTable<ForexDepositApplicationItem>
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
          const mockData: ForexDepositApplicationItem[] = Array.from({ length: 20 }, (_, i) => {
            const applicationAmountUSD = Math.floor(Math.random() * 10000) + 100;
            const usdDepositAmount = applicationAmountUSD * (0.95 + Math.random() * 0.1);
            const exchangeRate = 7.2; // USD to CNY
            const actualDepositAmountCNY = usdDepositAmount * exchangeRate;
            const feeRatePercent = 0.5 + Math.random() * 0.5;
            const actualFeeCNY = actualDepositAmountCNY * (feeRatePercent / 100);
            const actualRechargeAmountCNY = actualDepositAmountCNY - actualFeeCNY;
            
            return {
              id: `FDA${String(10000 + i).padStart(5, '0')}`,
              memberName: i % 3 === 0 ? '(주)무역상사' : `홍길동${i}`,
              depositorCompanyName: i % 3 === 0 ? '(주)무역상사' : `회사명${i}`,
              applicationAmountUSD,
              usdDepositAmount: Math.floor(usdDepositAmount * 100) / 100,
              actualDepositAmountCNY: Math.floor(actualDepositAmountCNY * 100) / 100,
              feeRatePercent: Math.floor(feeRatePercent * 100) / 100,
              actualFeeCNY: Math.floor(actualFeeCNY * 100) / 100,
              actualRechargeAmountCNY: Math.floor(actualRechargeAmountCNY * 100) / 100,
              remittanceDate: i % 2 === 0 ? dayjs().subtract(i, 'day').format('YYYY-MM-DD') : undefined,
              isCompleted: i % 2 === 0,
              applicationDate: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
              completionDate: i % 2 === 0 ? dayjs().subtract(i - 1, 'day').format('YYYY-MM-DD') : undefined,
              adminDesignatedDate: i % 3 === 0 ? dayjs().subtract(i - 2, 'day').format('YYYY-MM-DD') : undefined,
              smsNotSent: i % 3 === 0,
              memo: i % 5 === 0 ? '비고 내용입니다' : undefined,
            };
          });
          // Update all row keys to always expand all rows
          setAllRowKeys(mockData.map((item) => item.id));
          return { data: mockData, success: true, total: 89 };
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

export default ForexDepositApplicationDetailed;

