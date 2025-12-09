import {
  ExportOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface DepositApplicationItem {
  id: string;
  memberId: string;
  memberName: string;
  memberType: 'general' | 'business';
  applicationType: 'deposit' | 'refund';
  depositAmount?: number;
  refundAmount?: number;
  amount: number;
  currency: 'KRW' | 'USD' | 'CNY';
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  approvalDate?: string;
  expectedDepositDate?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  reason?: string;
  admin?: string;
  memo?: string;
}

const DepositApplicationDetailed: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleApprove = (record: DepositApplicationItem) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'pages.members.depositApplication.approveConfirm' }),
      content: intl.formatMessage(
        { id: 'pages.members.depositApplication.approveContent' },
        { name: record.memberName, amount: record.amount.toLocaleString() }
      ),
      onOk: () => {
        message.success(intl.formatMessage({ id: 'pages.members.depositApplication.approved' }));
        actionRef.current?.reload();
      },
    });
  };

  const handleReject = (record: DepositApplicationItem) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'pages.members.depositApplication.rejectConfirm' }),
      content: intl.formatMessage(
        { id: 'pages.members.depositApplication.rejectContent' },
        { name: record.memberName }
      ),
      onOk: () => {
        message.success(intl.formatMessage({ id: 'pages.members.depositApplication.rejected' }));
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<DepositApplicationItem>[] = [
    {
      title: 'No',
      dataIndex: 'id',
      width: 50,
      align: 'center',
      hideInSearch: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositApplication.memberName' }),
      dataIndex: 'memberName',
      width: 150,
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
      title: intl.formatMessage({ id: 'pages.members.depositApplication.applicationType' }),
      dataIndex: 'applicationType',
      width: 120,
      valueType: 'select',
      valueEnum: {
        deposit: {
          text: intl.formatMessage({ id: 'pages.members.depositApplication.typeDeposit' }),
        },
        refund: {
          text: intl.formatMessage({ id: 'pages.members.depositApplication.typeRefund' }),
        },
      },
      render: (_, record) => {
        const typeMap = {
          deposit: { color: 'blue', text: intl.formatMessage({ id: 'pages.members.depositApplication.typeDeposit' }) },
          refund: { color: 'orange', text: intl.formatMessage({ id: 'pages.members.depositApplication.typeRefund' }) },
        };
        const type = typeMap[record.applicationType];
        return <Tag color={type.color}>{type.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositApplication.amount' }),
      dataIndex: 'amount',
      width: 150,
      align: 'right',
      hideInSearch: true,
      render: (_, record) => {
        const amount = record.applicationType === 'deposit' ? record.depositAmount : record.refundAmount;
        if (amount) {
          const textColor = record.applicationType === 'refund' ? '#ff4d4f' : '#000000';
          return (
            <strong style={{ color: textColor }}>
              {amount.toLocaleString()} {record.currency}
            </strong>
          );
        }
        return '-';
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositApplication.depositor' }),
      dataIndex: 'accountHolder',
      width: 120,
      hideInSearch: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositApplication.bankInfo' }),
      dataIndex: 'bankName',
      width: 180,
      hideInSearch: true,
      render: (_, record) => (
        <div>
          <div>{record.bankName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.accountNumber}
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositApplication.status' }),
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        pending: {
          text: intl.formatMessage({ id: 'pages.members.depositApplication.statusPending' }),
          status: 'Warning',
        },
        approved: {
          text: intl.formatMessage({ id: 'pages.members.depositApplication.statusApproved' }),
          status: 'Success',
        },
        rejected: {
          text: intl.formatMessage({ id: 'pages.members.depositApplication.statusRejected' }),
          status: 'Error',
        },
      },
      render: (_, record) => {
        const statusMap = {
          pending: { color: 'warning', text: intl.formatMessage({ id: 'pages.members.depositApplication.statusPending' }) },
          approved: { color: 'success', text: intl.formatMessage({ id: 'pages.members.depositApplication.statusApproved' }) },
          rejected: { color: 'error', text: intl.formatMessage({ id: 'pages.members.depositApplication.statusRejected' }) },
        };
        const status = statusMap[record.status];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositApplication.applicationDate' }),
      dataIndex: 'applicationDate',
      width: 150,
      valueType: 'dateRange',
      hideInTable: false,
      render: (_, record) => dayjs(record.applicationDate).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositApplication.expectedDepositDate' }),
      dataIndex: 'expectedDepositDate',
      width: 150,
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) => record.expectedDepositDate ? dayjs(record.expectedDepositDate).format('YYYY-MM-DD') : '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.members.depositApplication.actions' }),
      width: 160,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <div style={{display: 'flex', gap: 8, flexDirection: 'column'}}>
          {record.status === 'pending' && (
            <>
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record)}
              >
                {intl.formatMessage({ id: 'pages.members.depositApplication.approve' })}
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record)}
              >
                {intl.formatMessage({ id: 'pages.members.depositApplication.reject' })}
              </Button>
            </>
          )}
          <Button size="small" onClick={() => {}}>
            {intl.formatMessage({ id: 'pages.members.depositApplication.viewDetails' })}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.members.depositApplication' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.members' }) },
          { title: intl.formatMessage({ id: 'menu.members.depositApplication' }) },
        ],
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.depositApplication.totalApplications' })}
              value={156}
              prefix={<PlusOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.depositApplication.pendingApplications' })}
              value={23}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.depositApplication.approvedApplications' })}
              value={128}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.depositApplication.totalAmount' })}
              value={125000000}
              precision={0}
              suffix="KRW"
            />
          </Card>
        </Col>
      </Row>

      <ProTable<DepositApplicationItem>
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
          const mockData: DepositApplicationItem[] = Array.from({ length: 20 }, (_, i) => {
            const applicationType = i % 2 === 0 ? 'deposit' : 'refund';
            const amount = Math.floor(Math.random() * 5000000) + 100000;
            return {
              id: `DA${String(10000 + i).padStart(5, '0')}`,
              memberId: `M${String(1000 + i).padStart(4, '0')}`,
              memberName: i % 3 === 0 ? '(주)무역상사' : `홍길동${i}`,
              memberType: i % 3 === 0 ? 'business' : 'general',
              applicationType: applicationType as 'deposit' | 'refund',
              depositAmount: applicationType === 'deposit' ? amount : undefined,
              refundAmount: applicationType === 'refund' ? amount : undefined,
              amount: amount,
              currency: 'KRW',
              status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as any,
              applicationDate: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm'),
              approvalDate: i % 2 === 0 ? dayjs().subtract(i - 1, 'day').format('YYYY-MM-DD HH:mm') : undefined,
              expectedDepositDate: i % 3 === 0 ? dayjs().add(i % 7, 'day').format('YYYY-MM-DD') : undefined,
              bankName: ['KB국민은행', '신한은행', '하나은행', '우리은행'][Math.floor(Math.random() * 4)],
              accountNumber: `123-456-${String(789000 + i).padStart(6, '0')}`,
              accountHolder: i % 3 === 0 ? '이대표' : `홍길동${i}`,
              reason: '예치금 충전',
              admin: i % 2 === 0 ? '관리자1' : undefined,
              memo: i % 5 === 0 ? '우수 고객' : undefined,
            };
          });
          return { data: mockData, success: true, total: 156 };
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

export default DepositApplicationDetailed;

