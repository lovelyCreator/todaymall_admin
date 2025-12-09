// src/pages/AllOrders.tsx

import {
  AlertOutlined,
  CarOutlined,
  ClearOutlined,
  ExportOutlined,
  HomeOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  UndoOutlined,
  UploadOutlined,
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

const { Text } = Typography;

const AllOrders: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    intl.formatMessage({ id: 'pages.orders.all.title' })
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /* ==================== 상태 그룹 (i18n 지원) ==================== */
  const STATUS_GROUPS = [
    {
      title: intl.formatMessage({ id: 'pages.orders.all.group.purchase' }),
      icon: <ShoppingCartOutlined style={{ color: '#722ed1' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.all.status.tempSave' }), count: 143, code: 'BUY_TEMP' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.estimate' }), count: 8, code: 'BUY_EST' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.paymentWaiting' }), count: 46, code: 'BUY_PAY_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.paymentComplete' }), count: 5, code: 'BUY_PAY_DONE' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.purchasing' }), count: 1, code: 'BUYING' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.purchaseComplete' }), count: 16994, code: 'BUY_FINAL_DONE' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.group.vvic' }),
      icon: <RocketOutlined style={{ color: '#f759ab' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.all.status.tempSave' }), count: 3, code: 'VVIC_TEMP' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.estimate' }), count: 1, code: 'VVIC_EST' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.paymentWaiting' }), count: 2, code: 'VVIC_PAY_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.paymentComplete' }), count: 2, code: 'VVIC_PAY_DONE' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.purchasing' }), count: 3, code: 'VVIC_BUYING' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.purchaseComplete' }), count: 3964, code: 'VVIC_FINAL_DONE' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.group.shipping' }),
      icon: <CarOutlined style={{ color: '#13c2c2' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.all.status.tempSave' }), count: 48, code: 'DEL_TEMP' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.applicationSubmit' }), count: 178, code: 'DEL_APPLY' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.group.warehouse' }),
      icon: <HomeOutlined style={{ color: '#1890ff' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.all.status.centerArrival' }), count: 110, code: 'WH_ARRIVE' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.warehouseProcessing' }), count: 137, code: 'WH_IN_PROGRESS' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.warehouseComplete' }), count: 86, code: 'WH_IN_DONE' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.paymentWaiting' }), count: 56, code: 'WH_FEE_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.paymentComplete' }), count: 50, code: 'WH_FEE_DONE' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.shipmentWaiting' }), count: 4, code: 'WH_SHIP_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.shipmentComplete' }), count: 356203, code: 'WH_SHIPPED' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.extraFeeWaiting' }), count: 4, code: 'WH_EXTRA_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.extraFeeComplete' }), count: 404, code: 'WH_EXTRA_DONE' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.group.error' }),
      icon: <AlertOutlined style={{ color: '#ff4d4f' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.all.status.errorWarehouse' }), count: 37, code: 'ERR_IN' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.errorIgnore' }), count: 0, code: 'ERR_IGNORE' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.returnMove' }), count: 0, code: 'ERR_RETURN_MOVE' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.refundProcessing' }), count: 3, code: 'REFUND_ING' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.refundRequest' }), count: 1, code: 'REFUND_REQ' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.cancelRequest' }), count: 7307, code: 'CANCEL_REQ' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.refundComplete' }), count: 1863, code: 'REFUNDED' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.shipmentHold' }), count: 9, code: 'HOLD' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.group.return' }),
      icon: <UndoOutlined style={{ color: '#fa541c' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.all.status.returnRequest' }), count: 3, code: 'RETURN_REQ' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.paymentWaiting' }), count: 3, code: 'RETURN_PAY_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.paymentComplete' }), count: 3, code: 'RETURN_PAY_DONE' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.returnComplete' }), count: 2065, code: 'RETURN_DONE' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.group.stock' }),
      icon: <StockOutlined style={{ color: '#52c41a' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.all.status.stockRequest' }), count: 2, code: 'STOCK_REQ' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.warehouseComplete' }), count: 1, code: 'STOCK_IN' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.stockAvailable' }), count: 4, code: 'STOCK_OK' },
        { label: intl.formatMessage({ id: 'pages.orders.all.status.stockOut' }), count: 5132, code: 'STOCK_OUT' },
      ],
    },
  ] as const;

  const getSelectedCount = (): number => {
    if (!selectedCode) return 428571;
    const found = STATUS_GROUPS.flatMap((g: any) => g.items).find(
      (i: any) => i.code === selectedCode,
    );
    return found?.count ?? 428571;
  };

  const handleStatusClick = (groupTitle: string, item: any) => {
    setSelectedCode(item.code);
    setSelectedLabel(`${groupTitle} > ${item.label}`);
    message.success(`${groupTitle} > ${item.label} ${intl.formatMessage({ id: 'pages.orders.all.filterApplied' })}`);
    actionRef.current?.reloadAndRest?.();
  };

  const handleClearFilter = () => {
    setSelectedCode(null);
    setSelectedLabel(intl.formatMessage({ id: 'pages.orders.all.title' }));
    setSelectedRowKeys([]);
    message.info(intl.formatMessage({ id: 'pages.orders.all.filterCleared' }));
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
      title: intl.formatMessage({ id: 'pages.orders.all.pageSize' }),
      dataIndex: 'pageSize',
      hideInTable: true,
      valueType: 'select',
      initialValue: 50,
      valueEnum: { 10: '10', 20: '20', 50: '50', 100: '100' },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.center' }),
      dataIndex: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.all.centerAll' }),
        weihai: intl.formatMessage({ id: 'pages.orders.all.centerWeihai' }),
        qingdao: intl.formatMessage({ id: 'pages.orders.all.centerQingdao' }),
        guangzhou: intl.formatMessage({ id: 'pages.orders.all.centerGuangzhou' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.orderType' }),
      dataIndex: 'type',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.all.centerAll' }),
        DEL: intl.formatMessage({ id: 'pages.orders.all.group.shipping' }),
        BUY: intl.formatMessage({ id: 'pages.orders.all.group.purchase' }),
        VVIC: intl.formatMessage({ id: 'pages.orders.all.group.vvic' }),
        RETURN: intl.formatMessage({ id: 'pages.orders.all.group.return' }),
        MINIMALL: '미니몰',
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.shippingMethod' }),
      dataIndex: 'shippingMethod',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.all.centerAll' }),
        air: intl.formatMessage({ id: 'pages.orders.all.shippingAir' }),
        air_express: intl.formatMessage({ id: 'pages.orders.all.shippingAirExpress' }),
        sea: intl.formatMessage({ id: 'pages.orders.all.shippingSea' }),
        sea_express: intl.formatMessage({ id: 'pages.orders.all.shippingSeaExpress' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.isShipped' }),
      dataIndex: 'isShipped',
      hideInTable: true,
      valueType: 'select',
      valueEnum: { 
        all: intl.formatMessage({ id: 'pages.orders.all.centerAll' }), 
        auto: intl.formatMessage({ id: 'pages.orders.all.autoPayment' }), 
        manual: intl.formatMessage({ id: 'pages.orders.all.manualPayment' }) 
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.registrationDate' }),
      dataIndex: 'dateRange',
      hideInTable: true,
      valueType: 'dateRange',
      search: { transform: (v) => ({ startDate: v[0], endDate: v[1] }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.warehouseStatus' }),
      dataIndex: 'warehouseStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.all.centerAll' }),
        expected: intl.formatMessage({ id: 'pages.orders.all.warehouseExpected' }),
        partial: intl.formatMessage({ id: 'pages.orders.all.warehousePartial' }),
        done: intl.formatMessage({ id: 'pages.orders.all.warehouseDone' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.receiverType' }),
      dataIndex: 'receiverType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: { 
        all: intl.formatMessage({ id: 'pages.orders.all.centerAll' }), 
        personal: intl.formatMessage({ id: 'pages.orders.all.receiverPersonal' }), 
        business: intl.formatMessage({ id: 'pages.orders.all.receiverBusiness' }) 
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.memberName' }),
      dataIndex: 'userName',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.common.memberNamePlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.mailbox' }),
      dataIndex: 'mailbox',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.all.mailboxPlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.receiver' }),
      dataIndex: 'receiver',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.all.receiverPlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.productNo' }),
      dataIndex: 'productNo',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.trackingNo' }),
      dataIndex: 'trackingNo',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.all.trackingNoPlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.orderNumber' }),
      dataIndex: 'orderNoSearch',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.all.orderNoPlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.all.krTrackingNumber' }),
      dataIndex: 'krTrack',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.all.krTrackPlaceholder' }) },
    },

    // ===================== 실제 테이블 컬럼 =====================
    {
      title: intl.formatMessage({ id: 'pages.orders.common.orderNumber' }),
      dataIndex: 'orderNo',
      width: 130,
      hideInSearch: true,
      render: (t) => <strong style={{ color: '#1890ff' }}>{t}</strong>,
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.all.orderType' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.all.shippingMethodCol' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.all.shippedStatus' })}</div>
        </div>
      ),
      width: 90,
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', lineHeight: 1.4 }}>
          <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>
            {r.type || intl.formatMessage({ id: 'pages.orders.all.group.purchase' })}
          </Tag>
          <div style={{ fontSize: 10, color: '#666' }}>
            {r.shippingMethod || '일반'}
          </div>
          {r.isShipped ? (
            <Tag color="green" style={{ fontSize: 10 }}>
              {intl.formatMessage({ id: 'pages.orders.all.shipped' })}
            </Tag>
          ) : (
            <Tag color="orange" style={{ fontSize: 10 }}>
              {intl.formatMessage({ id: 'pages.orders.all.notShipped' })}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.memberName' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.all.receiver' })}</div>
        </div>
      ),
      width: 90,
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          {r.userName || '김**'}
          <div style={{ fontSize: 11, color: '#666' }}>
            {r.receiver || '김철수'}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.all.trackingCount' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.all.warehousedCount' })}</div>
        </div>
      ),
      width: 70,
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          <strong>{r.trackingCount || 3}</strong>
          <div style={{ color: '#1890ff' }}>/ {r.warehousedCount || 2}</div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.quantity' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.all.totalAmount' })}</div>
        </div>
      ),
      width: 110,
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'right' }}>
          <strong>{r.qty || 5}{intl.formatMessage({ id: 'pages.orders.common.items' })}</strong>
          <div style={{ color: '#f5222d', fontWeight: 'bold' }}>
            {(r.totalAmount || 285000).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.currency' })}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.all.paidAmount' })}</div>
          <div>({intl.formatMessage({ id: 'pages.orders.all.weightLabel' })})</div>
        </div>
      ),
      width: 110,
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'right' }}>
          <strong>{(r.paidAmount || 312500).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.currency' })}</strong>
          <div style={{ fontSize: 11, color: '#888' }}>(2.4kg)</div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.all.krTrackingNumber' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.all.shipDateRack' })}</div>
        </div>
      ),
      width: 140,
      hideInSearch: true,
      render: (_, r) => (
        <div>
          {r.krTrack ? <Tag color="green">{r.krTrack}</Tag> : <Tag>{intl.formatMessage({ id: 'pages.orders.all.notRegistered' })}</Tag>}
          <div style={{ fontSize: 10, color: '#666' }}>
            {r.shipDate || '2025-11-20'} · {r.rack || 'A-12-05'}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.all.warehouseStatus' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.all.progressStatus' })}</div>
        </div>
      ),
      width: 110,
      hideInSearch: true,
      render: (_, r) => (
        <Space direction="vertical" size={4}>
          <Tag
            color={r.warehouseStatus === '입고완료' ? 'success' : 'processing'}
          >
            {r.warehouseStatus || intl.formatMessage({ id: 'pages.orders.all.warehouseDone' })}
          </Tag>
          <Tag color="blue">{r.progressStatus || intl.formatMessage({ id: 'pages.orders.all.status.purchaseComplete' })}</Tag>
        </Space>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.all.createdAt' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.all.updatedAt' })}</div>
        </div>
      ),
      width: 120,
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ fontSize: 11 }}>
          {r.createdAt || '2025-11-21 14:32'}
          <div style={{ color: '#888' }}>
            {r.updatedAt || '2025-11-21 18:45'}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.all.inquiryResponder' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.all.purchaseManager' })}</div>
        </div>
      ),
      width: 100,
      hideInSearch: true,
      render: (_, r) => (
        <div>
          {r.noReply ? (
            <span style={{ color: '#f5222d' }}>{r.noReply}</span>
          ) : (
            intl.formatMessage({ id: 'pages.orders.all.none' })
          )}
          <div style={{ fontSize: 11 }}>{r.buyer || '박구매'}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.pendingPayment.actions' }),
      width: 260,
      fixed: 'right',
      hideInSearch: true,
      render: () => (
        <Space size={2} wrap>
          <Button size="small" type="primary">
            {intl.formatMessage({ id: 'pages.orders.all.copyOrder' })}
          </Button>
          <Button size="small">{intl.formatMessage({ id: 'pages.orders.all.additionalCost' })}</Button>
          <Button size="small">{intl.formatMessage({ id: 'pages.orders.all.orderInquiry' })}</Button>
          <Button size="small">{intl.formatMessage({ id: 'pages.orders.all.registerTracking' })}</Button>
          <Button size="small">{intl.formatMessage({ id: 'pages.orders.all.changeBoxCount' })}</Button>
          <Button size="small">{intl.formatMessage({ id: 'pages.orders.all.printTracking' })}</Button>
          <Button size="small">{intl.formatMessage({ id: 'pages.orders.all.reissueTracking' })}</Button>
          <Button size="small" danger>
            {intl.formatMessage({ id: 'pages.orders.all.coupangLabel' })}
          </Button>
          <Button size="small" danger>
            {intl.formatMessage({ id: 'pages.orders.all.return' })}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title={
        <Space>
          {intl.formatMessage({ id: 'pages.orders.all.title' })}
          <Tag color={selectedCode ? 'blue' : 'green'}>
            {selectedLabel} ({getSelectedCount().toLocaleString()}{intl.formatMessage({ id: 'pages.orders.all.count' })})
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
      {/* 7개 카드 무조건 한 줄 */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        {STATUS_GROUPS.map((group: any) => (
          <Col flex="1 1 14%" key={group.title}>
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
                {group.items.map((item: any) => (
                  <div
                    key={item.code}
                    onClick={() => handleStatusClick(group.title, item)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 8px',
                      backgroundColor:
                        selectedCode === item.code ? '#e6f7ff' : 'transparent',
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
                          item.count === 0 ? '#d9d9d9' : '#000000',
                        borderRadius: '10px',
                        minWidth: '20px',
                        height: '20px',
                        lineHeight: '20px',
                        padding: '0 6px',
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
        request={async (params, _sorter, _filter) => {
          await new Promise((r) => setTimeout(r, 400));
          const total = getSelectedCount();
          const pageSize = params.pageSize || 50;
          const current = params.current || 1;
          const start = (current - 1) * pageSize;

          const mockData = Array.from(
            { length: Math.min(pageSize, total - start || 50) },
            (_, i) => ({
              orderNo: `OD20251121${String(10000 + start + i).padStart(5, '0')}`,
              type: selectedCode?.includes('VVIC')
                ? 'VVIC하이패스'
                : selectedCode?.includes('DEL')
                  ? '배송대행'
                  : '구매대행',
              isShipped: Math.random() > 0.3,
              shippingMethod: ['일반', '빠른', '특급'][
                Math.floor(Math.random() * 3)
              ],
              userName: '김**',
              receiver: '김철수',
              trackingCount: Math.floor(Math.random() * 10) + 1,
              warehousedCount: Math.floor(Math.random() * 8),
              qty: Math.floor(Math.random() * 20) + 1,
              totalAmount: Math.floor(Math.random() * 900000) + 100000,
              paidAmount: Math.floor(Math.random() * 1000000) + 150000,
              krTrack: Math.random() > 0.4 ? '123456789012' : null,
              shipDate: '2025-11-20',
              rack: 'A-12-05',
              warehouseStatus: ['입고완료', '처리중', '미입고'][
                Math.floor(Math.random() * 3)
              ],
              progressStatus: selectedCode
                ? STATUS_GROUPS.flatMap((g: any) => g.items).find(
                    (it: any) => it.code === selectedCode,
                  )?.label
                : '구매최종완료',
              createdAt: '2025-11-21 14:32',
              updatedAt: '2025-11-21 18:45',
              noReply: Math.random() > 0.8 ? '홍길동' : null,
              buyer: ['박구매', '이담당', '최매니저'][
                Math.floor(Math.random() * 3)
              ],
            }),
          );

          return { data: mockData, success: true, total };
        }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        toolBarRender={() => [
          selectedRowKeys.length > 0 && (
            <Button danger>
              {intl.formatMessage({ id: 'pages.orders.all.selected' })} {selectedRowKeys.length}{intl.formatMessage({ id: 'pages.orders.all.bulkProcess' })}
            </Button>
          ),
          <Button icon={<ExportOutlined />}>{intl.formatMessage({ id: 'pages.orders.user.excelDownload' })}</Button>,
          <Button type="primary" icon={<UploadOutlined />}>
            {intl.formatMessage({ id: 'pages.orders.all.bulkRegisterTracking' })}
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
          pageSize: 50,
          showTotal: (total) => `${intl.formatMessage({ id: 'pages.orders.common.total' })} ${total.toLocaleString()}${intl.formatMessage({ id: 'pages.orders.all.count' })}`,
        }}
      />
    </PageContainer>
  );
};

export default AllOrders;
