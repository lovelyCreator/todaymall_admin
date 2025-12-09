// src/pages/orders/InChinaWarehouse.tsx

import {
  ClearOutlined,
  ExportOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Badge, Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import UserInfoModal from '@/components/UserInfoModal';

const { Text } = Typography;

const InChinaWarehouse: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.title' })
  );

  /* ==================== 중국창고 상태 그룹 (i18n 지원) ==================== */
  const WAREHOUSE_STATUS_GROUPS = [
    {
      title: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.regularMember' }),
      icon: <ShoppingCartOutlined style={{ color: '#1890ff' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.waiting' }), count: 45, code: 'USER_WAITING' },
        { label: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.arrived' }), count: 128, code: 'USER_ARRIVED' },
        { label: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.inspecting' }), count: 23, code: 'USER_INSPECTING' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.businessMember' }),
      icon: <RocketOutlined style={{ color: '#faad14' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.waiting' }), count: 32, code: 'BIZ_WAITING' },
        { label: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.arrived' }), count: 89, code: 'BIZ_ARRIVED' },
        { label: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.inspecting' }), count: 15, code: 'BIZ_INSPECTING' },
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
    if (!selectedCode) return 332;
    const found = WAREHOUSE_STATUS_GROUPS.flatMap((g) => g.items).find(
      (i) => i.code === selectedCode,
    );
    return found?.count ?? 332;
  };

  const handleStatusClick = (groupTitle: string, item: any) => {
    setSelectedCode(item.code);
    setSelectedLabel(`${groupTitle} > ${item.label}`);
    actionRef.current?.reloadAndRest?.();
  };

  const handleClearFilter = () => {
    setSelectedCode(null);
    setSelectedLabel(intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.title' }));
    setSelectedRowKeys([]);
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
    };
    return typeMap[type] || type;
  };

  // Helper function to translate warehouse status
  const translateWarehouseStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      '입고대기': intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.waiting' }),
      '입고완료': intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.arrived' }),
      '검수중': intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.inspecting' }),
    };
    return statusMap[status] || status;
  };

  // Helper function to translate center names
  const translateCenter = (center: string): string => {
    const centerMap: Record<string, string> = {
      '(중국)위해': intl.formatMessage({ id: 'pages.orders.filter.centerWeihai' }),
      '(중국)청도': intl.formatMessage({ id: 'pages.orders.filter.centerQingdao' }),
      '(중국)광저우': intl.formatMessage({ id: 'pages.orders.filter.centerGuangzhou' }),
    };
    return centerMap[center] || center;
  };

  // Helper function to translate memo content
  const translateMemo = (memo: string): string => {
    const memoMap: Record<string, string> = {
      '정상입고': intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.memoNormal' }),
      '파손주의': intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.memoFragile' }),
      '재검수필요': intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.memoReinspect' }),
    };
    return memoMap[memo] || memo;
  };

  const headerStyle = {
    lineHeight: 1.2,
    textAlign: 'center' as const,
    fontSize: 12,
  };

  const columns: ProColumns<any>[] = [
    // ===================== 검색 전용 컬럼 =====================
    {
      title: intl.formatMessage({ id: 'pages.orders.filter.center' }),
      dataIndex: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.filter.centerAll' }),
        weihai: intl.formatMessage({ id: 'pages.orders.filter.centerWeihai' }),
        qingdao: intl.formatMessage({ id: 'pages.orders.filter.centerQingdao' }),
        guangzhou: intl.formatMessage({ id: 'pages.orders.filter.centerGuangzhou' }),
      },
    },
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
      title: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.warehouseDate' }),
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
      title: intl.formatMessage({ id: 'pages.orders.common.trackingNumber' }),
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
      title: intl.formatMessage({ id: 'pages.orders.common.orderNumber' }),
      dataIndex: 'orderNo',
      width: 130,
      align: 'center',
      hideInSearch: true,
      render: (t) => <strong style={{ color: '#1890ff' }}>{t}</strong>,
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
              userName: r.userName,
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
            {r.userName}
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
      title: intl.formatMessage({ id: 'pages.orders.filter.center' }),
      dataIndex: 'center',
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <Tag color="purple">{translateCenter(r.center)}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.trackingNumber' }),
      dataIndex: 'trackingNo',
      width: 130,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.quantity' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.weight' })}</div>
        </div>
      ),
      width: 90,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          <div>
            <strong>{r.quantity}{intl.formatMessage({ id: 'pages.orders.common.items' })}</strong>
          </div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
            {r.weight}kg
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.warehouseStatus' }),
      dataIndex: 'warehouseStatus',
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => {
        const colors: any = {
          입고대기: 'warning',
          입고완료: 'success',
          검수중: 'processing',
        };
        return <Tag color={colors[r.warehouseStatus]}>{translateWarehouseStatus(r.warehouseStatus)}</Tag>;
      },
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.warehouseDate' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.rackNumber' })}</div>
        </div>
      ),
      width: 140,
      align: 'center',
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', fontSize: 11 }}>
          <div>{r.arrivalDate}</div>
          <div style={{ color: '#666', marginTop: 2 }}>{r.rackNo || '-'}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingAddress.memo' }),
      dataIndex: 'memo',
      width: 200,
      align: 'center',
      hideInSearch: true,
      render: (memo) =>
        typeof memo === 'string' ? (memo ? translateMemo(memo) : '-') : '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingPayment.actions' }),
      width: 180,
      align: 'center',
      fixed: 'right',
      hideInSearch: true,
      render: () => (
        <Space size={4}>
          <Button size="small" type="primary">
            {intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.inspectionComplete' })}
          </Button>
          <Button size="small">{intl.formatMessage({ id: 'pages.orders.pendingPayment.viewDetails' })}</Button>
          <Button size="small">{intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.shipmentRequest' })}</Button>
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
            {intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.title' })}
            <Tag color={selectedCode ? 'blue' : 'purple'}>
              {selectedLabel} ({getSelectedCount().toLocaleString()}{intl.formatMessage({ id: 'pages.orders.inChinaWarehouse.count' })})
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
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          {WAREHOUSE_STATUS_GROUPS.map((group) => (
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
                let warehouseStatus = '입고완료';

                if (selectedCode) {
                  memberType = selectedCode.includes('BIZ') ? '사업자' : '일반';
                  if (selectedCode.includes('WAITING'))
                    warehouseStatus = '입고대기';
                  else if (selectedCode.includes('ARRIVED'))
                    warehouseStatus = '입고완료';
                  else if (selectedCode.includes('INSPECTING'))
                    warehouseStatus = '검수중';
                } else {
                  memberType = Math.random() > 0.5 ? '일반' : '사업자';
                  warehouseStatus = ['입고대기', '입고완료', '검수중'][
                    Math.floor(Math.random() * 3)
                  ];
                }

                return {
                  orderNo: `WH20251126${String(10000 + start + i).padStart(5, '0')}`,
                  userName:
                    memberType === '사업자'
                      ? ['(주)무역상사', '(주)글로벌'][
                          Math.floor(Math.random() * 2)
                        ]
                      : ['홍길동', '김철수', '이영희'][
                          Math.floor(Math.random() * 3)
                        ],
                  memberType: memberType,
                  center: ['(중국)위해', '(중국)청도', '(중국)광저우'][
                    Math.floor(Math.random() * 3)
                  ],
                  trackingNo: `CN${String(1000000000 + start + i)}`,
                  quantity: Math.floor(Math.random() * 10) + 1,
                  weight: (Math.random() * 5 + 1).toFixed(2),
                  warehouseStatus: warehouseStatus,
                  arrivalDate: `2025-11-${String(20 + (i % 6)).padStart(2, '0')} 14:30`,
                  rackNo:
                    warehouseStatus !== '입고대기'
                      ? `${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}-${String((i % 20) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`
                      : null,
                  memo: ['정상입고', '파손주의', '재검수필요', ''][
                    Math.floor(Math.random() * 4)
                  ],
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
            <Button key="upload" icon={<UploadOutlined />}>
              {intl.formatMessage({ id: 'pages.orders.user.trackingBatchRegister' })}
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

export default InChinaWarehouse;
