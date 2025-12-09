// src/pages/orders/NoData.tsx

import {
  CheckCircleOutlined,
  ClearOutlined,
  CloseCircleOutlined,
  ExportOutlined,
  ReloadOutlined,
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
  Image,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import UserInfoModal from '@/components/UserInfoModal';

const { Text } = Typography;

const NoData: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    intl.formatMessage({ id: 'pages.orders.noData.title' })
  );

  /* ==================== 노데이타 상태 그룹 ==================== */
  const NODATA_STATUS_GROUPS = [
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.generalMember' }),
      icon: <ShoppingCartOutlined style={{ color: '#1890ff' }} />,
      items: [
        {
          label: intl.formatMessage({ id: 'pages.orders.noData.unmatched' }),
          count: 15,
          code: 'USER_UNMATCHED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.noData.matched' }),
          count: 8,
          code: 'USER_MATCHED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.noData.unlinked' }),
          count: 3,
          code: 'USER_UNLINKED',
        },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.businessMember' }),
      icon: <RocketOutlined style={{ color: '#faad14' }} />,
      items: [
        {
          label: intl.formatMessage({ id: 'pages.orders.noData.unmatched' }),
          count: 12,
          code: 'BIZ_UNMATCHED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.noData.matched' }),
          count: 6,
          code: 'BIZ_MATCHED',
        },
        {
          label: intl.formatMessage({ id: 'pages.orders.noData.unlinked' }),
          count: 2,
          code: 'BIZ_UNLINKED',
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
    if (!selectedCode) return 46; // Total nodata records
    const found = NODATA_STATUS_GROUPS.flatMap((g) => g.items).find(
      (i) => i.code === selectedCode,
    );
    return found?.count ?? 46;
  };

  const handleStatusClick = (groupTitle: string, item: any) => {
    setSelectedCode(item.code);
    setSelectedLabel(`${groupTitle} > ${item.label}`);
    actionRef.current?.reloadAndRest?.();
  };

  const handleClearFilter = () => {
    setSelectedCode(null);
    setSelectedLabel(intl.formatMessage({ id: 'pages.orders.noData.title' }));
    setSelectedRowKeys([]);
    actionRef.current?.reloadAndRest?.();
  };

  const handleRefresh = () => {
    actionRef.current?.reload();
  };

  const headerStyle = {
    lineHeight: 1.2,
    textAlign: 'center' as const,
    fontSize: 12,
  };

  const columns: ProColumns<any>[] = [
    // ===================== 검색 전용 컬럼 =====================
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.applicationType' }),
      dataIndex: 'type',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.noData.all' }),
        DEL: intl.formatMessage({ id: 'pages.orders.noData.delivery' }),
        BUY: intl.formatMessage({ id: 'pages.orders.noData.purchase' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.registrationDate' }),
      dataIndex: 'dateRange',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.memberName' }),
      dataIndex: 'userName',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.trackingNo' }),
      dataIndex: 'trackingNo',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.matchStatus' }),
      dataIndex: 'matchStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.noData.all' }),
        unmatched: intl.formatMessage({ id: 'pages.orders.noData.unmatched' }),
        matched: intl.formatMessage({ id: 'pages.orders.noData.matched' }),
        unlinked: intl.formatMessage({ id: 'pages.orders.noData.unlinked' }),
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
      title: intl.formatMessage({ id: 'pages.orders.noData.product' }),
      dataIndex: 'product',
      width: 80,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <Image.PreviewGroup>
          <Image
            src={r.productImage}
            width={50}
            height={50}
            style={{ objectFit: 'cover', cursor: 'pointer' }}
            preview={{
              mask: intl.formatMessage({ id: 'pages.orders.noData.previewImage' }),
            }}
          />
        </Image.PreviewGroup>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.noData.mailbox' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.noData.memberName' })}</div>
        </div>
      ),
      dataIndex: 'mailbox',
      width: 90,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={(e) => {
            const businessText = intl.formatMessage({
              id: 'pages.orders.noData.business',
            });
            const generalText = intl.formatMessage({
              id: 'pages.orders.noData.general',
            });
            const isBusiness = r.memberType === businessText;
            setModalPosition({ x: e.clientX - 300, y: e.clientY });
            setSelectedUserInfo({
              userName: r.userName || (isBusiness ? '(주)무역상사' : '홍길동'),
              userId: isBusiness ? 'TJ13793' : 'user12345',
              memberType: isBusiness ? businessText : generalText,
              businessNo: isBusiness ? '123-45-67890' : undefined,
              mailbox: r.mailbox || (isBusiness ? 'TJ13793' : 'WH12345'),
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
          <div style={{ fontSize: 11 }}>{r.mailbox}</div>
          <div
            style={{
              fontSize: 11,
              color: '#1890ff',
              textDecoration: 'underline',
              marginTop: 2,
            }}
          >
            {r.userName}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.noData.productName' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.noData.trackingNo' })}</div>
        </div>
      ),
      width: 150,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <div>{r.productName}</div>
          <div style={{ color: '#666', marginTop: 2 }}>{r.trackingNo}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.quantity' }),
      dataIndex: 'quantity',
      width: 60,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.weight' }),
      dataIndex: 'weight',
      width: 80,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => `${r.weight} kg`,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.wearer' }),
      dataIndex: 'wearer',
      width: 80,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.orderNo' }),
      dataIndex: 'orderNo',
      width: 120,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.noData.registrationDateCol' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.noData.rackNo' })}</div>
        </div>
      ),
      width: 130,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <div>{r.registrationDate}</div>
          <div style={{ color: '#666', marginTop: 2 }}>{r.rackNo}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.issue' }),
      dataIndex: 'issue',
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <Tag color="red">{r.issue}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.result' }),
      dataIndex: 'result',
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => {
        const matchedText = intl.formatMessage({ id: 'pages.orders.noData.matched' });
        const unlinkedText = intl.formatMessage({ id: 'pages.orders.noData.unlinked' });
        const unmatchedText = intl.formatMessage({ id: 'pages.orders.noData.unmatched' });
        const colors: any = {
          [matchedText]: 'success',
          [unlinkedText]: 'error',
          [unmatchedText]: 'warning',
        };
        return (
          <Tag
            color={colors[r.result] || 'default'}
            icon={
              r.result === matchedText ? (
                <CheckCircleOutlined />
              ) : r.result === unlinkedText ? (
                <CloseCircleOutlined />
              ) : undefined
            }
          >
            {r.result}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.noData.actions' }),
      width: 150,
      align: 'center',
      fixed: 'right',
      hideInSearch: true,
      render: (_, _r) => (
        <Space size={4}>
          <Button size="small" type="primary">
            {intl.formatMessage({ id: 'pages.orders.noData.match' })}
          </Button>
          <Button size="small" danger>
            {intl.formatMessage({ id: 'pages.orders.noData.unlink' })}
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
            {intl.formatMessage({ id: 'pages.orders.noData.management' })}
            <Tag color={selectedCode ? 'blue' : 'red'}>
              {selectedLabel} ({getSelectedCount().toLocaleString()}
              {intl.formatMessage({ id: 'pages.orders.common.count' }) || '건'})
            </Tag>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              {intl.formatMessage({ id: 'pages.orders.noData.refresh' })}
            </Button>
            {selectedCode && (
              <Button icon={<ClearOutlined />} onClick={handleClearFilter}>
                {intl.formatMessage({ id: 'pages.orders.noData.viewAll' })}
              </Button>
            )}
          </Space>
        }
      >
        {/* 매칭 상태 카드 */}
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          {NODATA_STATUS_GROUPS.map((group) => (
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
          rowKey="trackingNo"
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
                  id: 'pages.orders.noData.general',
                });
                const businessText = intl.formatMessage({
                  id: 'pages.orders.noData.business',
                });
                const matchedText = intl.formatMessage({
                  id: 'pages.orders.noData.matched',
                });
                const unlinkedText = intl.formatMessage({
                  id: 'pages.orders.noData.unlinked',
                });
                const unmatchedText = intl.formatMessage({
                  id: 'pages.orders.noData.unmatched',
                });

                let memberType = generalText;
                let result = unmatchedText;

                if (selectedCode) {
                  if (selectedCode.includes('BIZ')) {
                    memberType = businessText;
                  } else if (selectedCode.includes('USER')) {
                    memberType = generalText;
                  }

                  if (selectedCode.includes('MATCHED')) {
                    result = matchedText;
                  } else if (selectedCode.includes('UNLINKED')) {
                    result = unlinkedText;
                  } else if (selectedCode.includes('UNMATCHED')) {
                    result = unmatchedText;
                  }
                } else {
                  memberType = Math.random() > 0.5 ? generalText : businessText;
                  result = [unmatchedText, matchedText, unlinkedText][
                    Math.floor(Math.random() * 3)
                  ];
                }

                // Sample product images
                const productImages = [
                  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', // Hoodie
                  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop', // T-shirt
                  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', // Jeans
                  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', // Sneakers
                  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop', // Jacket
                  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop', // Watch
                  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', // Bag
                  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', // Sunglasses
                ];

                return {
                  trackingNo: `780${String(7740000000 + start + i)}`,
                  productImage: productImages[i % productImages.length],
                  mailbox:
                    memberType === businessText
                      ? 'TJ13793'
                      : `WH${String(12345 + i)}`,
                  userName:
                    memberType === businessText
                      ? ['(주)무역상사', '(주)글로벌'][
                          Math.floor(Math.random() * 2)
                        ]
                      : ['홍길동', '김철수', '이영희'][
                          Math.floor(Math.random() * 3)
                        ],
                  memberType: memberType,
                  productName: ['기모맨투맨', '후드티', '청바지', '운동화'][
                    Math.floor(Math.random() * 4)
                  ],
                  quantity: Math.floor(Math.random() * 5) + 1,
                  weight: (Math.random() * 2).toFixed(2),
                  wearer:
                    memberType === businessText
                      ? '이대표'
                      : ['홍길동', '김철수'][Math.floor(Math.random() * 2)],
                  orderNo:
                    result === matchedText ? `ORD${String(10000 + i)}` : '-',
                  registrationDate: `2025-11-${String(20 + (i % 6)).padStart(2, '0')}`,
                  rackNo: `${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}-${String((i % 20) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
                  issue: ['트래킹불일치', '주문정보없음', '수량불일치'][
                    Math.floor(Math.random() * 3)
                  ],
                  result: result,
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
                  { id: 'pages.orders.noData.batchMatch' },
                  { count: selectedRowKeys.length }
                )}
              </Button>
            ),
            <Button key="excel" icon={<ExportOutlined />}>
              {intl.formatMessage({ id: 'pages.orders.noData.excelDownload' })}
            </Button>,
          ]}
          search={{
            labelWidth: 'auto',
            span: 6,
            defaultCollapsed: true,
            collapseRender: (collapsed) =>
              collapsed
                ? intl.formatMessage({ id: 'pages.orders.noData.more' })
                : intl.formatMessage({ id: 'pages.orders.noData.collapse' }),
            optionRender: (_searchConfig, formProps) => [
              <Button key="reset" onClick={() => formProps.form?.resetFields()}>
                {intl.formatMessage({ id: 'pages.orders.noData.reset' })}
              </Button>,
              <Button
                key="search"
                type="primary"
                onClick={() => formProps.form?.submit()}
              >
                {intl.formatMessage({ id: 'pages.orders.noData.search' })}
              </Button>,
            ],
          }}
          pagination={{
            defaultPageSize: 50,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) =>
              intl.formatMessage(
                { id: 'pages.orders.noData.total' },
                { total: total.toLocaleString() }
              ),
          }}
        />
      </PageContainer>
    </>
  );
};

export default NoData;
