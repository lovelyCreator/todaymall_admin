// src/pages/orders/RocketOrders.tsx

import {
  AlertOutlined,
  CarOutlined,
  ClearOutlined,
  ExportOutlined,
  EyeOutlined,
  HistoryOutlined,
  HomeOutlined,
  MinusOutlined,
  PlusOutlined,
  RocketOutlined,
  ScanOutlined,
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
  Input,
  message,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import AdditionalCostModal from '@/components/AdditionalCostModal';
import BarcodeScanModal from '@/components/BarcodeScanModal';
import LabelManagementModal from '@/components/LabelManagementModal';
import OrderLogModal from '@/components/OrderLogModal';
import OutputScanModal from '@/components/OutputScanModal';
import ProductTable from '@/components/ProductTable';
import TrackingNumberModal from '@/components/TrackingNumberModal';
import UserInfoModal from '@/components/UserInfoModal';
import { exportInvoiceToExcel } from '@/utils/excelExport';

const { Text } = Typography;
const { Option } = Select;

const RocketOrders: React.FC = () => {
  const intl = useIntl();

  /* ==================== 상태 그룹 (i18n 지원) ==================== */
  const STATUS_GROUPS = [
    {
      title: intl.formatMessage({ id: 'pages.orders.status.rocket' }),
      icon: <RocketOutlined style={{ color: '#f759ab' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.status.tempSave' }), count: 143, code: 'BUY_TEMP' },
        { label: intl.formatMessage({ id: 'pages.orders.status.purchaseQuote' }), count: 8, code: 'BUY_EST' },
        { label: intl.formatMessage({ id: 'pages.orders.status.paymentPending' }), count: 46, code: 'BUY_PAY_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.status.paymentComplete' }), count: 5, code: 'BUY_PAY_DONE' },
        { label: intl.formatMessage({ id: 'pages.orders.status.purchasing' }), count: 1, code: 'BUYING' },
        { label: intl.formatMessage({ id: 'pages.orders.status.purchaseFinalComplete' }), count: 16994, code: 'BUY_FINAL_DONE' },
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
      title: intl.formatMessage({ id: 'pages.orders.status.warehouse' }),
      icon: <HomeOutlined style={{ color: '#1890ff' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.status.centerArrivalExpected' }), count: 110, code: 'WH_ARRIVE' },
        { label: intl.formatMessage({ id: 'pages.orders.status.warehouseInProgress' }), count: 137, code: 'WH_IN_PROGRESS' },
        { label: intl.formatMessage({ id: 'pages.orders.status.warehouseInComplete' }), count: 86, code: 'WH_IN_DONE' },
        { label: intl.formatMessage({ id: 'pages.orders.status.paymentPending' }), count: 56, code: 'WH_PAY_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.status.paymentComplete' }), count: 50, code: 'WH_PAY_DONE' },
        { label: intl.formatMessage({ id: 'pages.orders.status.shipmentPending' }), count: 4, code: 'WH_SHIP_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.status.shipmentComplete' }), count: 356203, code: 'WH_SHIPPED' },
        { label: intl.formatMessage({ id: 'pages.orders.status.additionalFeePending' }), count: 56, code: 'WH_FEE_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.status.additionalFeeComplete' }), count: 50, code: 'WH_FEE_DONE' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.status.error' }),
      icon: <AlertOutlined style={{ color: '#ff4d4f' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.status.errorWarehouse' }), count: 37, code: 'ERR_IN' },
        { label: intl.formatMessage({ id: 'pages.orders.status.errorIgnore' }), count: 0, code: 'ERR_IGNORE' },
        { label: intl.formatMessage({ id: 'pages.orders.status.returnMove' }), count: 0, code: 'ERR_RETURN_MOVE' },
        { label: intl.formatMessage({ id: 'pages.orders.status.refundProcessing' }), count: 3, code: 'REFUND_ING' },
        { label: intl.formatMessage({ id: 'pages.orders.status.refundRequest' }), count: 1, code: 'REFUND_REQ' },
        { label: intl.formatMessage({ id: 'pages.orders.status.cancelRequest' }), count: 7307, code: 'CANCEL_REQ' },
        { label: intl.formatMessage({ id: 'pages.orders.status.refunded' }), count: 1863, code: 'REFUNDED' },
        { label: intl.formatMessage({ id: 'pages.orders.status.shipmentHold' }), count: 9, code: 'HOLD' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.status.return' }),
      icon: <UndoOutlined style={{ color: '#fa541c' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.status.returnRequest' }), count: 3, code: 'RETURN_REQ' },
        { label: intl.formatMessage({ id: 'pages.orders.status.paymentPending' }), count: 3, code: 'RETURN_PAY_WAIT' },
        { label: intl.formatMessage({ id: 'pages.orders.status.paymentComplete' }), count: 3, code: 'RETURN_PAY_DONE' },
        { label: intl.formatMessage({ id: 'pages.orders.status.returnComplete' }), count: 2065, code: 'RETURN_DONE' },
      ],
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.status.inventory' }),
      icon: <StockOutlined style={{ color: '#52c41a' }} />,
      items: [
        { label: intl.formatMessage({ id: 'pages.orders.status.inventoryRequest' }), count: 2, code: 'STOCK_REQ' },
        { label: intl.formatMessage({ id: 'pages.orders.status.warehouseInComplete' }), count: 1, code: 'STOCK_IN' },
        { label: intl.formatMessage({ id: 'pages.orders.status.inventoryAvailable' }), count: 4, code: 'STOCK_OK' },
        { label: intl.formatMessage({ id: 'pages.orders.status.inventoryOut' }), count: 5132, code: 'STOCK_OUT' },
      ],
    },
  ];
  const actionRef = useRef<ActionType>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(intl.formatMessage({ id: 'pages.orders.rocket.title' }));
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);
  const [modalPosition, setModalPosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [_expandedRowKeys, _setExpandedRowKeys] = useState<React.Key[]>([]);
  const [allOrderKeys, setAllOrderKeys] = useState<React.Key[]>([]);
  const [orderLogVisible, setOrderLogVisible] = useState(false);
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>('');
  const [orderLogs, setOrderLogs] = useState<any[]>([]);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [additionalCostVisible, setAdditionalCostVisible] = useState(false);
  const [selectedOrderForCost, setSelectedOrderForCost] = useState<any>(null);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<string>('');
  const [barcodeScanVisible, setBarcodeScanVisible] = useState(false);
  const [labelManagementVisible, setLabelManagementVisible] = useState(false);
  const [outputScanVisible, setOutputScanVisible] = useState(false);

  const handleBarcodeScan = (value: string) => {
    console.log('Scanned value:', value);
    // Here you would typically search for the order with this tracking number
    message.success(intl.formatMessage({ id: 'pages.orders.user.trackingSearch' }, { value }));
    actionRef.current?.reload();
  };

  const getSelectedCount = (statusGroups: any[]): number => {
    if (!selectedCode) return 98000; // Rocket orders total
    const found = statusGroups.flatMap((g) => g.items).find(
      (i: any) => i.code === selectedCode,
    );
    return found ? Math.floor(found.count * 0.20) : 98000; // 20% for Rocket orders
  };

  const handleStatusClick = (groupTitle: string, item: any) => {
    setSelectedCode(item.code);
    setSelectedLabel(`${groupTitle} > ${item.label}`);
    message.success(intl.formatMessage({ id: 'pages.orders.user.filterApplied' }, { group: groupTitle, label: item.label }));
    actionRef.current?.reloadAndRest?.();
  };

  // Helper function to translate order types
  const translateOrderType = (type: string): string => {
    const typeMap: Record<string, string> = {
      '구매대행': intl.formatMessage({ id: 'pages.orders.status.purchaseAgency' }),
      'VVIC하이패스': intl.formatMessage({ id: 'pages.orders.status.vvicHighpass' }),
      '배송대행': intl.formatMessage({ id: 'pages.orders.status.shippingAgency' }),
      '로켓': intl.formatMessage({ id: 'pages.orders.status.rocket' }),
    };
    return typeMap[type] || type;
  };

  // Helper function to translate shipping methods
  const translateShippingMethod = (method: string): string => {
    const methodMap: Record<string, string> = {
      '일반': intl.formatMessage({ id: 'pages.orders.common.shippingMethodNormal' }),
      '빠른': intl.formatMessage({ id: 'pages.orders.common.shippingMethodFast' }),
      '특급': intl.formatMessage({ id: 'pages.orders.common.shippingMethodExpress' }),
    };
    return methodMap[method] || method;
  };

  // Helper function to translate warehouse status
  const translateWarehouseStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      '입고완료': intl.formatMessage({ id: 'pages.orders.status.warehouseInComplete' }),
      '처리중': intl.formatMessage({ id: 'pages.orders.status.processing' }),
      '미입고': intl.formatMessage({ id: 'pages.orders.status.notWarehoused' }),
    };
    return statusMap[status] || status;
  };

  const handleClearFilter = () => {
    setSelectedCode(null);
    setSelectedLabel(intl.formatMessage({ id: 'pages.orders.rocket.title' }));
    setSelectedRowKeys([]);
    message.info(intl.formatMessage({ id: 'pages.orders.user.filterCleared' }));
    actionRef.current?.reloadAndRest?.();
  };

  // Helper function to add common buttons
  const addCommonButtons = (
    buttons: React.ReactNode[],
    record: any,
    includeTrackingRegister = true,
  ) => {
    buttons.push(
      <Button key="orderCopy" size="small" type="primary">
        {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
      </Button>,
    );

    if (includeTrackingRegister) {
      buttons.push(
        <Button
          key="trackingRegister"
          size="small"
          onClick={() => {
            setSelectedOrderForTracking(record.orderNo);
            setTrackingModalVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.trackingRegister' })}
        </Button>,
        <Button key="trackingIssue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingIssue' })}
        </Button>,
      );
    }

    buttons.push(
      <Button
        key="invoiceDownload"
        size="small"
        type="primary"
        onClick={() => handleInvoiceDownload(record)}
      >
        {intl.formatMessage({ id: 'pages.orders.user.invoiceDownload' })}
      </Button>,
      <Button key="coupangLabel" size="small" danger>
        {intl.formatMessage({ id: 'pages.orders.user.coupangLabel' })}
      </Button>,
    );
  };

  // Function to render action buttons based on order status
  const renderActionButtons = (record: any) => {
    const statusCode = record.statusCode || selectedCode;
    const buttons: React.ReactNode[] = [];

    // 결제대기 (BUY_PAY_WAIT)
    if (statusCode === 'BUY_PAY_WAIT') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button key="delete" size="small" danger>
          {intl.formatMessage({ id: 'pages.orders.user.delete' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
        <Button key="purchaseCost" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.purchaseCost' })}
        </Button>,
        <Button key="purchaseCostReset" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.purchaseCostReset' })}
        </Button>,
        <Button key="purchaseCostBankTransfer" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.purchaseCostBankTransfer' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 인패킹업로드, 한진운송장출력, HJ미전송, 운송장재발급
      buttons.push(
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
        <Button key="hanjinTrackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hanjinTrackingPrint' })}
        </Button>,
        <Button key="hjNotSent" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hjNotSent' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
      );
    }
    // 결제완료 (BUY_PAY_DONE)
    else if (statusCode === 'BUY_PAY_DONE') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button key="delete" size="small" danger>
          {intl.formatMessage({ id: 'pages.orders.user.delete' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
        <Button key="fullRefund" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.fullRefund' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 인패킹업로드, 한진운송장출력, HJ미전송, 운송장재발급
      buttons.push(
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
        <Button key="hanjinTrackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hanjinTrackingPrint' })}
        </Button>,
        <Button key="hjNotSent" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hjNotSent' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
      );
    }
    // 구매최종완료 (BUY_FINAL_DONE)
    else if (statusCode === 'BUY_FINAL_DONE') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button key="delete" size="small" danger>
          {intl.formatMessage({ id: 'pages.orders.user.delete' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
        <Button key="fullRefund" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.fullRefund' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 인패킹업로드, 한진운송장출력, HJ미전송, 운송장재발급
      buttons.push(
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
        <Button key="hanjinTrackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hanjinTrackingPrint' })}
        </Button>,
        <Button key="hjNotSent" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hjNotSent' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
      );
    }
    // 센터도착예정 (WH_ARRIVE)
    else if (statusCode === 'WH_ARRIVE') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button key="split" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.split' })}
        </Button>,
        <Button key="delete" size="small" danger>
          {intl.formatMessage({ id: 'pages.orders.user.delete' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 운송장 박스수 변경, 서브운송장 수정, 운송장출력, 운송장재발급, 패킹나눔, 인패킹업로드
      buttons.push(
        <Button key="trackingBoxChange" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingBoxChange' })}
        </Button>,
        <Button key="subTrackingEdit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.subTrackingEdit' })}
        </Button>,
        <Button key="trackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingPrint' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
        <Button key="packingSplit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.packingSplit' })}
        </Button>,
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
      );
    }
    // 입고처리중 (WH_IN_PROGRESS)
    else if (statusCode === 'WH_IN_PROGRESS') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button key="split" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.split' })}
        </Button>,
        <Button key="delete" size="small" danger>
          {intl.formatMessage({ id: 'pages.orders.user.delete' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
        <Button key="shippingCost" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.shippingCost' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 구매전체환불, VVIC라벨출력, 운송장 박스수 변경, 서브운송장 수정, 운송장출력, 운송장재발급, 패킹나눔, 인패킹업로드
      buttons.push(
        <Button key="fullRefund" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.fullRefund' })}
        </Button>,
        <Button key="vvicLabelPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.vvicLabelPrint' })}
        </Button>,
        <Button key="trackingBoxChange" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingBoxChange' })}
        </Button>,
        <Button key="subTrackingEdit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.subTrackingEdit' })}
        </Button>,
        <Button key="trackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingPrint' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
        <Button key="packingSplit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.packingSplit' })}
        </Button>,
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
      );
    }
    // 입고완료 (WH_IN_DONE)
    else if (statusCode === 'WH_IN_DONE') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button key="bundle" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.bundle' })}
        </Button>,
        <Button key="split" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.split' })}
        </Button>,
        <Button key="delete" size="small" danger>
          {intl.formatMessage({ id: 'pages.orders.user.delete' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
        <Button key="shippingCost" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.shippingCost' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 구매전체환불, VVIC라벨출력, 운송장 박스수 변경, 서브운송장 수정, 운송장출력, 운송장재발급, 패킹나눔, 인패킹업로드
      buttons.push(
        <Button key="fullRefund" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.fullRefund' })}
        </Button>,
        <Button key="vvicLabelPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.vvicLabelPrint' })}
        </Button>,
        <Button key="trackingBoxChange" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingBoxChange' })}
        </Button>,
        <Button key="subTrackingEdit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.subTrackingEdit' })}
        </Button>,
        <Button key="trackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingPrint' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
        <Button key="packingSplit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.packingSplit' })}
        </Button>,
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
      );
    }
    // 추가비용결제대기 (WH_FEE_WAIT)
    else if (statusCode === 'WH_FEE_WAIT') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
        <Button key="additionalCostReset" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.additionalCostReset' })}
        </Button>,
        <Button key="additionalCostBankTransfer" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.additionalCostBankTransfer' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 인패킹업로드, 한진운송장출력, HJ성공, 운송장재발급
      buttons.push(
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
        <Button key="hanjinTrackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hanjinTrackingPrint' })}
        </Button>,
        <Button key="hjSuccess" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hjSuccess' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
      );
    }
    // 추가비용결제완료 (WH_FEE_DONE) or 출고대기 (WH_SHIP_WAIT)
    else if (statusCode === 'WH_FEE_DONE' || statusCode === 'WH_SHIP_WAIT') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 구매전체환불, VVIC라벨출력, 운송장 박스수 변경, 서브운송장 수정, 운송장출력, 운송장재발급, 패킹나눔, 인패킹업로드
      buttons.push(
        <Button key="fullRefund" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.fullRefund' })}
        </Button>,
        <Button key="vvicLabelPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.vvicLabelPrint' })}
        </Button>,
        <Button key="trackingBoxChange" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingBoxChange' })}
        </Button>,
        <Button key="subTrackingEdit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.subTrackingEdit' })}
        </Button>,
        <Button key="trackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingPrint' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
        <Button key="packingSplit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.packingSplit' })}
        </Button>,
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
      );
    }
    // 출고완료 (WH_SHIPPED)
    else if (statusCode === 'WH_SHIPPED') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
        <Button key="customsCost" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.customsCost' })}
        </Button>,
        <Button key="additionalFee" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.additionalFee' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 구매전체환불, VVIC라벨출력, 운송장 박스수 변경, 서브운송장 수정, 운송장출력, 운송장재발급, 패킹나눔, 인패킹업로드
      buttons.push(
        <Button key="fullRefund" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.fullRefund' })}
        </Button>,
        <Button key="vvicLabelPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.vvicLabelPrint' })}
        </Button>,
        <Button key="trackingBoxChange" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingBoxChange' })}
        </Button>,
        <Button key="subTrackingEdit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.subTrackingEdit' })}
        </Button>,
        <Button key="trackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingPrint' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
        <Button key="packingSplit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.packingSplit' })}
        </Button>,
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
      );
    }
    // 임시저장 (BUY_TEMP) - keep existing implementation
    else if (statusCode === 'BUY_TEMP') {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button key="delete" size="small" danger>
          {intl.formatMessage({ id: 'pages.orders.user.delete' })}
        </Button>,
        <Button key="split" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.split' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 인패킹업로드, 한진운송장출력, HJ미전송, 운송장재발급
      buttons.push(
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
        <Button key="hanjinTrackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hanjinTrackingPrint' })}
        </Button>,
        <Button key="hjNotSent" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.hjNotSent' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
      );
    }
    // 반품신청 (RETURN_REQ)
    else if (statusCode === 'RETURN_REQ') {
      buttons.push(
        <Button key="delete" size="small" danger>
          {intl.formatMessage({ id: 'pages.orders.user.delete' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
        <Button key="returnCost" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.returnCost' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 구매전체환불, VVIC라벨출력, 운송장 박스수 변경, 서브운송장 수정, 운송장출력, 운송장재발급, 패킹나눔, 인패킹업로드
      buttons.push(
        <Button key="fullRefund" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.fullRefund' })}
        </Button>,
        <Button key="vvicLabelPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.vvicLabelPrint' })}
        </Button>,
        <Button key="trackingBoxChange" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingBoxChange' })}
        </Button>,
        <Button key="subTrackingEdit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.subTrackingEdit' })}
        </Button>,
        <Button key="trackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingPrint' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
        <Button key="packingSplit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.packingSplit' })}
        </Button>,
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
      );
    }
    // 반품 결제대기 (RETURN_PAY_WAIT)
    else if (statusCode === 'RETURN_PAY_WAIT') {
      buttons.push(
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
        <Button key="returnCost" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.returnCost' })}
        </Button>,
        <Button key="returnCostReset" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.returnCostReset' })}
        </Button>,
        <Button key="returnCostBankTransfer" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.returnCostBankTransfer' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 구매전체환불, VVIC라벨출력, 운송장 박스수 변경, 서브운송장 수정, 운송장출력, 운송장재발급, 패킹나눔, 인패킹업로드
      buttons.push(
        <Button key="fullRefund" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.fullRefund' })}
        </Button>,
        <Button key="vvicLabelPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.vvicLabelPrint' })}
        </Button>,
        <Button key="trackingBoxChange" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingBoxChange' })}
        </Button>,
        <Button key="subTrackingEdit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.subTrackingEdit' })}
        </Button>,
        <Button key="trackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingPrint' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
        <Button key="packingSplit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.packingSplit' })}
        </Button>,
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
      );
    }
    // 반품 결제완료 (RETURN_PAY_DONE) or 반품완료 (RETURN_DONE)
    else if (statusCode === 'RETURN_PAY_DONE' || statusCode === 'RETURN_DONE') {
      buttons.push(
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 운송장 박스수 변경, 서브운송장 수정, 운송장출력, 운송장재발급, 패킹나눔, 인패킹업로드
      buttons.push(
        <Button key="trackingBoxChange" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingBoxChange' })}
        </Button>,
        <Button key="subTrackingEdit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.subTrackingEdit' })}
        </Button>,
        <Button key="trackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingPrint' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
        <Button key="packingSplit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.packingSplit' })}
        </Button>,
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
      );
    }
    // 오류입고, 오류무시, 반품이동, 환불처리중, 환불신청, 신청취소, 환불완료, 출고보류
    // ERR_IN, ERR_IGNORE, ERR_RETURN_MOVE, REFUND_ING, REFUND_REQ, CANCEL_REQ, REFUNDED, HOLD
    else if (
      statusCode === 'ERR_IN' ||
      statusCode === 'ERR_IGNORE' ||
      statusCode === 'ERR_RETURN_MOVE' ||
      statusCode === 'REFUND_ING' ||
      statusCode === 'REFUND_REQ' ||
      statusCode === 'CANCEL_REQ' ||
      statusCode === 'REFUNDED' ||
      statusCode === 'HOLD'
    ) {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button key="delete" size="small" danger>
          {intl.formatMessage({ id: 'pages.orders.user.delete' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
      // Optional: 구매전체환불, VVIC라벨출력, 운송장 박스수 변경, 서브운송장 수정, 운송장출력, 운송장재발급, 패킹나눔, 인패킹업로드
      buttons.push(
        <Button key="fullRefund" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.fullRefund' })}
        </Button>,
        <Button key="vvicLabelPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.vvicLabelPrint' })}
        </Button>,
        <Button key="trackingBoxChange" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingBoxChange' })}
        </Button>,
        <Button key="subTrackingEdit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.subTrackingEdit' })}
        </Button>,
        <Button key="trackingPrint" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingPrint' })}
        </Button>,
        <Button key="trackingReissue" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.trackingReissue' })}
        </Button>,
        <Button key="packingSplit" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.packingSplit' })}
        </Button>,
        <Button key="inpackingUpload" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.inpackingUpload' })}
        </Button>,
      );
    }
    // Default fallback for other statuses
    else {
      buttons.push(
        <Button key="orderCopy" size="small" type="primary">
          {intl.formatMessage({ id: 'pages.orders.user.orderCopy' })}
        </Button>,
        <Button
          key="additionalCost"
          size="small"
          onClick={() => {
            setSelectedOrderForCost(record);
            setAdditionalCostVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.user.additionalCost' })}
        </Button>,
        <Button key="orderInquiry" size="small">
          {intl.formatMessage({ id: 'pages.orders.user.orderInquiry' })}
        </Button>,
      );
      addCommonButtons(buttons, record);
    }

    return <Space size={2} wrap>{buttons}</Space>;
  };

  const handleViewOrderLog = (orderNo: string) => {
    setSelectedOrderNo(orderNo);
    // Mock order logs
    setOrderLogs([
      {
        timestamp: '2025-11-26 15:30:25',
        status: '주문완료',
        action: '주문이 접수되었습니다',
        user: '시스템',
        memo: '자동 처리',
      },
      {
        timestamp: '2025-11-26 15:35:10',
        status: '결제완료',
        action: '결제가 완료되었습니다',
        user: '홍길동',
      },
      {
        timestamp: '2025-11-26 16:20:00',
        status: '구매진행중',
        action: '상품 구매를 시작했습니다',
        user: '박구매',
      },
      {
        timestamp: '2025-11-27 10:15:30',
        status: '구매완료',
        action: '상품 구매가 완료되었습니다',
        user: '박구매',
        memo: '타오바오 구매 완료',
      },
      {
        timestamp: '2025-11-28 14:00:00',
        status: '입고완료',
        action: '중국 창고에 입고되었습니다',
        user: '이창고',
      },
    ]);
    setOrderLogVisible(true);
  };

  const handleStatusChange = (orderNo: string, newStatus: string) => {
    message.success(
      intl.formatMessage({ id: 'pages.orders.user.statusChanged' }, { orderNo, status: newStatus }),
    );
    actionRef.current?.reload();
  };

  const handleInvoiceDownload = (record: any) => {
    // Prepare invoice data from order record
    const invoiceData = {
      consignee: record.receiver || '고생블(KOSAETBYEOL)',
      consigneeAddress: '경상북도 경산시 대학로 16길 6, 102동 1508호',
      consigneePhone: record.phone || '01079992253',
      consigneeEmail: record.email || 'y1633y@naver.com',
      portOfLoading: 'WEIHAI, CHINA',
      portOfDischarge: 'INCHEON, KOREA',
      oceanVessel: '',
      voyageNo: '',
      notifyParty: 'SAME AS CNEE',
      products: record.products?.map((p: any, index: number) => ({
        shippingMark: p.productNo || `98${1398 - index}`,
        descriptionEn: p.nameEn || "Men's coat",
        descriptionCn: p.nameCn || '男款外套',
        quantity: p.quantity || 1,
        unitPrice: p.unitPrice || 8.74,
        amount: (p.quantity || 1) * (p.unitPrice || 8.74),
      })) || [
        {
          shippingMark: '981398',
          descriptionEn: "Men's coat",
          descriptionCn: '男款外套',
          quantity: 1,
          unitPrice: 8.74,
          amount: 8.74,
        },
        {
          shippingMark: '981397',
          descriptionEn: "Men's coat",
          descriptionCn: '男款外套',
          quantity: 1,
          unitPrice: 8.74,
          amount: 8.74,
        },
        {
          shippingMark: '981396',
          descriptionEn: "Men's coat",
          descriptionCn: '男款外套',
          quantity: 1,
          unitPrice: 8.74,
          amount: 8.74,
        },
      ],
      lcNumber: '',
      lcIssuingBank: '',
      remarks: '',
    };

    exportInvoiceToExcel(invoiceData, `invoice_${record.orderNo}.xlsx`);
    message.success(intl.formatMessage({ id: 'pages.orders.user.invoiceDownloaded' }));
  };

  const toggleProductExpand = (orderNo: string) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderNo)) {
        newSet.delete(orderNo);
      } else {
        newSet.add(orderNo);
      }
      return newSet;
    });
  };

  const expandedRowRender = (record: any) => {
    const isProductExpanded = expandedProducts.has(record.orderNo);

    return (
      <div
        style={{
          padding: '2px 16px 4px 16px',
          backgroundColor: 'transparent',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Space
          direction="vertical"
          size={0}
          style={{ width: '90%', maxWidth: 1200 }}
        >
          {/* First line: 부가서비스 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 'bold', fontSize: 12, minWidth: 120 }}>
              {intl.formatMessage({ id: 'pages.orders.user.additionalService' })}:
            </span>
            <span style={{ fontSize: 12, color: '#666' }}>
              {record.additionalService || intl.formatMessage({ id: 'pages.orders.common.none' })}
            </span>
          </div>

          {/* Second line: 물류센터 요청사항 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 'bold', fontSize: 12, minWidth: 120 }}>
              {intl.formatMessage({ id: 'pages.orders.user.logisticsRequest' })}:
            </span>
            <span style={{ fontSize: 12, color: '#666' }}>
              {record.logisticsRequest || intl.formatMessage({ id: 'pages.orders.common.none' })}
            </span>
          </div>

          {/* Third line: 관리자 메모 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                whiteSpace: 'nowrap',
                minWidth: 120,
              }}
            >
              {intl.formatMessage({ id: 'pages.orders.user.adminMemo' })}:
            </span>
            <Input.TextArea
              defaultValue={record.adminMemo || ''}
              placeholder={intl.formatMessage({ id: 'pages.orders.user.adminMemoPlaceholder' })}
              autoSize={{ minRows: 1, maxRows: 1 }}
              style={{ fontSize: 12, flex: 1 }}
            />
            <Button
              type="primary"
              size="small"
              onClick={() => message.success(intl.formatMessage({ id: 'pages.orders.user.adminMemoRegistered' }))}
            >
              {intl.formatMessage({ id: 'pages.orders.user.register' })}
            </Button>
          </div>

          {/* Product table - shown when + button is clicked */}
          {isProductExpanded && record.products && (
            <ProductTable products={record.products} orderNo={record.orderNo} />
          )}
        </Space>
      </div>
    );
  };

  const headerStyle = {
    lineHeight: 1.2,
    textAlign: 'center' as const,
    fontSize: 12,
  };

  const columns: ProColumns<any>[] = [
    // ===================== No 컬럼 =====================
    {
      title: 'No',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      hideInSearch: true,
      render: (_text, _record, index) => {
        const pageSize = actionRef.current?.pageInfo?.pageSize || 50;
        const current = actionRef.current?.pageInfo?.current || 1;
        return (current - 1) * pageSize + index + 1;
      },
    },
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
        BUY: intl.formatMessage({ id: 'pages.orders.filter.typePurchase' }),
        VVIC: intl.formatMessage({ id: 'pages.orders.filter.typeVVIC' }),
        RETURN: intl.formatMessage({ id: 'pages.orders.filter.typeReturn' }),
        MINIMALL: intl.formatMessage({ id: 'pages.orders.filter.typeMinimall' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.shippingMethod' }),
      dataIndex: 'shippingMethod',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.filter.shippingMethodAll' }),
        air: intl.formatMessage({ id: 'pages.orders.filter.shippingMethodAir' }),
        air_express: intl.formatMessage({ id: 'pages.orders.filter.shippingMethodAirExpress' }),
        sea: intl.formatMessage({ id: 'pages.orders.filter.shippingMethodSea' }),
        sea_express: intl.formatMessage({ id: 'pages.orders.filter.shippingMethodSeaExpress' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.shippingStatus' }),
      dataIndex: 'isShipped',
      hideInTable: true,
      valueType: 'select',
      valueEnum: { 
        all: intl.formatMessage({ id: 'pages.orders.filter.shippedAll' }), 
        auto: intl.formatMessage({ id: 'pages.orders.filter.shippedAuto' }), 
        manual: intl.formatMessage({ id: 'pages.orders.filter.shippedManual' }) 
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.filter.dateRange' }),
      dataIndex: 'dateRange',
      hideInTable: true,
      valueType: 'dateRange',
      search: { transform: (v) => ({ startDate: v[0], endDate: v[1] }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.warehouseStatus' }),
      dataIndex: 'warehouseStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.filter.warehouseStatusAll' }),
        expected: intl.formatMessage({ id: 'pages.orders.filter.warehouseStatusExpected' }),
        partial: intl.formatMessage({ id: 'pages.orders.filter.warehouseStatusPartial' }),
        done: intl.formatMessage({ id: 'pages.orders.filter.warehouseStatusDone' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.filter.gyeongdongCod' }),
      dataIndex: 'gyeongdongCod',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.filter.shippedAll' }),
        yes: intl.formatMessage({ id: 'pages.common.yes' }),
        no: intl.formatMessage({ id: 'pages.common.no' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.filter.closedArea' }),
      dataIndex: 'closedArea',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: intl.formatMessage({ id: 'pages.orders.filter.shippedAll' }),
        yes: intl.formatMessage({ id: 'pages.common.yes' }),
        no: intl.formatMessage({ id: 'pages.common.no' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.memberName' }),
      dataIndex: 'userName',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.filter.userNamePlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.filter.mailboxPlaceholder' }),
      dataIndex: 'mailbox',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.filter.mailboxPlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.receiver' }),
      dataIndex: 'receiver',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.filter.receiverPlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.filter.productNo' }),
      dataIndex: 'productNo',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.trackingNumber' }),
      dataIndex: 'trackingNo',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.filter.trackingNoPlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.orderNumber' }),
      dataIndex: 'orderNoSearch',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.filter.orderNoPlaceholder' }) },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.common.waybillNumber' }),
      dataIndex: 'krTrack',
      hideInTable: true,
      valueType: 'text',
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.orders.filter.krTrackPlaceholder' }) },
    },

    // ===================== 실제 테이블 컬럼 =====================
    {
      title: intl.formatMessage({ id: 'pages.orders.common.orderNumber' }),
      dataIndex: 'orderNo',
      width: 150,
      hideInSearch: true,
      render: (t, _record) => {
        return (
          <Space
            direction="vertical"
            size={2}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <strong style={{ color: '#1890ff', fontSize: 12 }}>{t}</strong>
            <Button
              size="small"
              icon={
                expandedProducts.has(String(t)) ? (
                  <MinusOutlined />
                ) : (
                  <PlusOutlined />
                )
              }
              onClick={() => toggleProductExpand(String(t))}
              style={{ minWidth: 22, padding: '0 2px', fontSize: 10 }}
            />
            <Space size={2}>
              <Button
                size="small"
                icon={<EyeOutlined />}
                type="link"
                style={{ fontSize: 11, padding: '0 4px' }}
                onClick={() => (window.location.href = `/orders/detail/${t}`)}
              >
                {intl.formatMessage({ id: 'pages.orders.user.viewOrder' })}
              </Button>
              <Button
                size="small"
                icon={<HistoryOutlined />}
                type="link"
                onClick={() => handleViewOrderLog(String(t))}
                style={{ fontSize: 11, padding: '0 4px' }}
              >
                {intl.formatMessage({ id: 'pages.orders.user.log' })}
              </Button>
            </Space>
          </Space>
        );
      },
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.orderType' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.shippingMethod' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.shippingStatus' })}</div>
        </div>
      ),
      width: 90,
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'center', lineHeight: 1.4 }}>
          <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>
            {translateOrderType(r.type) || intl.formatMessage({ id: 'pages.orders.status.purchaseAgency' })}
          </Tag>
          <div style={{ fontSize: 10, color: '#666' }}>
            {translateShippingMethod(r.shippingMethod) || intl.formatMessage({ id: 'pages.orders.common.shippingMethodNormal' })}
          </div>
          {r.isShipped ? (
            <Tag color="green" style={{ fontSize: 10 }}>
              {intl.formatMessage({ id: 'pages.orders.common.shipped' })}
            </Tag>
          ) : (
            <Tag color="orange" style={{ fontSize: 10 }}>
              {intl.formatMessage({ id: 'pages.orders.common.notShipped' })}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.memberName' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.receiver' })}</div>
        </div>
      ),
      width: 90,
      hideInSearch: true,
      render: (_, r) => (
        <div
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={(e) => {
            setModalPosition({ x: e.clientX - 300, y: e.clientY });
            setSelectedUserInfo({
              userName: r.userName || '김철수',
              userId: r.userId || 'user12345',
              memberType: intl.formatMessage({ id: 'pages.orders.user.regularMember' }),
              mailbox: r.mailbox || 'WH12345',
              registrationDate: '2024-03-20',
              totalOrders: Math.floor(Math.random() * 100) + 10,
              totalAmount: Math.floor(Math.random() * 5000000) + 500000,
              phone: '010-9876-5432',
              email: 'user@example.com',
              address: '서울시 송파구 올림픽로 123',
            });
            setUserModalVisible(true);
          }}
        >
          <Tag color="blue">{intl.formatMessage({ id: 'pages.orders.user.regularMember' })}</Tag>
          <div style={{ color: '#1890ff', textDecoration: 'underline' }}>
            {r.userName || '김**'}
          </div>
          <div style={{ fontSize: 11, color: '#666' }}>
            {r.receiver || '김철수'}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.trackingCount' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.warehousedCount' })}</div>
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
          <div>{intl.formatMessage({ id: 'pages.orders.common.totalAmount' })}</div>
        </div>
      ),
      width: 110,
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'right' }}>
          <strong>{r.qty || 5}{intl.formatMessage({ id: 'pages.orders.common.items' })}</strong>
          <div style={{ color: '#f5222d', fontWeight: 'bold' }}>
            {(r.totalAmount || 285000).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.won' })}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.paidAmount' })}</div>
          <div>({intl.formatMessage({ id: 'pages.orders.common.weight' })})</div>
        </div>
      ),
      width: 110,
      hideInSearch: true,
      render: (_, r) => (
        <div style={{ textAlign: 'right' }}>
          <strong>{(r.paidAmount || 312500).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.won' })}</strong>
          <div style={{ fontSize: 11, color: '#888' }}>(2.4kg)</div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.trackingNumber' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.shipDate' })}/{intl.formatMessage({ id: 'pages.orders.common.rackNumber' })}</div>
        </div>
      ),
      width: 140,
      hideInSearch: true,
      render: (_, r) => (
        <div>
          {r.krTrack ? <Tag color="green">{r.krTrack}</Tag> : <Tag>{intl.formatMessage({ id: 'pages.orders.common.notRegistered' })}</Tag>}
          <div style={{ fontSize: 10, color: '#666' }}>
            {r.shipDate || '2025-11-20'} · {r.rack || 'A-12-05'}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.warehouseStatus' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.progressStatus' })}</div>
        </div>
      ),
      width: 150,
      hideInSearch: true,
      render: (_, r) => (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Tag
            color={r.warehouseStatus === '입고완료' ? 'success' : 'processing'}
          >
            {translateWarehouseStatus(r.warehouseStatus) || intl.formatMessage({ id: 'pages.orders.status.warehouseInComplete' })}
          </Tag>
          <Select
            size="small"
            value={r.progressStatus || intl.formatMessage({ id: 'pages.orders.status.purchaseFinalComplete' })}
            style={{ width: '100%' }}
            onChange={(value) => handleStatusChange(r.orderNo, value)}
          >
            <Option value="BUY_TEMP">{intl.formatMessage({ id: 'pages.orders.status.tempSave' })}</Option>
            <Option value="BUY_EST">{intl.formatMessage({ id: 'pages.orders.status.purchaseQuote' })}</Option>
            <Option value="BUY_PAY_WAIT">{intl.formatMessage({ id: 'pages.orders.status.paymentPending' })}</Option>
            <Option value="BUY_PAY_DONE">{intl.formatMessage({ id: 'pages.orders.status.paymentComplete' })}</Option>
            <Option value="BUYING">{intl.formatMessage({ id: 'pages.orders.status.purchasing' })}</Option>
            <Option value="BUY_FINAL_DONE">{intl.formatMessage({ id: 'pages.orders.status.purchaseFinalComplete' })}</Option>
            <Option value="WH_IN_DONE">{intl.formatMessage({ id: 'pages.orders.status.warehouseInComplete' })}</Option>
            <Option value="WH_SHIPPED">{intl.formatMessage({ id: 'pages.orders.status.shipmentComplete' })}</Option>
          </Select>
        </Space>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.orders.common.createdAt' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.updatedAt' })}</div>
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
          <div>{intl.formatMessage({ id: 'pages.orders.common.inquiryResponder' })}</div>
          <div>{intl.formatMessage({ id: 'pages.orders.common.buyer' })}</div>
        </div>
      ),
      width: 100,
      hideInSearch: true,
      render: (_, r) => (
        <div>
          {r.noReply ? (
            <span style={{ color: '#f5222d' }}>{r.noReply}</span>
          ) : (
            intl.formatMessage({ id: 'pages.orders.common.none' })
          )}
          <div style={{ fontSize: 11 }}>{r.buyer || '박구매'}</div>
        </div>
      ),
    },
    {
      title: <div style={headerStyle}>{intl.formatMessage({ id: 'pages.orders.common.actions' })}</div>,
      width: 320,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => renderActionButtons(record),
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
      <OrderLogModal
        visible={orderLogVisible}
        onClose={() => setOrderLogVisible(false)}
        orderNo={selectedOrderNo}
        logs={orderLogs}
      />
      <AdditionalCostModal
        visible={additionalCostVisible}
        onClose={() => setAdditionalCostVisible(false)}
        orderNo={selectedOrderForCost?.orderNo || ''}
        memberName={selectedOrderForCost?.userName || ''}
        memberId={selectedOrderForCost?.userId || ''}
        center={selectedOrderForCost?.center || intl.formatMessage({ id: 'pages.orders.filter.centerGuangzhou' })}
        shippingMethod={selectedOrderForCost?.shippingMethod || intl.formatMessage({ id: 'pages.orders.filter.shippingMethodSeaExpress' })}
      />
      <TrackingNumberModal
        visible={trackingModalVisible}
        onClose={() => setTrackingModalVisible(false)}
        orderNo={selectedOrderForTracking}
      />
      <BarcodeScanModal
        visible={barcodeScanVisible}
        onClose={() => setBarcodeScanVisible(false)}
        onScan={handleBarcodeScan}
      />
      <LabelManagementModal
        visible={labelManagementVisible}
        onClose={() => setLabelManagementVisible(false)}
      />
      <OutputScanModal
        visible={outputScanVisible}
        onClose={() => setOutputScanVisible(false)}
      />
      <PageContainer
        title={
          <Space>
            {intl.formatMessage({ id: 'pages.orders.rocket.title' })}
            <Tag color={selectedCode ? 'blue' : 'green'}>
              {selectedLabel} ({getSelectedCount(STATUS_GROUPS).toLocaleString()}{intl.formatMessage({ id: 'pages.orders.common.count' })})
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
          {STATUS_GROUPS.map((group) => (
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
                  {group.items.map((item) => {
                    const userCount = Math.floor(item.count * 0.65);
                    return (
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
                          (e.currentTarget.style.backgroundColor =
                            'transparent')
                        }
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: userCount === 0 ? '#bbb' : '#333',
                          }}
                        >
                          {item.label}
                        </Text>
                        <Badge
                          count={userCount}
                          overflowCount={99999}
                          style={{
                            backgroundColor:
                              userCount === 0 ? '#d9d9d9' : '#000000',
                            borderRadius: '10px',
                            minWidth: '20px',
                            height: '20px',
                            lineHeight: '20px',
                            padding: '0 6px',
                          }}
                        />
                      </div>
                    );
                  })}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Action Buttons */}
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Button
            type="primary"
            size="large"
            onClick={() => setBarcodeScanVisible(true)}
            style={{
              width: 180,
              height: 48,
              fontSize: 16,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
            }}
            icon={<ScanOutlined />}
          >
            {intl.formatMessage({ id: 'pages.orders.user.warehouseScan' })}
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => (window.location.href = '/logistics/rack')}
            style={{
              width: 180,
              height: 48,
              fontSize: 16,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(250, 140, 22, 0.3)',
            }}
          >
            {intl.formatMessage({ id: 'pages.orders.user.rackManagement' })}
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => setLabelManagementVisible(true)}
            style={{
              width: 180,
              height: 48,
              fontSize: 16,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(82, 196, 26, 0.3)',
            }}
          >
            {intl.formatMessage({ id: 'pages.orders.user.packagingManagement' })}
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => setOutputScanVisible(true)}
            style={{
              width: 180,
              height: 48,
              fontSize: 16,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(114, 46, 209, 0.3)',
            }}
          >
            {intl.formatMessage({ id: 'pages.orders.user.shipmentScan' })}
          </Button>
        </div>

        <ProTable
          actionRef={actionRef}
          rowKey="orderNo"
          style={{ width: '100%' }}
          columns={columns}
          expandable={{
            expandedRowKeys: allOrderKeys, // Always expand all rows
            onExpandedRowsChange: () => {}, // Prevent collapse
            expandedRowRender,
            expandIcon: () => null, // Hide default expand icon
            expandRowByClick: false,
          }}
          request={async (params) => {
            await new Promise((r) => setTimeout(r, 400));
            const total = getSelectedCount(STATUS_GROUPS);
            const pageSize = params.pageSize || 50;
            const current = params.current || 1;
            const start = (current - 1) * pageSize;

            const productImages = [
              'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
            ];

            const mockData = Array.from(
              { length: Math.min(pageSize, total - start || 50) },
              (_, i) => {
                const orderNo = `RKT20251121${String(10000 + start + i).padStart(5, '0')}`;

                // Auto-expand all rows
                if (!allOrderKeys.includes(orderNo)) {
                  setAllOrderKeys((prev) => [...prev, orderNo]);
                }

                const numProducts = Math.floor(Math.random() * 3) + 1;
                const products = Array.from(
                  { length: numProducts },
                  (_, j) => ({
                    image: productImages[j % productImages.length],
                    name: ['기모 맨투맨', '후드 티셔츠', '청바지', '운동화'][
                      j % 4
                    ],
                    option: ['블랙/L', '화이트/M', '블루/XL'][j % 3],
                    quantity: Math.floor(Math.random() * 3) + 1,
                    price: Math.floor(Math.random() * 50000) + 20000,
                  }),
                );

                const currentStatusCode = selectedCode || 'BUY_FINAL_DONE';
                return {
                  orderNo: orderNo,
                  statusCode: currentStatusCode, // Add statusCode to record
                  type: '로켓',
                  isShipped: Math.random() > 0.3,
                  shippingMethod: ['일반', '빠른', '특급'][
                    Math.floor(Math.random() * 3)
                  ],
                  userName: '김**',
                  receiver: '김철수',
                  trackingCount: Math.floor(Math.random() * 10) + 1,
                  warehousedCount: Math.floor(Math.random() * 8),
                  qty: products.reduce((sum, p) => sum + p.quantity, 0),
                  totalAmount: products.reduce(
                    (sum, p) => sum + p.price * p.quantity,
                    0,
                  ),
                  paidAmount:
                    products.reduce((sum, p) => sum + p.price * p.quantity, 0) +
                    5000,
                  krTrack: Math.random() > 0.4 ? '123456789012' : null,
                  shipDate: '2025-11-20',
                  rack: 'A-12-05',
                  warehouseStatus: ['입고완료', '처리중', '미입고'][
                    Math.floor(Math.random() * 3)
                  ],
                  progressStatus: selectedCode
                    ? STATUS_GROUPS.flatMap((g: any) => g.items).find(
                        (it: any) => it.code === selectedCode,
                      )?.label || intl.formatMessage({ id: 'pages.orders.status.purchaseFinalComplete' })
                    : intl.formatMessage({ id: 'pages.orders.status.purchaseFinalComplete' }),
                  createdAt: '2025-11-21 14:32',
                  updatedAt: '2025-11-21 18:45',
                  noReply: Math.random() > 0.8 ? '홍길동' : null,
                  buyer: ['박구매', '이담당', '최매니저'][
                    Math.floor(Math.random() * 3)
                  ],
                  paymentMethod: '카드결제',
                  deliveryMemo: Math.random() > 0.5 ? '문 앞에 놓아주세요' : '',
                  additionalService:
                    Math.random() > 0.5 ? '검수 서비스, 사진 촬영' : '',
                  logisticsRequest: Math.random() > 0.5 ? '빠른 배송 요청' : '',
                  adminMemo: Math.random() > 0.7 ? '고객 VIP, 우선 처리' : '',
                  products: products,
                };
              },
            );

            return { data: mockData, success: true, total };
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            columnWidth: 40,
          }}
          tableStyle={{ padding: 0 }}
          className="compact-table"
          toolBarRender={() => {
            const toolbar = [
              selectedRowKeys.length > 0 && (
                <Button danger>
                  {intl.formatMessage({ id: 'pages.orders.user.batchProcess' }, { count: selectedRowKeys.length })}
                </Button>
              ),
              <Button key="excel" icon={<ExportOutlined />}>
                {intl.formatMessage({ id: 'pages.orders.user.excelDownload' })}
              </Button>,
              <Button key="upload" type="primary" icon={<UploadOutlined />}>
                {intl.formatMessage({ id: 'pages.orders.user.trackingBatchRegister' })}
              </Button>,
            ];

            toolbar.unshift(
              <div
                key="status-controls"
                style={{
                  position: 'absolute',
                  left: 24,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <select
                  style={{
                    width: 180,
                    height: 32,
                    padding: '4px 11px',
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                  defaultValue=""
                >
                  <option value="">{intl.formatMessage({ id: 'pages.orders.user.statusChangeSelect' })}</option>
                  <option value="BUY_TEMP">{intl.formatMessage({ id: 'pages.orders.status.tempSave' })}</option>
                  <option value="BUY_EST">{intl.formatMessage({ id: 'pages.orders.status.purchaseQuote' })}</option>
                  <option value="BUY_PAY_WAIT">{intl.formatMessage({ id: 'pages.orders.status.paymentPending' })}</option>
                  <option value="BUY_PAY_DONE">{intl.formatMessage({ id: 'pages.orders.status.paymentComplete' })}</option>
                  <option value="BUYING">{intl.formatMessage({ id: 'pages.orders.status.purchasing' })}</option>
                  <option value="BUY_FINAL_DONE">{intl.formatMessage({ id: 'pages.orders.status.purchaseFinalComplete' })}</option>
                  <option value="WH_ARRIVE">{intl.formatMessage({ id: 'pages.orders.status.centerArrivalExpected' })}</option>
                  <option value="WH_IN_PROGRESS">{intl.formatMessage({ id: 'pages.orders.status.warehouseInProgress' })}</option>
                  <option value="WH_IN_DONE">{intl.formatMessage({ id: 'pages.orders.status.warehouseInComplete' })}</option>
                  <option value="WH_SHIP_WAIT">{intl.formatMessage({ id: 'pages.orders.status.shipmentPending' })}</option>
                  <option value="WH_SHIPPED">{intl.formatMessage({ id: 'pages.orders.status.shipmentComplete' })}</option>
                </select>
                <select
                  style={{
                    width: 150,
                    height: 32,
                    padding: '4px 11px',
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                  defaultValue="no"
                >
                  <option value="no">{intl.formatMessage({ id: 'pages.orders.user.smsNotSend' })}</option>
                  <option value="yes">{intl.formatMessage({ id: 'pages.orders.user.smsSend' })}</option>
                </select>
                <Button
                  type="primary"
                  onClick={() =>
                    message.success(
                      intl.formatMessage({ id: 'pages.orders.user.statusChangeConfirm' }, { count: selectedRowKeys.length }),
                    )
                  }
                >
                  {intl.formatMessage({ id: 'pages.orders.user.statusChange' })}
                </Button>
              </div>,
            );

            return toolbar;
          }}
          search={{
            labelWidth: 'auto',
            span: 6,
            defaultCollapsed: true,
            collapseRender: (collapsed) => (collapsed ? intl.formatMessage({ id: 'pages.orders.user.showMore' }) : intl.formatMessage({ id: 'pages.orders.user.collapse' })),
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
            showTotal: (total, _range) => intl.formatMessage({ id: 'pages.orders.user.total' }, { total: total.toLocaleString() }),
          }}
        />
      </PageContainer>
    </>
  );
};

export default RocketOrders;
