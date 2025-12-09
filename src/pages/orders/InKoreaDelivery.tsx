// src/pages/orders/InKoreaDelivery.tsx

import {
  ClearOutlined,
  ExportOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Badge, Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import UserInfoModal from '@/components/UserInfoModal';

const { Text } = Typography;

const InKoreaDelivery: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.delivering' })
  );

  /* ==================== 배송중 상태 그룹 ==================== */
  const DELIVERY_STATUS_GROUPS = [
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.generalMember' }),
      icon: <ShoppingCartOutlined style={{ color: '#1890ff' }} />,
      items: [
        {
          label: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.shipped' }),
          count: 89,
          code: 'USER_SHIPPED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.delivering' }),
          count: 156,
          code: 'USER_DELIVERING',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.delayed' }),
          count: 12,
          code: 'USER_DELAYED',
        },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.businessMember' }),
      icon: <RocketOutlined style={{ color: '#faad14' }} />,
      items: [
        {
          label: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.shipped' }),
          count: 67,
          code: 'BIZ_SHIPPED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.delivering' }),
          count: 98,
          code: 'BIZ_DELIVERING',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.delayed' }),
          count: 8,
          code: 'BIZ_DELAYED',
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
    if (!selectedCode) return 430;
    const found = DELIVERY_STATUS_GROUPS.flatMap((g) => g.items).find(
      (i) => i.code === selectedCode,
    );
    return found?.count ?? 430;
  };

  const handleStatusClick = (groupTitle: string, item: any) => {
    setSelectedCode(item.code);
    setSelectedLabel(`${groupTitle} > ${item.label}`);
    actionRef.current?.reloadAndRest?.();
  };

  const handleClearFilter = () => {
    setSelectedCode(null);
    setSelectedLabel(intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.delivering' }));
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
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.courier' }),
      dataIndex: 'courier',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.allCouriers' }),
        cj: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.cj' }),
        hanjin: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.hanjin' }),
        lotte: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.lotte' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.shipDate' }),
      dataIndex: 'dateRange',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.memberName' }),
      dataIndex: 'userName',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.orderNo' }),
      dataIndex: 'orderNoSearch',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.trackingNo' }),
      dataIndex: 'trackingNo',
      hideInTable: true,
      valueType: 'text',
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
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.orderNo' }),
      dataIndex: 'orderNo',
      width: 130,
      align: 'center',
      hideInSearch: true,
      render: (t) => <strong style={{ color: '#1890ff' }}>{t}</strong>,
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.memberName' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.memberType' })}</div>
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
              id: 'pages.orders.inKoreaDelivery.business',
            });
            const generalText = intl.formatMessage({
              id: 'pages.orders.inKoreaDelivery.general',
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
              intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.general' })
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
          <div>{intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.receiver' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.contact' })}</div>
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
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.address' }),
      dataIndex: 'address',
      width: 250,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.courier' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.trackingNo' })}</div>
        </div>
      ),
      width: 140,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <Tag color="green">{r.courier}</Tag>
          <div style={{ marginTop: 2 }}>{r.trackingNo}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.deliveryStatus' }),
      dataIndex: 'deliveryStatus',
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => {
        const shippedText = intl.formatMessage({
          id: 'pages.orders.inKoreaDelivery.shipped',
        });
        const deliveringText = intl.formatMessage({
          id: 'pages.orders.inKoreaDelivery.delivering',
        });
        const delayedText = intl.formatMessage({
          id: 'pages.orders.inKoreaDelivery.delayed',
        });
        const colors: any = {
          [shippedText]: 'processing',
          [deliveringText]: 'blue',
          [delayedText]: 'warning',
        };
        return <Tag color={colors[r.deliveryStatus] || 'default'}>{r.deliveryStatus}</Tag>;
      },
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.shippedDate' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.estimatedArrival' })}</div>
        </div>
      ),
      width: 140,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <div>{r.shippedDate}</div>
          <div style={{ color: '#1890ff', marginTop: 2 }}>
            {r.estimatedDate}
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.actions' }),
      width: 150,
      align: 'center',
      fixed: 'right',
      hideInSearch: true,
      render: () => (
        <Space size={4}>
          <Button size="small" type="primary">
            {intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.trackDelivery' })}
          </Button>
          <Button size="small">
            {intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.viewDetails' })}
          </Button>
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
            {intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.title' })}
            <Tag color={selectedCode ? 'blue' : 'cyan'}>
              {selectedLabel} ({getSelectedCount().toLocaleString()}
              {intl.formatMessage({ id: 'pages.orders.common.count' }) || '건'})
            </Tag>
          </Space>
        }
        extra={
          selectedCode && (
            <Button icon={<ClearOutlined />} onClick={handleClearFilter}>
              {intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.viewAll' })}
            </Button>
          )
        }
      >
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          {DELIVERY_STATUS_GROUPS.map((group) => (
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
                  id: 'pages.orders.inKoreaDelivery.general',
                });
                const businessText = intl.formatMessage({
                  id: 'pages.orders.inKoreaDelivery.business',
                });
                const shippedText = intl.formatMessage({
                  id: 'pages.orders.inKoreaDelivery.shipped',
                });
                const deliveringText = intl.formatMessage({
                  id: 'pages.orders.inKoreaDelivery.delivering',
                });
                const delayedText = intl.formatMessage({
                  id: 'pages.orders.inKoreaDelivery.delayed',
                });

                let memberType = generalText;
                let deliveryStatus = deliveringText;

                if (selectedCode) {
                  memberType = selectedCode.includes('BIZ') ? businessText : generalText;
                  if (selectedCode.includes('SHIPPED')) deliveryStatus = shippedText;
                  else if (selectedCode.includes('DELIVERING')) deliveryStatus = deliveringText;
                  else if (selectedCode.includes('DELAYED')) deliveryStatus = delayedText;
                } else {
                  memberType = Math.random() > 0.5 ? generalText : businessText;
                  deliveryStatus = [shippedText, deliveringText, delayedText][
                    Math.floor(Math.random() * 3)
                  ];
                }

                return {
                  orderNo: `DEL20251126${String(10000 + start + i).padStart(5, '0')}`,
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
                  courier: [
                    intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.cj' }),
                    intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.hanjin' }),
                    intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.lotte' }),
                  ][Math.floor(Math.random() * 3)],
                  trackingNo: `${String(1000000000 + start + i)}`,
                  deliveryStatus: deliveryStatus,
                  shippedDate: `2025-11-${String(24 + (i % 3)).padStart(2, '0')} 09:00`,
                  estimatedDate: `2025-11-${String(26 + (i % 3)).padStart(2, '0')}`,
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
                  { id: 'pages.orders.inKoreaDelivery.batchTrack' },
                  { count: selectedRowKeys.length }
                )}
              </Button>
            ),
            <Button key="excel" icon={<ExportOutlined />}>
              {intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.excelDownload' })}
            </Button>,
          ]}
          search={{
            labelWidth: 'auto',
            span: 6,
            defaultCollapsed: true,
            collapseRender: (collapsed) =>
              collapsed
                ? intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.more' })
                : intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.collapse' }),
            optionRender: (_searchConfig, formProps) => [
              <Button key="reset" onClick={() => formProps.form?.resetFields()}>
                {intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.reset' })}
              </Button>,
              <Button
                key="search"
                type="primary"
                onClick={() => formProps.form?.submit()}
              >
                {intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.search' })}
              </Button>,
            ],
          }}
          pagination={{
            defaultPageSize: 50,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) =>
              intl.formatMessage(
                { id: 'pages.orders.inKoreaDelivery.total' },
                { total: total.toLocaleString() }
              ),
          }}
        />
      </PageContainer>
    </>
  );
};

export default InKoreaDelivery;
