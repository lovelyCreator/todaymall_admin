// src/pages/products/list.tsx

import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useIntl, useNavigate } from '@umijs/max';
import { Button, Image, message, Popconfirm, Space, Tag } from 'antd';
import React, { useRef } from 'react';

const ProductList: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const navigate = useNavigate();

  // 중국 차단 100% 회피 + 고화질 랜덤 상품 이미지 (Picsum + LoremFlickr 조합)
  const getRandomProductImage = () => {
    // 80% 확률로 Picsum (가장 빠르고 안정적)
    if (Math.random() < 0.8) {
      const seed = Date.now() + Math.floor(Math.random() * 1000000);
      return `https://picsum.photos/seed/tao${seed}/400/400.webp`;
    }
    // 20% 확률로 키워드 기반 실사 이미지 (LoremFlickr)
    const keywords = [
      'fashion',
      'clothes',
      'shoes',
      'bag',
      'cosmetics',
      'electronics',
      'toy',
      'home decor',
      'kitchen',
      'jXewelry',
      'watch',
      'sneakers',
      'winter jacket',
      'teddy bear',
      'air fryer',
      'led lamp',
    ];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    return `https://loremflickr.com/400/400/${keyword}?random=${Math.random()}`;
  };

  const generateMockData = () => {
    const statusList = ['selling', 'stopped', 'outOfStock', 'reviewing'];
    const categories = [
      'fashion',
      'beauty',
      'living',
      'digital',
      'food',
      'sports',
      'toy',
      'appliance',
    ];

    const titles = [
      '겨울 오리털 패딩 점퍼 (3color)',
      '노이즈캔슬링 블루투스 이어폰',
      '대형 곰돌이 인형 120cm',
      'LED 무드등 북유럽 스타일',
      '아이폰 16 프로 맥스 풀커버 케이스',
      '기초화장품 5종 세트',
      '접이식 캠핑 의자 2개 세트',
      '에어프라이어 6L 대용량',
      '니트 롱 원피스 겨울용',
      '스킨케어 앰플 30ml x 5개',
      '나이키 에어맥스 스니커즈',
      '루이비통 스타일 명품 가방',
    ];

    return Array.from({ length: 58 }, (_, i) => ({
      id: 10000 + i,
      title: titles[i % titles.length] || `타오바오 인기상품 ${i + 1}번`,
      originUrl: `https://item.taobao.com/item.htm?id=${6789000000 + i}`,
      price: Math.floor(Math.random() * 500000) + 15000,
      stock: Math.floor(Math.random() * 300),
      salesCount: Math.floor(Math.random() * 1500),
      status: statusList[Math.floor(Math.random() * statusList.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      createdAt: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      thumbnail: getRandomProductImage(), // ← 중국 차단 완전 회피!
    }));
  };

  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'pages.products.list.thumbnail' }),
      dataIndex: 'thumbnail',
      hideInSearch: true,
      width: 100,
      render: (_, record) => (
        <Image
          width={72}
          height={72}
          src={record.thumbnail}
          style={{
            objectFit: 'cover',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          preview={{
            mask: (
              <div style={{ borderRadius: 8 }}>
                {intl.formatMessage({ id: 'pages.products.list.preview' })}
              </div>
            ),
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.list.productName' }),
      dataIndex: 'title',
      copyable: true,
      ellipsis: true,
      width: 320,
      render: (_, record) => (
        <a
          onClick={() => navigate(`/products/edit/${record.id}`)}
          style={{ fontWeight: 500 }}
        >
          {record.title}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.list.category' }),
      dataIndex: 'category',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        fashion: {
          text: intl.formatMessage({
            id: 'pages.products.list.category.fashion',
          }),
        },
        beauty: {
          text: intl.formatMessage({
            id: 'pages.products.list.category.beauty',
          }),
        },
        living: {
          text: intl.formatMessage({
            id: 'pages.products.list.category.living',
          }),
        },
        digital: {
          text: intl.formatMessage({
            id: 'pages.products.list.category.digital',
          }),
        },
        food: {
          text: intl.formatMessage({ id: 'pages.products.list.category.food' }),
        },
        sports: {
          text: intl.formatMessage({
            id: 'pages.products.list.category.sports',
          }),
        },
        toy: {
          text: intl.formatMessage({ id: 'pages.products.list.category.toy' }),
        },
        appliance: {
          text: intl.formatMessage({
            id: 'pages.products.list.category.appliance',
          }),
        },
      },
      render: (_, record) =>
        intl.formatMessage({
          id: `pages.products.list.category.${record.category}`,
        }),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.list.price' }),
      dataIndex: 'price',
      valueType: 'money',
      sorter: (a, b) => a.price - b.price,
      render: (_, record) => (
        <strong style={{ fontSize: 15 }}>
          {record.price.toLocaleString()}
          {intl.formatMessage({ id: 'pages.home.won' })}
        </strong>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.list.stock' }),
      dataIndex: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (_, record) => (
        <span
          style={{
            fontWeight: 600,
            color: record.stock < 10 ? '#ff4d4f' : '#52c41a',
          }}
        >
          {record.stock < 10
            ? intl.formatMessage(
                { id: 'pages.products.list.lowStock' },
                { stock: record.stock },
              )
            : record.stock}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.list.salesCount' }),
      dataIndex: 'salesCount',
      sorter: (a, b) => a.salesCount - b.salesCount,
      render: (_, record) => record.salesCount.toLocaleString(),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.list.status' }),
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        selling: {
          text: intl.formatMessage({
            id: 'pages.products.list.status.selling',
          }),
          status: 'Success',
        },
        stopped: {
          text: intl.formatMessage({
            id: 'pages.products.list.status.stopped',
          }),
          status: 'Error',
        },
        outOfStock: {
          text: intl.formatMessage({
            id: 'pages.products.list.status.outOfStock',
          }),
          status: 'Warning',
        },
        reviewing: {
          text: intl.formatMessage({
            id: 'pages.products.list.status.reviewing',
          }),
          status: 'Processing',
        },
      },
      render: (_, record) => (
        <Tag
          color={
            (
              {
                selling: 'green',
                stopped: 'red',
                outOfStock: 'orange',
                reviewing: 'blue',
              } as Record<string, string>
            )[record.status]
          }
        >
          {intl.formatMessage({
            id: `pages.products.list.status.${record.status}`,
          })}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.list.createdAt' }),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.list.actions' }),
      valueType: 'option',
      width: 140,
      render: (_, record) => (
        <Space split="|">
          <a onClick={() => navigate(`/products/edit/${record.id}`)}>
            <EditOutlined />{' '}
            {intl.formatMessage({ id: 'pages.products.list.edit' })}
          </a>
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.products.list.deleteConfirm',
            })}
            onConfirm={() => {
              message.success(
                intl.formatMessage({ id: 'pages.products.list.deleteSuccess' }),
              );
              actionRef.current?.reload();
            }}
          >
            <a style={{ color: '#ff4d4f' }}>
              <DeleteOutlined />{' '}
              {intl.formatMessage({ id: 'pages.products.list.delete' })}
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'pages.products.list.title' })}
      extra={[
        <Button
          key="import"
          onClick={() => navigate('/products/import-taobao')}
        >
          {intl.formatMessage({ id: 'pages.products.list.importTaobao' })}
        </Button>,
        <Button key="export" icon={<ExportOutlined />}>
          {intl.formatMessage({ id: 'pages.products.list.exportExcel' })}
        </Button>,
        <Button
          type="primary"
          key="add"
          icon={<PlusOutlined />}
          onClick={() => navigate('/products/add')}
        >
          {intl.formatMessage({ id: 'pages.products.list.addProduct' })}
        </Button>,
      ]}
    >
      <ProTable
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          await new Promise((r) => setTimeout(r, 600));
          const data = generateMockData();
          return { data, success: true, total: 1234 };
        }}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showTotal: (total) =>
            intl.formatMessage(
              { id: 'pages.products.list.totalProducts' },
              { total: total.toLocaleString() },
            ),
        }}
        search={{ labelWidth: 'auto', span: 6 }}
        options={{ density: true, fullScreen: true, setting: true }}
        toolBarRender={false}
        rowSelection={{}}
        tableAlertOptionRender={({ selectedRowKeys }) => (
          <Space>
            <Popconfirm
              title={intl.formatMessage(
                { id: 'pages.products.list.batchDeleteConfirm' },
                { count: selectedRowKeys.length },
              )}
              onConfirm={() => {
                message.success(
                  intl.formatMessage({
                    id: 'pages.products.list.batchDeleteSuccess',
                  }),
                );
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <Button danger type="primary" size="small">
                {intl.formatMessage({ id: 'pages.products.list.batchDelete' })}
              </Button>
            </Popconfirm>
          </Space>
        )}
      />
    </PageContainer>
  );
};

export default ProductList;
