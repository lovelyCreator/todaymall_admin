import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Image, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import InventoryQuestionModal from '@/components/InventoryQuestionModal';

interface InventoryItem {
  stockNo: string;
  center: string;
  image: string;
  mailbox: string;
  memberName: string;
  customsItem: string;
  productName: string;
  trackingNumber: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  rackNumber: string;
  previousRackNumber: string;
  registrationDate: string;
  modificationDate: string;
  stockStatus: string;
  productStatus: string;
}

const InventoryManagement: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const [inventoryQuestionVisible, setInventoryQuestionVisible] = useState(false);
  const [selectedStockNo, setSelectedStockNo] = useState<string>('');

  const handleInventoryQuestion = (stockNo: string) => {
    setSelectedStockNo(stockNo);
    setInventoryQuestionVisible(true);
  };

  const headerStyle = {
    lineHeight: 1.2,
    textAlign: 'center' as const,
    fontSize: 12,
  };

  const columns: ProColumns<InventoryItem>[] = [
    {
      title: intl.formatMessage({ id: 'pages.inventory.stockNumber' }),
      dataIndex: 'stockNo',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <Space direction="vertical" size={2} style={{ width: '100%', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{record.stockNo}</div>
          <Button
            size="small"
            type="link"
            style={{ fontSize: 11, padding: 0 }}
            onClick={() => handleInventoryQuestion(record.stockNo)}
          >
            {intl.formatMessage({ id: 'pages.inventory.inquiry' })}
          </Button>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.inventory.center' }),
      dataIndex: 'center',
      width: 100,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'pages.inventory.productImage' }),
      dataIndex: 'image',
      width: 100,
      hideInSearch: true,
      align: 'center',
      render: (_: React.ReactNode, record: InventoryItem) => (
        <Image src={record.image} width={60} height={60} style={{ objectFit: 'cover' }} />
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.inventory.mailbox' })}</div>
          <div>{intl.formatMessage({ id: 'pages.inventory.memberName' })}</div>
        </div>
      ),
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12 }}>{record.mailbox}</div>
          <div style={{ fontSize: 11, color: '#666' }}>{record.memberName}</div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.inventory.customsItem' })}</div>
          <div>{intl.formatMessage({ id: 'pages.inventory.productName' })}</div>
        </div>
      ),
      width: 180,
      hideInSearch: true,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12 }}>{record.customsItem}</div>
          <div style={{ fontSize: 11, color: '#666' }}>{record.productName}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.inventory.trackingNumber' }),
      dataIndex: 'trackingNumber',
      width: 150,
      hideInSearch: true,
      render: (_: React.ReactNode, record: InventoryItem) => (
        <div style={{ fontSize: 12, wordBreak: 'break-all' }}>{record.trackingNumber}</div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.inventory.color' })}</div>
          <div>{intl.formatMessage({ id: 'pages.inventory.size' })}</div>
        </div>
      ),
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12 }}>{record.color || '-'}</div>
          <div style={{ fontSize: 11, color: '#666' }}>{record.size || '-'}</div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.inventory.quantity' })} * {intl.formatMessage({ id: 'pages.inventory.unitPrice' })}</div>
          <div>{intl.formatMessage({ id: 'pages.inventory.totalAmount' })}</div>
        </div>
      ),
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12 }}>
            {record.quantity} * ¥{record.unitPrice.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: '#1890ff', fontWeight: 'bold' }}>
            ¥{record.totalAmount.toFixed(2)}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.inventory.rackNumber' })}</div>
          <div>{intl.formatMessage({ id: 'pages.inventory.previousRackNumber' })}</div>
        </div>
      ),
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12 }}>{record.rackNumber}</div>
          <div style={{ fontSize: 11, color: '#666' }}>
            {intl.formatMessage({ id: 'pages.inventory.previous' })}: {record.previousRackNumber || '-'}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={headerStyle}>
          <div>{intl.formatMessage({ id: 'pages.inventory.registrationDate' })}</div>
          <div>{intl.formatMessage({ id: 'pages.inventory.modificationDate' })}</div>
        </div>
      ),
      width: 140,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 11 }}>
          <div>{record.registrationDate}</div>
          <div style={{ color: '#666' }}>{record.modificationDate}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.inventory.stockStatus' }),
      dataIndex: 'stockStatus',
      width: 100,
      hideInSearch: true,
      align: 'center',
      render: (_, record) => (
        <Tag color={record.stockStatus === '사용가능' ? 'green' : record.stockStatus === '사용중' ? 'blue' : 'orange'}>
          {record.stockStatus}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.inventory.productStatus' }),
      dataIndex: 'productStatus',
      width: 100,
      hideInSearch: true,
      align: 'center',
      render: (_, record) => (
        <Tag color={record.productStatus === '정상' ? 'green' : 'red'}>
          {record.productStatus}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <InventoryQuestionModal
        visible={inventoryQuestionVisible}
        question={null}
        onClose={() => {
          setInventoryQuestionVisible(false);
          setSelectedStockNo('');
        }}
        onSubmit={(answer) => {
          console.log('Inventory question submitted for stock:', selectedStockNo, answer);
          setInventoryQuestionVisible(false);
        }}
      />
      <PageContainer
        title={intl.formatMessage({ id: 'pages.inventory.title' })}
        breadcrumb={{
          items: [
            { title: intl.formatMessage({ id: 'pages.inventory.logistics' }) },
            { title: intl.formatMessage({ id: 'pages.inventory.title' }) },
          ],
        }}
      >
        <ProTable<InventoryItem>
          actionRef={actionRef}
          rowKey="stockNo"
          search={false}
          columns={columns}
          request={async () => {
            // Mock data
            const mockData: InventoryItem[] = Array.from({ length: 20 }, (_, i) => ({
              stockNo: `STK${String(10000 + i).padStart(5, '0')}`,
              center: ['위해', '청도', '광저우'][i % 3],
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
              mailbox: `MB${String(100 + i).padStart(3, '0')}`,
              memberName: ['김철수', '이영희', '박민수'][i % 3],
              customsItem: ['【도어벨】', '【가구】', '【의류】'][i % 3],
              productName: ['Doorbell', 'Furniture', 'Clothing'][i % 3],
              trackingNumber: `430232739952772341${i}`,
              color: ['블랙', '화이트', '레드'][i % 3],
              size: ['L', 'M', 'XL'][i % 3],
              quantity: Math.floor(Math.random() * 10) + 1,
              unitPrice: Math.random() * 50 + 10,
              totalAmount: 0,
              rackNumber: `A-${String(Math.floor(i / 10) + 1).padStart(2, '0')}-${String((i % 10) + 1).padStart(2, '0')}`,
              previousRackNumber: i > 0 ? `A-${String(Math.floor((i - 1) / 10) + 1).padStart(2, '0')}-${String(((i - 1) % 10) + 1).padStart(2, '0')}` : '-',
              registrationDate: '2025-11-21',
              modificationDate: '2025-11-22',
              stockStatus: ['사용가능', '사용중', '보류'][i % 3],
              productStatus: ['정상', '문제'][i % 2],
            })).map(item => ({
              ...item,
              totalAmount: item.quantity * item.unitPrice,
            }));

            return {
              data: mockData,
              success: true,
              total: mockData.length,
            };
          }}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </PageContainer>
    </>
  );
};

export default InventoryManagement;
