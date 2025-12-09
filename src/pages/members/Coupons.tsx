import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  GiftOutlined,
  PlusOutlined,
  SendOutlined,
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
  Switch,
  Tabs,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface CouponItem {
  id: string;
  name: string;
  code: string;
  type: 'fixed' | 'percent';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  totalCount: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
  description: string;
  createdAt: string;
}

interface CouponUsageItem {
  id: string;
  couponName: string;
  couponCode: string;
  memberId: string;
  memberName: string;
  orderNo: string;
  discountAmount: number;
  usedAt: string;
  status: 'used' | 'unused' | 'expired';
}

const Coupons: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const usageActionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [issueModalVisible, setIssueModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CouponItem | null>(null);
  const [form] = Form.useForm();
  const [issueForm] = Form.useForm();

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: CouponItem) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      validPeriod: [dayjs(record.validFrom), dayjs(record.validTo)],
    });
    setModalVisible(true);
  };

  const handleDelete = (record: CouponItem) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'pages.members.coupons.deleteConfirm' }),
      content: intl.formatMessage(
        { id: 'pages.members.coupons.deleteContent' },
        { name: record.name }
      ),
      onOk: () => {
        message.success(intl.formatMessage({ id: 'pages.members.coupons.deleted' }));
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const _values = await form.validateFields();
      if (editingItem) {
        message.success(intl.formatMessage({ id: 'pages.members.coupons.updated' }));
      } else {
        message.success(intl.formatMessage({ id: 'pages.members.coupons.created' }));
      }
      setModalVisible(false);
      form.resetFields();
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleIssueCoupon = async () => {
    try {
      const _values = await issueForm.validateFields();
      message.success(intl.formatMessage({ id: 'pages.members.coupons.issued' }));
      setIssueModalVisible(false);
      issueForm.resetFields();
      usageActionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const couponColumns: ProColumns<CouponItem>[] = [
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.id' }),
      dataIndex: 'id',
      width: 100,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.couponName' }),
      dataIndex: 'name',
      width: 200,
      render: (_, record) => (
        <strong style={{ color: '#1890ff' }}>{record.name}</strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.couponCode' }),
      dataIndex: 'code',
      width: 150,
      render: (_, record) => <Tag color="purple">{record.code}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.discountType' }),
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        fixed: {
          text: intl.formatMessage({ id: 'pages.members.coupons.discountTypeFixed' }),
          status: 'Success',
        },
        percent: {
          text: intl.formatMessage({ id: 'pages.members.coupons.discountTypePercent' }),
          status: 'Processing',
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.discountAmount' }),
      dataIndex: 'discountValue',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <strong style={{ color: '#52c41a' }}>
          {record.type === 'fixed'
            ? `${record.discountValue.toLocaleString()}${intl.formatMessage({ id: 'pages.members.coupons.currency' })}`
            : `${record.discountValue}%`}
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.minOrderAmount' }),
      dataIndex: 'minOrderAmount',
      width: 120,
      hideInSearch: true,
      render: (_, record) =>
        `${record.minOrderAmount.toLocaleString()}${intl.formatMessage({ id: 'pages.members.coupons.currency' })}`,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.usageStatus' }),
      dataIndex: 'usage',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div>
          <div>
            <strong>{record.usedCount}</strong> / {record.totalCount}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>
            {Math.round((record.usedCount / record.totalCount) * 100)}
            {intl.formatMessage({ id: 'pages.members.coupons.usagePercent' })}
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.validPeriod' }),
      dataIndex: 'validPeriod',
      width: 200,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>{record.validFrom}</div>
          <div style={{ color: '#888' }}>~ {record.validTo}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.status' }),
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: {
          text: intl.formatMessage({ id: 'pages.members.coupons.statusActive' }),
          status: 'Success',
        },
        inactive: {
          text: intl.formatMessage({ id: 'pages.members.coupons.statusInactive' }),
          status: 'Default',
        },
        expired: {
          text: intl.formatMessage({ id: 'pages.members.coupons.statusExpired' }),
          status: 'Warning',
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.createdAt' }),
      dataIndex: 'createdAt',
      width: 120,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.actions' }),
      width: 180,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<SendOutlined />}
            type="link"
            onClick={() => {
              setEditingItem(record);
              setIssueModalVisible(true);
            }}
          >
            {intl.formatMessage({ id: 'pages.members.coupons.issue' })}
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          >
            {intl.formatMessage({ id: 'pages.members.coupons.edit' })}
          </Button>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDelete(record)}
          >
            {intl.formatMessage({ id: 'pages.members.coupons.delete' })}
          </Button>
        </Space>
      ),
    },
  ];

  const usageColumns: ProColumns<CouponUsageItem>[] = [
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.id' }),
      dataIndex: 'id',
      width: 100,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.couponName' }),
      dataIndex: 'couponName',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.couponCode' }),
      dataIndex: 'couponCode',
      width: 150,
      render: (_, record) => <Tag color="purple">{record.couponCode}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.memberInfo' }),
      dataIndex: 'memberName',
      width: 150,
      render: (_, record) => (
        <div>
          <div>
            <strong>{record.memberName}</strong>
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.memberId}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.orderNo' }),
      dataIndex: 'orderNo',
      width: 150,
      render: (_, record) => <Tag color="blue">{record.orderNo}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.discountAmount' }),
      dataIndex: 'discountAmount',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <strong style={{ color: '#52c41a' }}>
          {record.discountAmount.toLocaleString()}
          {intl.formatMessage({ id: 'pages.members.coupons.currency' })}
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.usedAt' }),
      dataIndex: 'usedAt',
      width: 150,
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.coupons.status' }),
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        used: {
          text: intl.formatMessage({ id: 'pages.members.coupons.statusUsed' }),
          status: 'Success',
        },
        unused: {
          text: intl.formatMessage({ id: 'pages.members.coupons.statusUnused' }),
          status: 'Processing',
        },
        expired: {
          text: intl.formatMessage({ id: 'pages.members.coupons.statusExpired' }),
          status: 'Warning',
        },
      },
      render: (_, record) => {
        const statusConfig = {
          used: {
            color: 'success',
            icon: <CheckCircleOutlined />,
            text: intl.formatMessage({ id: 'pages.members.coupons.statusUsed' }),
          },
          unused: {
            color: 'processing',
            icon: <GiftOutlined />,
            text: intl.formatMessage({ id: 'pages.members.coupons.statusUnused' }),
          },
          expired: {
            color: 'warning',
            icon: <CloseCircleOutlined />,
            text: intl.formatMessage({ id: 'pages.members.coupons.statusExpired' }),
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
  ];

  return (
    <PageContainer title={intl.formatMessage({ id: 'pages.members.coupons.title' })}>
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.coupons.totalCoupons' })}
              value={45}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.coupons.activeCoupons' })}
              value={32}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.coupons.issuedCoupons' })}
              value={15234}
              valueStyle={{ color: '#1890ff' }}
              prefix={<SendOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.coupons.usedCoupons' })}
              value={8456}
              valueStyle={{ color: '#faad14' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        items={[
          {
            key: 'coupons',
            label: intl.formatMessage({ id: 'pages.members.coupons.couponList' }),
            children: (
              <ProTable<CouponItem>
                headerTitle={intl.formatMessage({ id: 'pages.members.coupons.couponList' })}
                actionRef={actionRef}
                rowKey="id"
                toolBarRender={() => [
                  <Button key="export" icon={<ExportOutlined />}>
                    {intl.formatMessage({ id: 'pages.members.coupons.excelDownload' })}
                  </Button>,
                  <Button
                    key="add"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                  >
                    {intl.formatMessage({ id: 'pages.members.coupons.createCoupon' })}
                  </Button>,
                ]}
                request={async (_params) => {
                  // Mock data
                  const mockData: CouponItem[] = Array.from(
                    { length: 20 },
                    (_, i) => ({
                      id: `CPN${String(1000 + i).padStart(6, '0')}`,
                      name: [
                        '신규회원 환영 쿠폰',
                        '첫 구매 할인',
                        'VIP 전용 쿠폰',
                        '배송비 무료',
                        '시즌 특가',
                      ][i % 5],
                      code: `COUPON${String(1000 + i).toUpperCase()}`,
                      type: i % 2 === 0 ? 'fixed' : 'percent',
                      discountValue: i % 2 === 0 ? 5000 : 10,
                      minOrderAmount: [0, 30000, 50000, 100000][i % 4],
                      maxDiscountAmount: i % 2 === 1 ? 20000 : undefined,
                      validFrom: '2025-11-01',
                      validTo: '2025-12-31',
                      totalCount: Math.floor(Math.random() * 1000) + 100,
                      usedCount: Math.floor(Math.random() * 500),
                      status: ['active', 'inactive', 'expired'][i % 3] as any,
                      description: '쿠폰 설명입니다',
                      createdAt: '2025-11-01',
                    }),
                  );

                  return {
                    data: mockData,
                    success: true,
                    total: mockData.length,
                  };
                }}
                columns={couponColumns}
                search={{
                  labelWidth: 'auto',
                }}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                }}
              />
            ),
          },
          {
            key: 'usage',
            label: intl.formatMessage({ id: 'pages.members.coupons.usageHistory' }),
            children: (
              <ProTable<CouponUsageItem>
                headerTitle={intl.formatMessage({ id: 'pages.members.coupons.usageHistory' })}
                actionRef={usageActionRef}
                rowKey="id"
                toolBarRender={() => [
                  <Button key="export" icon={<ExportOutlined />}>
                    {intl.formatMessage({ id: 'pages.members.coupons.excelDownload' })}
                  </Button>,
                ]}
                request={async (_params) => {
                  // Mock data
                  const mockData: CouponUsageItem[] = Array.from(
                    { length: 50 },
                    (_, i) => ({
                      id: `USE${String(10000 + i).padStart(6, '0')}`,
                      couponName: [
                        '신규회원 환영 쿠폰',
                        '첫 구매 할인',
                        'VIP 전용 쿠폰',
                      ][i % 3],
                      couponCode: `COUPON${String(1000 + (i % 20)).toUpperCase()}`,
                      memberId: `user${1000 + (i % 30)}`,
                      memberName: `회원${(i % 30) + 1}`,
                      orderNo: `TAO2025${String(1000 + i).padStart(4, '0')}`,
                      discountAmount: Math.floor(Math.random() * 20000) + 1000,
                      usedAt: new Date(
                        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
                      ).toISOString(),
                      status: ['used', 'unused', 'expired'][i % 3] as any,
                    }),
                  );

                  return {
                    data: mockData,
                    success: true,
                    total: mockData.length,
                  };
                }}
                columns={usageColumns}
                search={{
                  labelWidth: 'auto',
                }}
                pagination={{
                  defaultPageSize: 20,
                  showSizeChanger: true,
                }}
              />
            ),
          },
        ]}
      />

      {/* Create/Edit Coupon Modal */}
      <Modal
        title={
          editingItem
            ? intl.formatMessage({ id: 'pages.members.coupons.modalEdit' })
            : intl.formatMessage({ id: 'pages.members.coupons.modalCreate' })
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'pages.members.coupons.nameLabel' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.members.coupons.nameRequired' }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: 'pages.members.coupons.namePlaceholder' })}
            />
          </Form.Item>

          <Form.Item
            name="code"
            label={intl.formatMessage({ id: 'pages.members.coupons.codeLabel' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.members.coupons.codeRequired' }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: 'pages.members.coupons.codePlaceholder' })}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={intl.formatMessage({ id: 'pages.members.coupons.typeLabel' })}
                rules={[{ required: true }]}
                initialValue="fixed"
              >
                <Select>
                  <Option value="fixed">
                    {intl.formatMessage({ id: 'pages.members.coupons.typeFixed' })}
                  </Option>
                  <Option value="percent">
                    {intl.formatMessage({ id: 'pages.members.coupons.typePercent' })}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discountValue"
                label={intl.formatMessage({ id: 'pages.members.coupons.discountValueLabel' })}
                rules={[{ required: true }]}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={1}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="minOrderAmount"
                label={intl.formatMessage({ id: 'pages.members.coupons.minOrderAmountLabel' })}
                rules={[{ required: true }]}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={0}
                  addonAfter={intl.formatMessage({ id: 'pages.members.coupons.currency' })}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxDiscountAmount"
                label={intl.formatMessage({ id: 'pages.members.coupons.maxDiscountAmountLabel' })}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={0}
                  addonAfter={intl.formatMessage({ id: 'pages.members.coupons.currency' })}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="validPeriod"
            label={intl.formatMessage({ id: 'pages.members.coupons.validPeriodLabel' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.members.coupons.validPeriodRequired' }),
              },
            ]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="totalCount"
            label={intl.formatMessage({ id: 'pages.members.coupons.totalCountLabel' })}
            rules={[{ required: true }]}
            initialValue={100}
          >
            <InputNumber
              placeholder="0"
              style={{ width: '100%' }}
              min={1}
              addonAfter={intl.formatMessage({ id: 'pages.members.coupons.unit' })}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={intl.formatMessage({ id: 'pages.members.coupons.descriptionLabel' })}
          >
            <TextArea
              rows={3}
              placeholder={intl.formatMessage({
                id: 'pages.members.coupons.descriptionPlaceholder',
              })}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label={intl.formatMessage({ id: 'pages.members.coupons.statusLabel' })}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren={intl.formatMessage({ id: 'pages.members.coupons.statusActiveText' })}
              unCheckedChildren={intl.formatMessage({
                id: 'pages.members.coupons.statusInactiveText',
              })}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Issue Coupon Modal */}
      <Modal
        title={intl.formatMessage(
          { id: 'pages.members.coupons.issueModalTitle' },
          { name: editingItem?.name }
        )}
        open={issueModalVisible}
        onCancel={() => {
          setIssueModalVisible(false);
          issueForm.resetFields();
        }}
        onOk={handleIssueCoupon}
        width={600}
      >
        <Form form={issueForm} layout="vertical">
          <Form.Item
            name="targetType"
            label={intl.formatMessage({ id: 'pages.members.coupons.targetTypeLabel' })}
            rules={[{ required: true }]}
            initialValue="specific"
          >
            <Select>
              <Option value="all">
                {intl.formatMessage({ id: 'pages.members.coupons.targetTypeAll' })}
              </Option>
              <Option value="level">
                {intl.formatMessage({ id: 'pages.members.coupons.targetTypeLevel' })}
              </Option>
              <Option value="specific">
                {intl.formatMessage({ id: 'pages.members.coupons.targetTypeSpecific' })}
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="memberIds"
            label={intl.formatMessage({ id: 'pages.members.coupons.memberIdsLabel' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.members.coupons.memberIdsRequired' }),
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={intl.formatMessage({
                id: 'pages.members.coupons.memberIdsPlaceholder',
              })}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label={intl.formatMessage({ id: 'pages.members.coupons.messageLabel' })}
          >
            <TextArea
              rows={3}
              placeholder={intl.formatMessage({
                id: 'pages.members.coupons.messagePlaceholder',
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Coupons;
