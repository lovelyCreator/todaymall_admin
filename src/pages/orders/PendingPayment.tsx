// src/pages/orders/PendingPayment.tsx

import {
  ClearOutlined,
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
  message,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import UserInfoModal from '@/components/UserInfoModal';

const { Text } = Typography;

const PendingPayment: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    intl.formatMessage({ id: 'pages.orders.pendingPayment.title' })
  );

  /* ==================== 결제 상태 그룹 (i18n 지원) ==================== */
  const PAYMENT_STATUS_GROUPS = [
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingPayment.regularMember' }),
      icon: <ShoppingCartOutlined style={{ color: '#1890ff' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentPending' }), count: 46, code: 'USER_PAY_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentCompleted' }), count: 32, code: 'USER_PAY_DONE' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingPayment.businessMember' }),
      icon: <RocketOutlined style={{ color: '#faad14' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentPending' }), count: 18, code: 'BIZ_PAY_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentCompleted' }), count: 25, code: 'BIZ_PAY_DONE' },
      ],
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);
  const [modalPosition, setModalPosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);

  const getSelectedCount = (): number => {
    if (!selectedCode) return 75; // Total payment pending
    const found = PAYMENT_STATUS_GROUPS.flatMap((g) => g.items).find(
      (i) => i.code === selectedCode,
    );
    return found?.count ?? 75;
  };

  const handleStatusClick = (groupTitle: string, item: any) => {
    setSelectedCode(item.code);
    setSelectedLabel(`${groupTitle} > ${item.label}`);
    message.success(
      intl.formatMessage(
        { id: 'pages.orders.pendingPayment.filterApplied' },
        { group: groupTitle, label: item.label }
      )
    );
    actionRef.current?.reloadAndRest?.();
  };

  const handleClearFilter = () => {
    setSelectedCode(null);
    setSelectedLabel(intl.formatMessage({ id: 'pages.orders.pendingPayment.title' }));
    setSelectedRowKeys([]);
    message.info(intl.formatMessage({ id: 'pages.orders.pendingPayment.filterCleared' }));
    actionRef.current?.reloadAndRest?.();
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
      'VVIC하이패스': intl.formatMessage({ id: 'pages.orders.status.vvicHighpass' }),
    };
    return typeMap[type] || type;
  };

  // Helper function to translate payment status
  const translatePaymentStatus = (status: string): string => {
    if (status === '결제대기') return intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentPending' });
    if (status === '결제완료') return intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentCompleted' });
    return status;
  };

  // Helper function to translate payment method
  const translatePaymentMethod = (method: string): string => {
    const methodMap: Record<string, string> = {
      '카드': intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentMethodCard' }),
      '계좌이체': intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentMethodTransfer' }),
      '무통장입금': intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentMethodDeposit' }),
    };
    return methodMap[method] || method;
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
        BUY: intl.formatMessage({ id: 'pages.orders.filter.typePurchase' }),
        VVIC: intl.formatMessage({ id: 'pages.orders.filter.typeVVIC' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.createdAt' }),
      dataIndex: 'dateRange',
      hideInTable: true,
      valueType: 'dateRange',
      search: { transform: (v) => ({ startDate: v[0], endDate: v[1] }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.memberName' }),
      dataIndex: 'userName',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.filter.userNamePlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.orderNumber' }),
      dataIndex: 'orderNoSearch',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.filter.orderNoPlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentStatus' }),
      dataIndex: 'paymentStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: { 
        all: intl.formatMessage({ id: 'pages.orders.filter.typeAll' }), 
        pending: intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentPending' }), 
        completed: intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentCompleted' }) 
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
        <div
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={(e) => {
            const isBusiness = r.memberType === '사업자';
            setModalPosition({ x: e.clientX - 300, y: e.clientY });
            setSelectedUserInfo({
              userName: r.userName || (isBusiness ? '(주)무역상사' : '홍길동'),
              userId: isBusiness ? 'TJ13793' : 'user12345',
              memberType: translateMemberType(isBusiness ? '사업자' : '일반'),
              businessNo: isBusiness ? '123-45-67890' : undefined,
              mailbox: isBusiness ? 'TJ13793' : 'WH12345',
              registrationDate: isBusiness ? '2023-05-15' : '2024-03-20',
              totalOrders:
                Math.floor(Math.random() * (isBusiness ? 500 : 100)) +
                (isBusiness ? 100 : 10),
              totalAmount:
                Math.floor(Math.random() * (isBusiness ? 50000000 : 5000000)) +
                (isBusiness ? 10000000 : 500000),
              phone: '010-1234-5678',
              email: isBusiness ? 'business@example.com' : 'user@example.com',
              address: '서울시 강남구 테헤란로 123',
              memo: isBusiness ? '우수 거래처' : undefined,
            });
            setUserModalVisible(true);
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: '#1890ff',
              textDecoration: 'underline',
            }}
          >
            {r.userName || '홍길동'}
          </div>
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
      title: intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentAmount' }),
      dataIndex: 'totalAmount',
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          <strong style={{ color: '#f5222d', fontSize: 13 }}>
            {(r.totalAmount || 975400).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.won' })}
          </strong>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.pendingPayment.depositDiscount' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.pendingPayment.pointCoupon' })}</div>
          {/* <div>{intl.formatMessage({ id: 'pages.orders.pendingPayment.deposit' })} / {intl.formatMessage({ id: 'pages.orders.pendingPayment.point' })} / {intl.formatMessage({ id: 'pages.orders.pendingPayment.coupon' })}</div> */}
        </div>
      ),
      width: 150,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <div>{intl.formatMessage({ id: 'pages.orders.pendingPayment.deposit' })}: {(r.depositUsed || 0).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.won' })}</div>
          <div style={{ marginTop: 2 }}>
            {intl.formatMessage({ id: 'pages.orders.pendingPayment.point' })}: {(r.pointUsed || 0).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.won' })}
          </div>
          <div style={{ marginTop: 2 }}>
            {intl.formatMessage({ id: 'pages.orders.pendingPayment.coupon' })}: {(r.couponUsed || 0).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.won' })}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentAmount' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.pendingPayment.payerName' })}</div>
        </div>
      ),
      width: 120,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          <strong style={{ color: '#1890ff', fontSize: 13 }}>
            {(r.paymentAmount || 975400).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.won' })}
          </strong>
          <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
            {r.payerName || '홍길동'}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentMethod' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentDate' })}</div>
        </div>
      ),
      width: 130,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          <Tag
            color={r.paymentMethod === '카드' ? 'blue' : 'green'}
            style={{ fontSize: 11 }}
          >
            {translatePaymentMethod(r.paymentMethod) || intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentMethodCard' })}
          </Tag>
          <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
            {r.paymentDate || '2025-11-26 11:25'}
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingPayment.orderDetails' }),
      dataIndex: 'orderDetails',
      width: 350,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => {
        // Generate order details dynamically with i18n
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const amount = (Math.random() * 50000 + 10000).toFixed(2);
        const orderType = translateOrderType(r.type || '구매대행');
        
        return (
          <div style={{ fontSize: 11, lineHeight: 1.4, textAlign: 'center' }}>
            {`${intl.formatMessage({ id: 'pages.orders.common.orderNumber' })}: ${r.orderNo}(${itemCount}${intl.formatMessage({ id: 'pages.orders.pendingPayment.count' })}) / ${orderType} / W${amount}`}
          </div>
        );
      },
    },
    {
      title: `${intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentStatus' })} / ${intl.formatMessage({ id: 'pages.orders.pendingPayment.actions' })}`,
      width: 200,
      align: 'center',
      fixed: 'right',
      hideInSearch: true,
      render: (_, r) => (
        <div>
          <Tag
            color={r.paymentStatus === '결제완료' ? 'success' : 'warning'}
            style={{ marginBottom: 4 }}
          >
            {translatePaymentStatus(r.paymentStatus) || intl.formatMessage({ id: 'pages.orders.pendingPayment.paymentPending' })}
          </Tag>
          <div>
            <Space size={4}>
              {r.paymentStatus === '결제대기' ? (
                <>
                  <Button size="small" type="primary">
                    {intl.formatMessage({ id: 'pages.orders.pendingPayment.confirmPayment' })}
                  </Button>
                  <Button size="small" danger>
                    {intl.formatMessage({ id: 'pages.orders.pendingPayment.cancelPayment' })}
                  </Button>
                </>
              ) : (
                <>
                  <Button size="small">{intl.formatMessage({ id: 'pages.orders.pendingPayment.viewDetails' })}</Button>
                  <Button size="small" danger>
                    {intl.formatMessage({ id: 'pages.orders.pendingPayment.cancelPayment' })}
                  </Button>
                </>
              )}
            </Space>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <UserInfoModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
        userInfo={selectedUserInfo}
        position={modalPosition}
      />
      <PageContainer
        title={
          <Space>
            {intl.formatMessage({ id: 'pages.orders.pendingPayment.title' })}
            <Tag color={selectedCode ? 'blue' : 'green'}>
              {selectedLabel} ({getSelectedCount().toLocaleString()}{intl.formatMessage({ id: 'pages.orders.pendingPayment.count' })})
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
        {/* 결제 상태 카드 */}
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          {PAYMENT_STATUS_GROUPS.map((group) => (
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
                const totalAmount =
                  Math.floor(Math.random() * 2000000) + 100000;
                const depositUsed = Math.floor(Math.random() * 100000);
                const pointUsed = Math.floor(Math.random() * 50000);
                const couponUsed = Math.floor(Math.random() * 30000);
                const paymentAmount = totalAmount - depositUsed - pointUsed - couponUsed;

                // Determine member type and payment status based on selected filter
                let memberType = '일반';
                let paymentStatus = '결제대기';

                if (selectedCode) {
                  // Extract member type from code
                  if (selectedCode.includes('BIZ')) {
                    memberType = '사업자';
                  } else if (selectedCode.includes('USER')) {
                    memberType = '일반';
                  }

                  // Extract payment status from code
                  if (selectedCode.includes('DONE')) {
                    paymentStatus = '결제완료';
                  } else if (selectedCode.includes('WAIT')) {
                    paymentStatus = '결제대기';
                  }
                } else {
                  // No filter - random data
                  memberType = Math.random() > 0.5 ? '일반' : '사업자';
                  paymentStatus = Math.random() > 0.5 ? '결제대기' : '결제완료';
                }

                return {
                  orderNo: `PAY20251126${String(10000 + start + i).padStart(5, '0')}`,
                  userName:
                    memberType === '사업자'
                      ? ['(주)무역상사', '(주)글로벌', '(주)트레이딩'][
                          Math.floor(Math.random() * 3)
                        ]
                      : ['홍길동', '김철수', '이영희', '박민수'][
                          Math.floor(Math.random() * 4)
                        ],
                  memberType: memberType,
                  type: ['구매대행', '배송대행', 'VVIC하이패스'][Math.floor(Math.random() * 3)],
                  createdAt: '2025-11-26 10:42',
                  totalAmount: totalAmount,
                  depositUsed: depositUsed,
                  pointUsed: pointUsed,
                  couponUsed: couponUsed,
                  paymentAmount: paymentAmount,
                  payerName:
                    memberType === '사업자'
                      ? '이대표'
                      : ['홍길동', '김철수', '이영희'][
                          Math.floor(Math.random() * 3)
                        ],
                  paymentMethod: ['카드', '계좌이체', '무통장입금'][
                    Math.floor(Math.random() * 3)
                  ],
                  paymentDate:
                    paymentStatus === '결제대기' ? '-' : '2025-11-26 11:25',
                  paymentStatus: paymentStatus,
                };
              },
            );

            return { data: mockData, success: true, total };
          }}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          toolBarRender={() => [
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
            showTotal: (total, _range) => 
              intl.formatMessage(
                { id: 'pages.orders.common.total' },
                { count: total.toLocaleString() }
              ),
          }}
        />
      </PageContainer>
    </>
  );
};

export default PendingPayment;
