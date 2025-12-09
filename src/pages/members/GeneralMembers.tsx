// src/pages/members/GeneralMembers.tsx

import {
  CrownOutlined,
  ExportOutlined,
  GiftOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const GeneralMembers: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [form] = Form.useForm();

  // Helper function to translate member level
  const translateLevel = (level: string): string => {
    const levelMap: Record<string, string> = {
      '일반': intl.formatMessage({ id: 'pages.members.list.levelGeneral' }),
      'VIP': intl.formatMessage({ id: 'pages.members.list.levelVIP' }),
      'VVIP': intl.formatMessage({ id: 'pages.members.list.levelVVIP' }),
      '휴면': intl.formatMessage({ id: 'pages.members.list.levelDormant' }),
    };
    return levelMap[level] || level;
  };

  const generateMockData = () => {
    const levels = ['일반', 'VIP', 'VVIP', '휴면'];

    return Array.from({ length: 65 }, (_, i) => ({
      id: 60000 + i,
      userId: `general${String(1000 + i)}`,
      name: `${['김민수', '이지은', '박서준', '최유나', '정하늘'][Math.floor(Math.random() * 5)]}**`,
      email: `general${1000 + i}@gmail.com`,
      phone: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      mailbox:
        Math.random() > 0.2
          ? `WH${Math.floor(100 + Math.random() * 900)}`
          : null,
      level: levels[Math.floor(Math.random() * levels.length)],
      totalAmount: Math.floor(Math.random() * 300) * 10000,
      unpaidAmount:
        Math.random() > 0.9 ? Math.floor(Math.random() * 30) * 10000 : 0,
      orderCount: Math.floor(Math.random() * 150),
      lastOrder: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      joinedAt: new Date(Date.now() - Math.random() * 800 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      memo: Math.random() > 0.9 ? '일반 회원, 소량 구매' : null,
      isBlack: false,
      memberType: '일반',
    }));
  };

  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'pages.members.list.memberInfo' }),
      width: 180,
      render: (_, record) => (
        <Space>
          <Avatar
            style={{ backgroundColor: '#1890ff' }}
            icon={<UserOutlined />}
          >
            {record.name[0]}
          </Avatar>
          <div>
            <a
              onClick={() => {
                setSelectedMember(record);
                setDetailModalVisible(true);
              }}
              style={{ fontWeight: 600 }}
            >
              {record.name}
            </a>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.userId}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.general.memberType' }),
      dataIndex: 'memberType',
      width: 100,
      hideInSearch: true,
      render: () => <Tag color="blue">{intl.formatMessage({ id: 'pages.members.general.memberTypeTag' })}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.list.level' }),
      dataIndex: 'level',
      filters: true,
      valueType: 'select',
      valueEnum: {
        일반: { text: intl.formatMessage({ id: 'pages.members.list.levelGeneral' }), status: 'Default' },
        VIP: { text: intl.formatMessage({ id: 'pages.members.list.levelVIP' }), status: 'Success' },
        VVIP: { text: intl.formatMessage({ id: 'pages.members.list.levelVVIP' }), status: 'Processing' },
        휴면: { text: intl.formatMessage({ id: 'pages.members.list.levelDormant' }), status: 'Warning' },
      },
      render: (_, record) => {
        const colorMap: Record<string, string> = {
          일반: 'blue',
          VIP: 'gold',
          VVIP: 'purple',
          휴면: 'gray',
        };
        return (
          <Tag color={colorMap[record.level] || 'blue'}>
            {record.level === 'VVIP' && <CrownOutlined />} {translateLevel(record.level)}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.members.list.mailbox' }),
      dataIndex: 'mailbox',
      render: (_, record) =>
        record.mailbox ? (
          <Tag color="cyan">{record.mailbox}</Tag>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.list.totalAmount' }),
      dataIndex: 'totalAmount',
      sorter: true,
      render: (_, record) => (
        <strong>{record.totalAmount.toLocaleString()}{intl.formatMessage({ id: 'pages.members.list.currency' })}</strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.list.unpaidAmount' }),
      dataIndex: 'unpaidAmount',
      sorter: true,
      render: (_, record) =>
        record.unpaidAmount > 0 ? (
          <span style={{ color: '#ff4d4f', fontWeight: 600 }}>
            {record.unpaidAmount.toLocaleString()}{intl.formatMessage({ id: 'pages.members.list.currency' })}
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: intl.formatMessage({ id: 'pages.members.list.orderCount' }),
      dataIndex: 'orderCount',
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.list.lastOrder' }),
      dataIndex: 'lastOrder',
      valueType: 'date',
    },
    {
      title: intl.formatMessage({ id: 'pages.members.list.lastLogin' }),
      dataIndex: 'lastLogin',
      valueType: 'date',
    },
    {
      title: intl.formatMessage({ id: 'pages.members.list.joinedAt' }),
      dataIndex: 'joinedAt',
      valueType: 'date',
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.members.list.actions' }),
      width: 160,
      render: (_, record) => (
        <Space split="|">
          <a
            onClick={() => {
              setSelectedMember(record);
              setDetailModalVisible(true);
            }}
          >
            {intl.formatMessage({ id: 'pages.members.list.detail' })}
          </a>
          <a
            style={{ color: '#722ed1' }}
            onClick={() => {
              setSelectedMember(record);
              setMessageModalVisible(true);
            }}
          >
            {intl.formatMessage({ id: 'pages.members.list.message' })}
          </a>
          <Popconfirm
            title={intl.formatMessage({ id: 'pages.members.list.blackConfirm' })}
            onConfirm={() => message.success(intl.formatMessage({ id: 'pages.members.list.blackSuccess' }))}
          >
            <a style={{ color: '#ff4d4f' }}>{intl.formatMessage({ id: 'pages.members.list.black' })}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSendMessage = async () => {
    try {
      const _values = await form.validateFields();
      message.success(intl.formatMessage({ id: 'pages.members.list.messageSent' }));
      setMessageModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <PageContainer title={intl.formatMessage({ id: 'pages.members.general.title' })}>
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.general.totalGeneral' })}
              value={8234}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.list.vipMembers' })}
              value={156}
              valueStyle={{ color: '#faad14' }}
              prefix={<CrownOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.list.newThisMonth' })}
              value={89}
              valueStyle={{ color: '#52c41a' }}
              prefix={<PlusOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.members.general.dormantMembers' })}
              value={234}
              valueStyle={{ color: '#888' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          await new Promise((r) => setTimeout(r, 500));
          return {
            data: generateMockData(),
            success: true,
            total: 8234,
          };
        }}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        search={{ labelWidth: 'auto', span: 6 }}
        toolBarRender={() => [
          <Button key="export" icon={<ExportOutlined />}>
            {intl.formatMessage({ id: 'pages.members.list.excelDownload' })}
          </Button>,
          <Button key="blacklist" danger>
            {intl.formatMessage({ id: 'pages.members.list.blackManagement' })}
          </Button>,
        ]}
        rowSelection={{}}
        tableAlertOptionRender={({ selectedRowKeys }) => (
          <Space>
            <Button size="small">{intl.formatMessage({ id: 'pages.members.list.sendSelectedMessage' })}</Button>
            <Popconfirm
              title={intl.formatMessage(
                { id: 'pages.members.list.bulkBlackConfirm' },
                { count: selectedRowKeys.length }
              )}
            >
              <Button danger size="small">
                {intl.formatMessage({ id: 'pages.members.list.bulkBlack' })}
              </Button>
            </Popconfirm>
          </Space>
        )}
      />

      {/* Member Detail Modal */}
      <Modal
        title={`${intl.formatMessage({ id: 'pages.members.list.detailTitle' })} - ${selectedMember?.name}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            {intl.formatMessage({ id: 'pages.members.list.close' })}
          </Button>,
          <Button
            key="message"
            type="primary"
            onClick={() => {
              setDetailModalVisible(false);
              setMessageModalVisible(true);
            }}
          >
            {intl.formatMessage({ id: 'pages.members.list.sendMessage' })}
          </Button>,
        ]}
        width={800}
      >
        {selectedMember && (
          <Tabs
            items={[
              {
                key: 'basic',
                label: intl.formatMessage({ id: 'pages.members.list.tabBasic' }),
                children: (
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.general.memberType' })}>
                      <Tag color="blue">{intl.formatMessage({ id: 'pages.members.general.memberTypeLabel' })}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.memberId' })}>
                      {selectedMember.userId}
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.name' })}>
                      {selectedMember.name}
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.memberLevel' })}>
                      <Tag
                        color={
                          (
                            {
                              일반: 'blue',
                              VIP: 'gold',
                              VVIP: 'purple',
                              휴면: 'gray',
                            } as Record<string, string>
                          )[selectedMember.level] || 'blue'
                        }
                      >
                        {translateLevel(selectedMember.level)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.email' })} span={2}>
                      <Space>
                        <MailOutlined />
                        {selectedMember.email}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.phone' })} span={2}>
                      <Space>
                        <PhoneOutlined />
                        {selectedMember.phone}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.mailbox' })}>
                      {selectedMember.mailbox ? (
                        <Tag color="cyan">{selectedMember.mailbox}</Tag>
                      ) : (
                        '-'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.joinedAt' })}>
                      {selectedMember.joinedAt}
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.lastLogin' })}>
                      {selectedMember.lastLogin}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'order',
                label: intl.formatMessage({ id: 'pages.members.list.tabOrder' }),
                children: (
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.totalOrders' })}>
                      <strong>{selectedMember.orderCount}{intl.formatMessage({ id: 'pages.members.list.count' })}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.lastOrderDate' })}>
                      {selectedMember.lastOrder}
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.totalPayment' })}>
                      <strong style={{ color: '#1890ff' }}>
                        {selectedMember.totalAmount.toLocaleString()}{intl.formatMessage({ id: 'pages.members.list.currency' })}
                      </strong>
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.unpaid' })}>
                      {selectedMember.unpaidAmount > 0 ? (
                        <strong style={{ color: '#ff4d4f' }}>
                          {selectedMember.unpaidAmount.toLocaleString()}{intl.formatMessage({ id: 'pages.members.list.currency' })}
                        </strong>
                      ) : (
                        '-'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.averageOrder' })}>
                      {Math.floor(
                        selectedMember.totalAmount /
                          (selectedMember.orderCount || 1),
                      ).toLocaleString()}
                      {intl.formatMessage({ id: 'pages.members.list.currency' })}
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'pages.members.list.points' })}>
                      <Space>
                        <GiftOutlined />
                        3,500P
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'memo',
                label: intl.formatMessage({ id: 'pages.members.list.tabMemo' }),
                children: (
                  <div>
                    <TextArea
                      rows={6}
                      defaultValue={selectedMember.memo || ''}
                      placeholder={intl.formatMessage({ id: 'pages.members.list.adminMemoPlaceholder' })}
                    />
                    <div style={{ marginTop: 16, textAlign: 'right' }}>
                      <Button
                        type="primary"
                        onClick={() => message.success(intl.formatMessage({ id: 'pages.members.list.memoSaved' }))}
                      >
                        {intl.formatMessage({ id: 'pages.members.list.save' })}
                      </Button>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Modal>

      {/* Send Message Modal */}
      <Modal
        title={`${intl.formatMessage({ id: 'pages.members.list.sendMessageTitle' })} - ${selectedMember?.name}`}
        open={messageModalVisible}
        onCancel={() => {
          setMessageModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSendMessage}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label={intl.formatMessage({ id: 'pages.members.list.sendMethod' })}
            rules={[{ required: true }]}
            initialValue="sms"
          >
            <Select>
              <Option value="sms">{intl.formatMessage({ id: 'pages.members.list.sms' })}</Option>
              <Option value="email">{intl.formatMessage({ id: 'pages.members.list.emailMethod' })}</Option>
              <Option value="both">{intl.formatMessage({ id: 'pages.members.list.both' })}</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="subject" 
            label={intl.formatMessage({ id: 'pages.members.list.subject' })} 
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.members.list.subjectPlaceholder' })} />
          </Form.Item>
          <Form.Item 
            name="content" 
            label={intl.formatMessage({ id: 'pages.members.list.content' })} 
            rules={[{ required: true }]}
          >
            <TextArea rows={6} placeholder={intl.formatMessage({ id: 'pages.members.list.contentPlaceholder' })} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default GeneralMembers;
