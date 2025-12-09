import {
  ExportOutlined,
  GiftOutlined,
  HistoryOutlined,
  MinusOutlined,
  PlusOutlined,
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
  Statistic,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';

const { Option } = Select;
const { TextArea } = Input;

interface PointHistoryItem {
  id: string;
  memberId: string;
  memberName: string;
  type: 'earn' | 'use' | 'expire' | 'admin';
  amount: number;
  balance: number;
  reason: string;
  orderNo?: string;
  createdAt: string;
  expiryDate?: string;
  admin?: string;
}

const Points: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddPoints = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const _values = await form.validateFields();
      message.success(intl.formatMessage({ id: 'pages.members.points.paid' }));
      setModalVisible(false);
      form.resetFields();
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns: ProColumns<PointHistoryItem>[] = [
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.id' }),
      dataIndex: 'id',
      width: 100,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.memberInfo' }),
      dataIndex: 'memberName',
      width: 150,
      render: (text, record) => (
        <div>
          <div>
            <strong>{text}</strong>
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.memberId}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.memberId' }),
      dataIndex: 'memberId',
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.type' }),
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        earn: {
          text: intl.formatMessage({ id: 'pages.members.points.typeEarn' }),
          status: 'Success',
        },
        use: {
          text: intl.formatMessage({ id: 'pages.members.points.typeUse' }),
          status: 'Processing',
        },
        expire: {
          text: intl.formatMessage({ id: 'pages.members.points.typeExpire' }),
          status: 'Warning',
        },
        admin: {
          text: intl.formatMessage({ id: 'pages.members.points.typeAdmin' }),
          status: 'Default',
        },
      },
      render: (_, record) => {
        const typeConfig = {
          earn: {
            color: 'success',
            icon: <PlusOutlined />,
            text: intl.formatMessage({ id: 'pages.members.points.typeEarn' }),
          },
          use: {
            color: 'processing',
            icon: <MinusOutlined />,
            text: intl.formatMessage({ id: 'pages.members.points.typeUse' }),
          },
          expire: {
            color: 'warning',
            icon: <HistoryOutlined />,
            text: intl.formatMessage({ id: 'pages.members.points.typeExpire' }),
          },
          admin: {
            color: 'default',
            icon: <GiftOutlined />,
            text: intl.formatMessage({ id: 'pages.members.points.typeAdmin' }),
          },
        };
        const config = typeConfig[record.type];
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.points' }),
      dataIndex: 'amount',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        const isPositive = record.type === 'earn' || record.type === 'admin';
        return (
          <strong style={{ color: isPositive ? '#52c41a' : '#ff4d4f' }}>
            {isPositive ? '+' : '-'}
            {Math.abs(record.amount).toLocaleString()}
            {intl.formatMessage({ id: 'pages.members.points.unit' })}
          </strong>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.balance' }),
      dataIndex: 'balance',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <strong>
          {record.balance.toLocaleString()}
          {intl.formatMessage({ id: 'pages.members.points.unit' })}
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.reason' }),
      dataIndex: 'reason',
      width: 250,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.orderNo' }),
      dataIndex: 'orderNo',
      width: 150,
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : '-'),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.processedAt' }),
      dataIndex: 'createdAt',
      width: 150,
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.dateRange' }),
      dataIndex: 'dateRange',
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
      title: intl.formatMessage({ id: 'pages.members.points.expiryDate' }),
      dataIndex: 'expiryDate',
      width: 120,
      hideInSearch: true,
      render: (text) => text || '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.members.points.processor' }),
      dataIndex: 'admin',
      width: 100,
      hideInSearch: true,
      render: (text) => text || '-',
    },
  ];

  return (
    <PageContainer title={intl.formatMessage({ id: 'pages.members.points.title' })}>
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.points.totalEarned' })}
              value={15234500}
              prefix={<PlusOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={intl.formatMessage({ id: 'pages.members.points.unit' })}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.points.totalUsed' })}
              value={8456200}
              prefix={<MinusOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={intl.formatMessage({ id: 'pages.members.points.unit' })}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.points.currentBalance' })}
              value={6778300}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={intl.formatMessage({ id: 'pages.members.points.unit' })}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.points.expiringThisMonth' })}
              value={234500}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={intl.formatMessage({ id: 'pages.members.points.unit' })}
            />
          </Card>
        </Col>
      </Row>

      <ProTable<PointHistoryItem>
        headerTitle={intl.formatMessage({ id: 'pages.members.points.title' })}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button key="export" icon={<ExportOutlined />}>
            {intl.formatMessage({ id: 'pages.members.points.excelDownload' })}
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddPoints}
          >
            {intl.formatMessage({ id: 'pages.members.points.addPoints' })}
          </Button>,
        ]}
        request={async (_params) => {
          // Mock data
          const types: Array<'earn' | 'use' | 'expire' | 'admin'> = [
            'earn',
            'use',
            'expire',
            'admin',
          ];
          const reasons = {
            earn: ['주문 적립', '리뷰 작성', '회원가입 축하', '이벤트 참여'],
            use: ['주문 사용', '배송비 차감'],
            expire: ['유효기간 만료'],
            admin: ['관리자 지급', '보상 지급', '오류 보정'],
          };

          const mockData: PointHistoryItem[] = Array.from(
            { length: 50 },
            (_, i) => {
              const type = types[i % 4];
              const amount = Math.floor(Math.random() * 10000) + 500;
              const balance = Math.floor(Math.random() * 50000);

              return {
                id: `PT${String(10000 + i).padStart(6, '0')}`,
                memberId: `user${1000 + (i % 20)}`,
                memberName: `회원${(i % 20) + 1}`,
                type,
                amount,
                balance,
                reason:
                  reasons[type][
                    Math.floor(Math.random() * reasons[type].length)
                  ],
                orderNo:
                  type === 'earn' || type === 'use'
                    ? `TAO2025${String(1000 + i).padStart(4, '0')}`
                    : undefined,
                createdAt: new Date(
                  Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                expiryDate:
                  type === 'earn'
                    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split('T')[0]
                    : undefined,
                admin: type === 'admin' ? '관리자' : undefined,
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

      {/* Add Points Modal */}
      <Modal
        title={intl.formatMessage({ id: 'pages.members.points.modalTitle' })}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="memberId"
            label={intl.formatMessage({ id: 'pages.members.points.memberIdLabel' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.members.points.memberIdRequired' }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'pages.members.points.memberIdPlaceholder',
              })}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label={intl.formatMessage({ id: 'pages.members.points.typeLabel' })}
            rules={[{ required: true }]}
            initialValue="admin"
          >
            <Select>
              <Option value="admin">
                {intl.formatMessage({ id: 'pages.members.points.typeAdmin' })}
              </Option>
              <Option value="earn">
                {intl.formatMessage({ id: 'pages.members.points.typeEarn' })}
              </Option>
              <Option value="use">
                {intl.formatMessage({ id: 'pages.members.points.typeDeduct' })}
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label={intl.formatMessage({ id: 'pages.members.points.amountLabel' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.members.points.amountRequired' }),
              },
            ]}
          >
            <InputNumber
              placeholder={intl.formatMessage({
                id: 'pages.members.points.amountPlaceholder',
              })}
              style={{ width: '100%' }}
              min={1}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
              addonAfter={intl.formatMessage({ id: 'pages.members.points.unit' })}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label={intl.formatMessage({ id: 'pages.members.points.reasonLabel' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.members.points.reasonRequired' }),
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={intl.formatMessage({
                id: 'pages.members.points.reasonPlaceholder',
              })}
            />
          </Form.Item>

          <Form.Item
            name="expiryDate"
            label={intl.formatMessage({ id: 'pages.members.points.expiryDateLabel' })}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Points;
