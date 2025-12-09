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
  DatePicker,
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
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface BannerItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
  order: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  clicks: number;
  views: number;
}

const Banners: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerItem | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = (record: BannerItem) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
    });
    setModalVisible(true);
  };

  const handleDelete = (record: BannerItem) => {
    Modal.confirm({
      title: '배너 삭제',
      content: `"${record.title}" 배너를 삭제하시겠습니까?`,
      onOk: () => {
        message.success('배너가 삭제되었습니다');
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const _values = await form.validateFields();
      if (editingItem) {
        message.success('배너가 수정되었습니다');
      } else {
        message.success('배너가 등록되었습니다');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns: ProColumns<BannerItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '배너 이미지',
      dataIndex: 'imageUrl',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <Image
          src={record.imageUrl}
          width={120}
          height={60}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '배너명',
      dataIndex: 'title',
      width: 200,
      render: (_, record) => <strong>{record.title}</strong>,
    },
    {
      title: '노출 위치',
      dataIndex: 'position',
      width: 120,
      valueType: 'select',
      valueEnum: {
        main_top: '메인 상단',
        main_middle: '메인 중단',
        main_bottom: '메인 하단',
        sidebar: '사이드바',
      },
      render: (_, _record) => <Tag color="blue">{_}</Tag>,
    },
    {
      title: '노출 순서',
      dataIndex: 'order',
      width: 100,
      hideInSearch: true,
      sorter: true,
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
      title: '조회수',
      dataIndex: 'views',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => record.views.toLocaleString(),
    },
    {
      title: '클릭수',
      dataIndex: 'clicks',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => record.clicks.toLocaleString(),
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: { text: '활성', status: 'Success' },
        inactive: { text: '비활성', status: 'Default' },
        expired: { text: '만료', status: 'Warning' },
      },
    },
    {
      title: '작업',
      width: 180,
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
    <PageContainer title="배너/이벤트 관리">
      <ProTable<BannerItem>
        headerTitle="배너 목록"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            배너 등록
          </Button>,
        ]}
        request={async (_params) => {
          const mockData: BannerItem[] = Array.from({ length: 10 }, (_, i) => ({
            id: `BNR${String(1000 + i).padStart(4, '0')}`,
            title: `${['신규회원 할인', '무료배송', '타임세일', '시즌 특가'][i % 4]} 이벤트`,
            imageUrl: `https://via.placeholder.com/400x200?text=Banner+${i + 1}`,
            linkUrl: `https://example.com/event/${i + 1}`,
            position: ['main_top', 'main_middle', 'main_bottom', 'sidebar'][
              i % 4
            ] as any,
            order: i + 1,
            startDate: '2025-11-01',
            endDate: '2025-12-31',
            status:
              i % 3 === 0 ? 'inactive' : i % 5 === 0 ? 'expired' : 'active',
            clicks: Math.floor(Math.random() * 5000),
            views: Math.floor(Math.random() * 50000),
          }));

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
        title={editingItem ? '배너 수정' : '배너 등록'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="배너명"
            rules={[{ required: true, message: '배너명을 입력하세요' }]}
          >
            <Input placeholder="배너명" />
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
              <Option value="sidebar">사이드바</Option>
            </Select>
          </Form.Item>

          <Form.Item name="imageUrl" label="배너 이미지">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>이미지 업로드</div>
                </div>
              )}
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
            name="dateRange"
            label="게시 기간"
            rules={[{ required: true, message: '게시 기간을 선택하세요' }]}
          >
            <RangePicker style={{ width: '100%' }} />
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

          <Form.Item
            name="status"
            label="상태"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="활성" unCheckedChildren="비활성" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Banners;
