import {
  ExportOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Col,
  Row,
  Statistic,
  Tag,
} from 'antd';
import React, { useRef } from 'react';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';

interface BankbookVerificationItem {
  id: string;
  depositDate: string;
  accountNumber: string;
  depositor: string;
  amount: number;
  currency: 'KRW' | 'USD' | 'CNY';
  isCompleted: boolean;
  status: 'verified' | 'pending' | 'failed';
  processingDate?: string;
  additionalInfo?: string;
}

const BankbookVerificationDetailed: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);

  const columns: ProColumns<BankbookVerificationItem>[] = [
    {
      title: 'No',
      dataIndex: 'id',
      width: 50,
      align: 'center',
      hideInSearch: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.bankbookVerification.depositDate' }),
      dataIndex: 'depositDate',
      width: 150,
      valueType: 'dateRange',
      render: (_, record) => dayjs(record.depositDate).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.bankbookVerification.accountNumber' }),
      dataIndex: 'accountNumber',
      width: 180,
      hideInSearch: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.bankbookVerification.depositor' }),
      dataIndex: 'depositor',
      width: 120,
      hideInSearch: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.bankbookVerification.amount' }),
      dataIndex: 'amount',
      width: 130,
      align: 'right',
      hideInSearch: true,
      render: (amount, record) => (
        <strong>
          {amount != null ? amount.toLocaleString() : '-'} {record.currency}
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.bankbookVerification.completionStatus' }),
      dataIndex: 'isCompleted',
      width: 100,
      valueType: 'select',
      valueEnum: {
        true: {
          text: intl.formatMessage({ id: 'pages.members.bankbookVerification.completed' }),
          status: 'Success',
        },
        false: {
          text: intl.formatMessage({ id: 'pages.members.bankbookVerification.notCompleted' }),
          status: 'Default',
        },
      },
      render: (_, record) => {
        if (record.isCompleted) {
          return (
            <Tag color="success">
              {intl.formatMessage({ id: 'pages.members.bankbookVerification.completed' })}
            </Tag>
          );
        }
        return (
          <Tag color="default">
            {intl.formatMessage({ id: 'pages.members.bankbookVerification.notCompleted' })}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.bankbookVerification.status' }),
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        verified: {
          text: intl.formatMessage({ id: 'pages.members.bankbookVerification.statusVerified' }),
          status: 'Success',
        },
        pending: {
          text: intl.formatMessage({ id: 'pages.members.bankbookVerification.statusPending' }),
          status: 'Warning',
        },
        failed: {
          text: intl.formatMessage({ id: 'pages.members.bankbookVerification.statusFailed' }),
          status: 'Error',
        },
      },
      render: (_, record) => {
        const statusMap = {
          verified: { color: 'success', text: intl.formatMessage({ id: 'pages.members.bankbookVerification.statusVerified' }) },
          pending: { color: 'warning', text: intl.formatMessage({ id: 'pages.members.bankbookVerification.statusPending' }) },
          failed: { color: 'error', text: intl.formatMessage({ id: 'pages.members.bankbookVerification.statusFailed' }) },
        };
        const status = statusMap[record.status];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.bankbookVerification.processingDate' }),
      dataIndex: 'processingDate',
      width: 150,
      valueType: 'dateRange',
      hideInSearch: true,
      render: (_, record) => record.processingDate ? dayjs(record.processingDate).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '-',
      width: 200,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => record.additionalInfo || '-',
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.members.bankbookVerification' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.members' }) },
          { title: intl.formatMessage({ id: 'menu.members.bankbookVerification' }) },
        ],
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.bankbookVerification.totalAccounts' })}
              value={342}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.bankbookVerification.autoVerified' })}
              value={298}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.bankbookVerification.verified' })}
              value={312}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <ProTable<BankbookVerificationItem>
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
          const mockData: BankbookVerificationItem[] = Array.from({ length: 20 }, (_, i) => ({
            id: `BV${String(10000 + i).padStart(5, '0')}`,
            depositDate: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm'),
            accountNumber: `123-456-${String(789000 + i).padStart(6, '0')}`,
            depositor: i % 3 === 0 ? '이대표' : `홍길동${i}`,
            amount: Math.floor(Math.random() * 5000000) + 100000,
            currency: 'KRW',
            isCompleted: i % 2 === 0,
            status: ['verified', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
            processingDate: i % 2 === 0 ? dayjs().subtract(i - 1, 'day').format('YYYY-MM-DD HH:mm') : undefined,
            additionalInfo: i % 5 === 0 ? '추가 정보' : undefined,
          }));
          return { data: mockData, success: true, total: 342 };
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

export default BankbookVerificationDetailed;

