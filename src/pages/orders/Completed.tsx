// src/pages/orders/Completed.tsx

import {
  ClearOutlined,
  ExportOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Badge,
  Button,
  Card,
  Col,
  Rate,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import UserInfoModal from '@/components/UserInfoModal';

const { Text } = Typography;

const Completed: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    intl.formatMessage({ id: 'pages.orders.completed.title' })
  );

  /* ==================== 배송완료 상태 그룹 ==================== */
  const COMPLETED_STATUS_GROUPS = [
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.generalMember' }),
      icon: <ShoppingCartOutlined style={{ color: '#1890ff' }} />,
      items: [
        {
          label: intl.formatMessage({ id: 'pages.orders.completed.title' }),
          count: 2456,
          code: 'USER_COMPLETED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.completed.reviewWritten' }),
          count: 892,
          code: 'USER_REVIEWED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.completed.noReview' }),
          count: 1564,
          code: 'USER_NO_REVIEW',
        },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.businessMember' }),
      icon: <RocketOutlined style={{ color: '#faad14' }} />,
      items: [
        {
          label: intl.formatMessage({ id: 'pages.orders.completed.title' }),
          count: 1823,
          code: 'BIZ_COMPLETED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.completed.reviewWritten' }),
          count: 456,
          code: 'BIZ_REVIEWED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.completed.noReview' }),
          count: 1367,
          code: 'BIZ_NO_REVIEW',
        },
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
    if (!selectedCode) return 4279;
    const found = COMPLETED_STATUS_GROUPS.flatMap((g) => g.items).find(
      (i) => i.code === selectedCode,
    );
    return found?.count ?? 4279;
  };

  const handleStatusClick = (groupTitle: string, item: any) => {
    setSelectedCode(item.code);
    setSelectedLabel(`${groupTitle} > ${item.label}`);
    actionRef.current?.reloadAndRest?.();
  };

  const handleClearFilter = () => {
    setSelectedCode(null);
    setSelectedLabel(intl.formatMessage({ id: 'pages.orders.completed.title' }));
    setSelectedRowKeys([]);
    actionRef.current?.reloadAndRest?.();
  };

  const headerStyle = {
    lineHeight: 1.2,
    textAlign: 'center' as const,
    fontSize: 12,
  };

  const columns: ProColumns<any>[] = [
    // ===================== 검색 전용 컬럼 =====================
    {
      title: intl.formatMessage({ id: 'pages.orders.completed.completedDate' }),
      dataIndex: 'dateRange',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.completed.memberName' }),
      dataIndex: 'userName',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.completed.orderNo' }),
      dataIndex: 'orderNoSearch',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.completed.trackingNo' }),
      dataIndex: 'trackingNo',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.completed.reviewStatus' }),
      dataIndex: 'reviewStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.completed.all' }),
        reviewed: intl.formatMessage({ id: 'pages.orders.completed.reviewed' }),
        no_review: intl.formatMessage({ id: 'pages.orders.completed.noReviewStatus' }),
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
      title: intl.formatMessage({ id: 'pages.orders.completed.orderNo' }),
      dataIndex: 'orderNo',
      width: 130,
      align: 'center',
      hideInSearch: true,
      render: (t) => <strong style={{ color: '#1890ff' }}>{t}</strong>,
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.memberName' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.memberType' })}</div>
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
            const businessText = intl.formatMessage({
              id: 'pages.orders.completed.business',
            });
            const generalText = intl.formatMessage({
              id: 'pages.orders.completed.general',
            });
            const isBusiness = r.memberType === businessText;
            setModalPosition({ x: e.clientX - 300, y: e.clientY });
            setSelectedUserInfo({
              userName: r.userName,
              userId: isBusiness ? 'TJ13793' : 'user12345',
              memberType: isBusiness ? businessText : generalText,
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
            {r.userName}
          </div>
          <Tag
            color={
              r.memberType ===
              intl.formatMessage({ id: 'pages.orders.completed.general' })
                ? 'blue'
                : 'gold'
            }
            style={{ fontSize: 10, marginTop: 2 }}
          >
            {r.memberType}
          </Tag>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.receiver' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.contact' })}</div>
        </div>
      ),
      width: 110,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <div>{r.receiver}</div>
          <div style={{ color: '#666', marginTop: 2 }}>{r.phone}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.completed.address' }),
      dataIndex: 'address',
      width: 250,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.completed.trackingNo' }),
      dataIndex: 'trackingNo',
      width: 130,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.orderAmount' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.shippingFee' })}</div>
        </div>
      ),
      width: 110,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <div>
            <strong>{r.orderAmount.toLocaleString()}원</strong>
          </div>
          <div style={{ color: '#666', marginTop: 2 }}>
            {r.shippingFee.toLocaleString()}원
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.completedDate' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.deliveryDays' })}</div>
        </div>
      ),
      width: 130,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <div>{r.completedDate}</div>
          <div style={{ color: '#1890ff', marginTop: 2 }}>
            {r.deliveryDays}일
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.review' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.completed.rating' })}</div>
        </div>
      ),
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => {
        const reviewCompletedText = intl.formatMessage({
          id: 'pages.orders.completed.reviewCompleted',
        });
        const noReviewText = intl.formatMessage({ id: 'pages.orders.completed.noReview' });
        return (
          <div style={{ textAlign: 'center' }}>
            {r.hasReview ? (
              <>
                <Tag color="success" icon={<StarOutlined />}>
                  {reviewCompletedText}
                </Tag>
                <div style={{ marginTop: 4 }}>
                  <Rate disabled defaultValue={r.rating} style={{ fontSize: 12 }} />
                </div>
              </>
            ) : (
              <Tag color="default">{noReviewText}</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.completed.actions' }),
      width: 150,
      align: 'center',
      fixed: 'right',
      hideInSearch: true,
      render: (_, r) => (
        <Space size={4}>
          <Button size="small" type="primary">
            {intl.formatMessage({ id: 'pages.orders.completed.viewDetails' })}
          </Button>
          {!r.hasReview && (
            <Button size="small">
              {intl.formatMessage({ id: 'pages.orders.completed.requestReview' })}
            </Button>
          )}
        </Space>
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
            {intl.formatMessage({ id: 'pages.orders.completed.title' })}
            <Tag color={selectedCode ? 'blue' : 'green'}>
              {selectedLabel} ({getSelectedCount().toLocaleString()}
              {intl.formatMessage({ id: 'pages.orders.common.count' }) || '건'})
            </Tag>
          </Space>
        }
        extra={
          selectedCode && (
            <Button icon={<ClearOutlined />} onClick={handleClearFilter}>
              {intl.formatMessage({ id: 'pages.orders.completed.viewAll' })}
            </Button>
          )
        }
      >
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          {COMPLETED_STATUS_GROUPS.map((group) => (
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
                const generalText = intl.formatMessage({
                  id: 'pages.orders.completed.general',
                });
                const businessText = intl.formatMessage({
                  id: 'pages.orders.completed.business',
                });
                let memberType = generalText;
                let hasReview = false;

                if (selectedCode) {
                  memberType = selectedCode.includes('BIZ') ? businessText : generalText;
                  if (selectedCode.includes('REVIEWED')) hasReview = true;
                  else if (selectedCode.includes('NO_REVIEW'))
                    hasReview = false;
                  else hasReview = Math.random() > 0.5;
                } else {
                  memberType = Math.random() > 0.5 ? generalText : businessText;
                  hasReview = Math.random() > 0.5;
                }

                return {
                  orderNo: `COMP20251126${String(10000 + start + i).padStart(5, '0')}`,
                  userName:
                    memberType === businessText
                      ? ['(주)무역상사', '(주)글로벌'][
                          Math.floor(Math.random() * 2)
                        ]
                      : ['홍길동', '김철수', '이영희'][
                          Math.floor(Math.random() * 3)
                        ],
                  memberType: memberType,
                  receiver:
                    memberType === businessText
                      ? '이대표'
                      : ['홍길동', '김철수'][Math.floor(Math.random() * 2)],
                  phone: '010-1234-5678',
                  address: '서울시 강남구 테헤란로 123, 101동 1001호',
                  trackingNo: `${String(1000000000 + start + i)}`,
                  orderAmount: Math.floor(Math.random() * 500000) + 100000,
                  shippingFee: Math.floor(Math.random() * 5000) + 3000,
                  completedDate: `2025-11-${String(20 + (i % 6)).padStart(2, '0')}`,
                  deliveryDays: Math.floor(Math.random() * 5) + 3,
                  hasReview: hasReview,
                  rating: hasReview ? Math.floor(Math.random() * 2) + 4 : 0,
                };
              },
            );

            return { data: mockData, success: true, total };
          }}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          toolBarRender={() => [
            selectedRowKeys.length > 0 && (
              <Button type="primary">
                {intl.formatMessage(
                  { id: 'pages.orders.completed.batchRequestReview' },
                  { count: selectedRowKeys.length }
                )}
              </Button>
            ),
            <Button key="excel" icon={<ExportOutlined />}>
              {intl.formatMessage({ id: 'pages.orders.completed.excelDownload' })}
            </Button>,
          ]}
          search={{
            labelWidth: 'auto',
            span: 6,
            defaultCollapsed: true,
            collapseRender: (collapsed) =>
              collapsed
                ? intl.formatMessage({ id: 'pages.orders.completed.more' })
                : intl.formatMessage({ id: 'pages.orders.completed.collapse' }),
            optionRender: (_searchConfig, formProps) => [
              <Button key="reset" onClick={() => formProps.form?.resetFields()}>
                {intl.formatMessage({ id: 'pages.orders.completed.reset' })}
              </Button>,
              <Button
                key="search"
                type="primary"
                onClick={() => formProps.form?.submit()}
              >
                {intl.formatMessage({ id: 'pages.orders.completed.search' })}
              </Button>,
            ],
          }}
          pagination={{
            defaultPageSize: 50,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) =>
              intl.formatMessage(
                { id: 'pages.orders.completed.total' },
                { total: total.toLocaleString() }
              ),
          }}
        />
      </PageContainer>
    </>
  );
};

export default Completed;
