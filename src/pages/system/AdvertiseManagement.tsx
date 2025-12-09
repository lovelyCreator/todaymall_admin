import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  message,
  Select,
  Space,
  Switch,
  Tag,
  Upload,
} from 'antd';
import React, { useRef, useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface AdvertiseItem {
  id: string;
  title: string;
  type: string;
  position: string;
  imageUrl: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
  order: number;
  clicks: number;
  views: number;
}

const AdvertiseManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<AdvertiseItem | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: AdvertiseItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: AdvertiseItem) => {
    Modal.confirm({
      title: '광고 삭제',
      content: `"${record.title}" 광고를 삭제하시겠습니까?`,
      onOk: () => {
        message.success('광고가 삭제되었습니다');
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const _values = await form.validateFields();
      if (editingItem) {
        message.success('광고가 수정되었습니다');
      } else {
        message.success('광고가 등록되었습니다');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns: ProColumns<AdvertiseItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '광고명',
      dataIndex: 'title',
      width: 200,
      render: (_, record) => <strong>{record.title}</strong>,
    },
    {
      title: '광고 이미지',
      dataIndex: 'imageUrl',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <Image
          src={record.imageUrl}
          width={100}
          height={60}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '광고 유형',
      dataIndex: 'type',
      width: 120,
      valueType: 'select',
      valueEnum: {
        banner: { text: '배너', status: 'Processing' },
        popup: { text: '팝업', status: 'Success' },
        sidebar: { text: '사이드바', status: 'Default' },
      },
      render: (_, record) => {
        const colors = { banner: 'blue', popup: 'green', sidebar: 'orange' };
        return (
          <Tag color={colors[record.type as keyof typeof colors]}>{_}</Tag>
        );
      },
    },
    {
      title: '노출 위치',
      dataIndex: 'position',
      width: 150,
      valueType: 'select',
      valueEnum: {
        main_top: '메인 상단',
        main_middle: '메인 중단',
        main_bottom: '메인 하단',
        product_list: '상품 목록',
        product_detail: '상품 상세',
        order_page: '주문 페이지',
      },
    },
    {
      title: '링크 URL',
      dataIndex: 'linkUrl',
      width: 200,
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => (
        <a href={record.linkUrl} target="_blank" rel="noopener noreferrer">
          {record.linkUrl}
        </a>
      ),
    },
    {
      title: '게시 기간',
      dataIndex: 'dateRange',
      width: 200,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>{record.startDate}</div>
          <div style={{ color: '#888' }}>~ {record.endDate}</div>
        </div>
      ),
    },
    {
      title: '시작일',
      dataIndex: 'startDate',
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: '종료일',
      dataIndex: 'endDate',
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: { text: '활성', status: 'Success' },
        inactive: { text: '비활성', status: 'Default' },
      },
    },
    {
      title: '노출 순서',
      dataIndex: 'order',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '조회수',
      dataIndex: 'views',
      width: 100,
      hideInSearch: true,
      render: (_, record) => record.views.toLocaleString(),
    },
    {
      title: '클릭수',
      dataIndex: 'clicks',
      width: 100,
      hideInSearch: true,
      render: (_, record) => record.clicks.toLocaleString(),
    },
    {
      title: '작업',
      width: 150,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />} type="link">
            미리보기
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          >
            수정
          </Button>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDelete(record)}
          >
            삭제
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<AdvertiseItem>
        headerTitle="광고 관리"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            광고 등록
          </Button>,
        ]}
        request={async (_params) => {
          // Mock data
          const mockData: AdvertiseItem[] = Array.from(
            { length: 15 },
            (_, i) => ({
              id: `AD${1000 + i}`,
              title: `${['신규회원 할인', '무료배송 이벤트', '타임세일', '시즌 특가'][i % 4]} 광고`,
              type: ['banner', 'popup', 'sidebar'][i % 3] as any,
              position: [
                'main_top',
                'main_middle',
                'product_list',
                'product_detail',
              ][i % 4] as any,
              imageUrl: `https://via.placeholder.com/400x200?text=Ad+${i + 1}`,
              linkUrl: `https://example.com/event/${i + 1}`,
              startDate: '2025-11-01',
              endDate: '2025-12-31',
              status: i % 3 === 0 ? 'inactive' : 'active',
              order: i + 1,
              clicks: Math.floor(Math.random() * 5000),
              views: Math.floor(Math.random() * 50000),
            }),
          );

          return { data: mockData, success: true, total: mockData.length };
        }}
        columns={columns}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />

      <Modal
        title={editingItem ? '광고 수정' : '광고 등록'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="광고명"
            rules={[{ required: true, message: '광고명을 입력하세요' }]}
          >
            <Input placeholder="광고명" />
          </Form.Item>
          <Form.Item name="type" label="광고 유형" rules={[{ required: true }]}>
            <Select placeholder="광고 유형 선택">
              <Option value="banner">배너</Option>
              <Option value="popup">팝업</Option>
              <Option value="sidebar">사이드바</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="position"
            label="노출 위치"
            rules={[{ required: true }]}
          >
            <Select placeholder="노출 위치 선택">
              <Option value="main_top">메인 상단</Option>
              <Option value="main_middle">메인 중단</Option>
              <Option value="main_bottom">메인 하단</Option>
              <Option value="product_list">상품 목록</Option>
              <Option value="product_detail">상품 상세</Option>
              <Option value="order_page">주문 페이지</Option>
            </Select>
          </Form.Item>
          <Form.Item name="imageUrl" label="광고 이미지">
            <Upload listType="picture-card" maxCount={1}>
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>이미지 업로드</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            name="linkUrl"
            label="링크 URL"
            rules={[
              {
                required: true,
                type: 'url',
                message: '올바른 URL을 입력하세요',
              },
            ]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item
            name="order"
            label="노출 순서"
            rules={[{ required: true }]}
          >
            <Input
              type="number"
              placeholder="숫자가 작을수록 먼저 노출됩니다"
            />
          </Form.Item>
          <Form.Item name="status" label="상태" valuePropName="checked">
            <Switch checkedChildren="활성" unCheckedChildren="비활성" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AdvertiseManagement;
