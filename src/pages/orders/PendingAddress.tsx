// src/pages/orders/PendingAddress.tsx

import {
  ClearOutlined,
  EditOutlined,
  ExportOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  message,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';

const { Text } = Typography;

const PendingAddress: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    intl.formatMessage({ id: 'pages.orders.pendingAddress.title' })
  );

  /* ==================== 배송지 입력 상태 그룹 (i18n 지원) ==================== */
  const ADDRESS_STATUS_GROUPS = [
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingAddress.regularMember' }),
      icon: <ShoppingCartOutlined style={{ color: '#1890ff' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.pendingAddress.noAddress' }), count: 23, code: 'USER_NO_ADDRESS' },
        { label: intl.formatMessage({ id: 'pages.orders.pendingAddress.addressCompleted' }), count: 15, code: 'USER_ADDRESS_DONE' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingAddress.businessMember' }),
      icon: <RocketOutlined style={{ color: '#faad14' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.pendingAddress.noAddress' }), count: 12, code: 'BIZ_NO_ADDRESS' },
        { label: intl.formatMessage({ id: 'pages.orders.pendingAddress.addressCompleted' }), count: 8, code: 'BIZ_ADDRESS_DONE' },
      ],
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [_selectedOrder, setSelectedOrder] = useState<any>(null);
  const [form] = Form.useForm();

  const getSelectedCount = (): number => {
    if (!selectedCode) return 58; // Total pending address
    const found = ADDRESS_STATUS_GROUPS.flatMap((g) => g.items).find(
      (i) => i.code === selectedCode,
    );
    return found?.count ?? 58;
  };

  const handleStatusClick = (groupTitle: string, item: any) => {
    setSelectedCode(item.code);
    setSelectedLabel(`${groupTitle} > ${item.label}`);
    message.success(
      intl.formatMessage(
        { id: 'pages.orders.pendingAddress.filterApplied' },
        { group: groupTitle, label: item.label }
      )
    );
    actionRef.current?.reloadAndRest?.();
  };

  const handleClearFilter = () => {
    setSelectedCode(null);
    setSelectedLabel(intl.formatMessage({ id: 'pages.orders.pendingAddress.title' }));
    setSelectedRowKeys([]);
    message.info(intl.formatMessage({ id: 'pages.orders.pendingAddress.filterCleared' }));
    actionRef.current?.reloadAndRest?.();
  };

  const handleEditAddress = (record: any) => {
    setSelectedOrder(record);
    form.setFieldsValue({
      receiverName: record.receiverName || '',
      phone: record.phone || '',
      address: record.address || '',
      zipCode: record.zipCode || '',
      memo: record.memo || '',
    });
    setAddressModalVisible(true);
  };

  const handleSaveAddress = () => {
    form.validateFields().then((_values) => {
      message.success(intl.formatMessage({ id: 'pages.orders.pendingAddress.addressSaved' }));
      setAddressModalVisible(false);
      actionRef.current?.reload();
    });
  };

  // Helper function to translate member type
  const translateMemberType = (type: string): string => {
    if (type === '일반') return intl.formatMessage({ id: 'pages.orders.pendingPayment.regularMemberTag' });
    if (type === '사업자') return intl.formatMessage({ id: 'pages.orders.pendingPayment.businessMemberTag' });
    return type;
  };

  // Helper function to translate order type
  const translateOrderType = (type: string): string => {
    const typeMap: Record<string, string> = {
      '구매대행': intl.formatMessage({ id: 'pages.orders.status.purchaseAgency' }),
      '배송대행': intl.formatMessage({ id: 'pages.orders.status.shippingAgency' }),
    };
    return typeMap[type] || type;
  };

  // Helper function to translate address status
  const translateAddressStatus = (status: string): string => {
    if (status === '미입력') return intl.formatMessage({ id: 'pages.orders.pendingAddress.pending' });
    if (status === '입력완료') return intl.formatMessage({ id: 'pages.orders.pendingAddress.completed' });
    return status;
  };

  const headerStyle = {
    lineHeight: 1.2,
    textAlign: 'center' as const,
    fontSize: 12,
  };

  const columns: ProColumns<any>[] = [
    // ===================== 검색 전용 컬럼 =====================
    {
      title: intl.formatMessage({ id: 'pages.orders.common.orderType' }),
      dataIndex: 'type',
      hideInTable: true,
      valueType: 'select',
      valueEnum: { 
        all: intl.formatMessage({ id: 'pages.orders.filter.typeAll' }), 
        DEL: intl.formatMessage({ id: 'pages.orders.filter.typeShipping' }), 
        BUY: intl.formatMessage({ id: 'pages.orders.filter.typePurchase' }) 
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.createdAt' }),
      dataIndex: 'dateRange',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.memberName' }),
      dataIndex: 'userName',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.orderNumber' }),
      dataIndex: 'orderNoSearch',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingAddress.addressStatus' }),
      dataIndex: 'addressStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: { 
        all: intl.formatMessage({ id: 'pages.orders.filter.typeAll' }), 
        pending: intl.formatMessage({ id: 'pages.orders.pendingAddress.pending' }), 
        completed: intl.formatMessage({ id: 'pages.orders.pendingAddress.completed' }) 
      },
    },

    // ===================== 실제 테이블 컬럼 =====================
    {
      title: 'No',
      dataIndex: 'no',
      width: 50,
      align: 'center',
      hideInSearch: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.orderNumber' }),
      dataIndex: 'orderNo',
      width: 120,
      align: 'center',
      hideInSearch: true,
      render: (t) => (
        <strong style={{ color: '#1890ff', fontSize: 12 }}>{t}</strong>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.memberName' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.orderType' })}</div>
        </div>
      ),
      dataIndex: 'userName',
      width: 90,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12 }}>{r.userName || '홍길동'}</div>
          <Tag
            color={r.memberType === '일반' ? 'blue' : 'gold'}
            style={{ fontSize: 10, marginTop: 2 }}
          >
            {translateMemberType(r.memberType)}
          </Tag>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.orderType' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.createdAt' })}</div>
        </div>
      ),
      width: 110,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          <Tag color="purple" style={{ fontSize: 11 }}>
            {translateOrderType(r.type) || intl.formatMessage({ id: 'pages.orders.status.purchaseAgency' })}
          </Tag>
          <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
            {r.createdAt || '2025-11-26 10:42'}
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.totalAmount' }),
      dataIndex: 'totalAmount',
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          <strong style={{ color: '#f5222d', fontSize: 13 }}>
            {(r.totalAmount || 485000).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.won' })}
          </strong>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.receiver' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.pendingAddress.phone' })}</div>
        </div>
      ),
      width: 120,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <div>{r.receiverName || '-'}</div>
          <div style={{ marginTop: 2, color: '#666' }}>{r.phone || '-'}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingAddress.address' }),
      dataIndex: 'address',
      width: 300,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          {r.address || <Text type="danger">{intl.formatMessage({ id: 'pages.orders.pendingAddress.noAddress' })}</Text>}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingAddress.zipCode' }),
      dataIndex: 'zipCode',
      width: 90,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          {r.zipCode || '-'}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingAddress.addressStatus' }),
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <Tag color={r.addressStatus === '입력완료' ? 'success' : 'warning'}>
          {translateAddressStatus(r.addressStatus) || intl.formatMessage({ id: 'pages.orders.pendingAddress.pending' })}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingPayment.actions' }),
      width: 150,
      align: 'center',
      fixed: 'right',
      hideInSearch: true,
      render: (_, r) => (
        <Space size={4}>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditAddress(r)}
          >
            {r.addressStatus === '입력완료' 
              ? intl.formatMessage({ id: 'pages.common.edit' }) 
              : intl.formatMessage({ id: 'pages.orders.pendingAddress.noAddress' })}
          </Button>
          <Button size="small">{intl.formatMessage({ id: 'pages.orders.pendingPayment.viewDetails' })}</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={intl.formatMessage({ id: 'pages.orders.pendingAddress.editAddress' })}
        open={addressModalVisible}
        onCancel={() => setAddressModalVisible(false)}
        onOk={handleSaveAddress}
        okText={intl.formatMessage({ id: 'pages.orders.pendingAddress.saveAddress' })}
        cancelText={intl.formatMessage({ id: 'pages.common.cancel' })}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={intl.formatMessage({ id: 'pages.orders.pendingAddress.receiverName' })}
            name="receiverName"
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.orders.pendingAddress.receiverName' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.orders.pendingAddress.receiverName' })} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'pages.orders.pendingAddress.phone' })}
            name="phone"
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.orders.pendingAddress.phone' }) }]}
          >
            <Input placeholder="010-0000-0000" />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'pages.orders.pendingAddress.zipCode' })}
            name="zipCode"
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.orders.pendingAddress.zipCode' }) }]}
          >
            <Input placeholder="12345" />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'pages.orders.pendingAddress.address' })}
            name="address"
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.orders.pendingAddress.address' }) }]}
          >
            <Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'pages.orders.pendingAddress.address' })} />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'pages.orders.pendingAddress.memo' })} name="memo">
            <Input.TextArea rows={2} placeholder={intl.formatMessage({ id: 'pages.orders.pendingAddress.memo' })} />
          </Form.Item>
        </Form>
      </Modal>
      <PageContainer
        title={
          <Space>
            {intl.formatMessage({ id: 'pages.orders.pendingAddress.title' })}
            <Tag color={selectedCode ? 'blue' : 'orange'}>
              {selectedLabel} ({getSelectedCount().toLocaleString()}{intl.formatMessage({ id: 'pages.orders.pendingAddress.count' })})
            </Tag>
          </Space>
        }
        extra={
          selectedCode && (
            <Button icon={<ClearOutlined />} onClick={handleClearFilter}>
              {intl.formatMessage({ id: 'pages.orders.user.viewAll' })}
            </Button>
          )
        }
      >
        {/* 배송지 상태 카드 */}
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          {ADDRESS_STATUS_GROUPS.map((group) => (
            <Col span={6} key={group.title}>
              <Card
                hoverable
                title={
                  <Space>
                    {group.icon}
                    <Text strong style={{ fontSize: 13 }}>
                      {group.title}
                    </Text>
                  </Space>
                }
                bodyStyle={{ padding: '4px 6px' }}
                size="small"
              >
                <Space direction="vertical" size={0} style={{ width: '100%' }}>
                  {group.items.map((item) => (
                    <div
                      key={item.code}
                      onClick={() => handleStatusClick(group.title, item)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 8px',
                        backgroundColor:
                          selectedCode === item.code
                            ? '#e6f7ff'
                            : 'transparent',
                        borderLeft:
                          selectedCode === item.code
                            ? '3px solid #1890ff'
                            : '3px solid transparent',
                        cursor: 'pointer',
                        borderRadius: 4,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        selectedCode !== item.code &&
                        (e.currentTarget.style.backgroundColor = '#f5f5f5')
                      }
                      onMouseLeave={(e) =>
                        selectedCode !== item.code &&
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: item.count === 0 ? '#bbb' : '#333',
                        }}
                      >
                        {item.label}
                      </Text>
                      <Badge
                        count={item.count}
                        overflowCount={99999}
                        style={{
                          backgroundColor:
                            item.count === 0 ? '#d9d9d9' : '#595959',
                        }}
                      />
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <ProTable
          actionRef={actionRef}
          rowKey="orderNo"
          scroll={{ x: 'max-content' }}
          columns={columns}
          request={async (params) => {
            await new Promise((r) => setTimeout(r, 400));
            const total = getSelectedCount();
            const pageSize = params.pageSize || 50;
            const current = params.current || 1;
            const start = (current - 1) * pageSize;

            const mockData = Array.from(
              { length: Math.min(pageSize, total - start || 50) },
              (_, i) => {
                let memberType = '일반';
                let addressStatus = '미입력';

                if (selectedCode) {
                  if (selectedCode.includes('BIZ')) {
                    memberType = '사업자';
                  } else if (selectedCode.includes('USER')) {
                    memberType = '일반';
                  }

                  if (selectedCode.includes('DONE')) {
                    addressStatus = '입력완료';
                  } else if (selectedCode.includes('NO_ADDRESS')) {
                    addressStatus = '미입력';
                  }
                } else {
                  memberType = Math.random() > 0.5 ? '일반' : '사업자';
                  addressStatus = Math.random() > 0.5 ? '미입력' : '입력완료';
                }

                const hasAddress = addressStatus === '입력완료';

                return {
                  orderNo: `ADDR20251126${String(10000 + start + i).padStart(5, '0')}`,
                  userName:
                    memberType === '사업자'
                      ? ['(주)무역상사', '(주)글로벌'][
                          Math.floor(Math.random() * 2)
                        ]
                      : ['홍길동', '김철수', '이영희'][
                          Math.floor(Math.random() * 3)
                        ],
                  memberType: memberType,
                  type: '구매대행',
                  createdAt: '2025-11-26 10:42',
                  totalAmount: Math.floor(Math.random() * 1000000) + 200000,
                  receiverName: hasAddress
                    ? ['홍길동', '김철수', '이영희'][
                        Math.floor(Math.random() * 3)
                      ]
                    : null,
                  phone: hasAddress ? '010-1234-5678' : null,
                  address: hasAddress
                    ? '서울시 강남구 테헤란로 123, 101동 1001호'
                    : null,
                  zipCode: hasAddress ? '06234' : null,
                  addressStatus: addressStatus,
                };
              },
            );

            return { data: mockData, success: true, total };
          }}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          toolBarRender={() => [
            selectedRowKeys.length > 0 && (
              <Button type="primary">
                선택된 {selectedRowKeys.length}건 일괄 처리
              </Button>
            ),
            <Button key="excel" icon={<ExportOutlined />}>
              {intl.formatMessage({ id: 'pages.orders.user.excelDownload' })}
            </Button>,
          ]}
          search={{
            labelWidth: 'auto',
            span: 6,
            defaultCollapsed: true,
            collapseRender: (collapsed) => 
              collapsed 
                ? intl.formatMessage({ id: 'pages.orders.user.showMore' }) 
                : intl.formatMessage({ id: 'pages.orders.user.collapse' }),
            optionRender: (_searchConfig, formProps) => [
              <Button key="reset" onClick={() => formProps.form?.resetFields()}>
                {intl.formatMessage({ id: 'pages.orders.user.reset' })}
              </Button>,
              <Button
                key="search"
                type="primary"
                onClick={() => formProps.form?.submit()}
              >
                {intl.formatMessage({ id: 'pages.orders.user.search' })}
              </Button>,
            ],
          }}
          pagination={{
            defaultPageSize: 50,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `총 ${total.toLocaleString()}건`,
          }}
        />
      </PageContainer>
    </>
  );
};

export default PendingAddress;
