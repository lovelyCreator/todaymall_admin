import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Form, Input, Modal, message, Select, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  author: string;
  content: string;
  status: 'published' | 'draft' | 'hidden';
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const ArticleManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ArticleItem | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ArticleItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: ArticleItem) => {
    Modal.confirm({
      title: '게시글 삭제',
      content: `"${record.title}" 게시글을 삭제하시겠습니까?`,
      onOk: () => {
        message.success('게시글이 삭제되었습니다');
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const _values = await form.validateFields();
      if (editingItem) {
        message.success('게시글이 수정되었습니다');
      } else {
        message.success('게시글이 등록되었습니다');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns: ProColumns<ArticleItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '제목',
      dataIndex: 'title',
      width: 300,
      render: (_, record) => (
        <strong style={{ color: '#1890ff' }}>{record.title}</strong>
      ),
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      width: 120,
      valueType: 'select',
      valueEnum: {
        notice: { text: '공지사항', status: 'Error' },
        news: { text: '뉴스', status: 'Processing' },
        guide: { text: '이용가이드', status: 'Success' },
        event: { text: '이벤트', status: 'Warning' },
        faq: { text: 'FAQ', status: 'Default' },
      },
      render: (_, record) => {
        const colors = {
          notice: 'red',
          news: 'blue',
          guide: 'green',
          event: 'orange',
          faq: 'purple',
        };
        return (
          <Tag color={colors[record.category as keyof typeof colors]}>{_}</Tag>
        );
      },
    },
    {
      title: '작성자',
      dataIndex: 'author',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        published: { text: '게시중', status: 'Success' },
        draft: { text: '임시저장', status: 'Default' },
        hidden: { text: '숨김', status: 'Warning' },
      },
    },
    {
      title: '태그',
      dataIndex: 'tags',
      width: 200,
      hideInSearch: true,
      render: (_, record) => (
        <Space size={4}>
          {record.tags.map((tag) => (
            <Tag key={tag} color="cyan">
              {tag}
            </Tag>
          ))}
        </Space>
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
      title: '좋아요',
      dataIndex: 'likes',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => record.likes.toLocaleString(),
    },
    {
      title: '댓글',
      dataIndex: 'comments',
      width: 100,
      hideInSearch: true,
      render: (_, record) => record.comments.toLocaleString(),
    },
    {
      title: '작성일',
      dataIndex: 'createdAt',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>{record.createdAt}</div>
      ),
    },
    {
      title: '수정일',
      dataIndex: 'updatedAt',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12, color: '#888' }}>{record.updatedAt}</div>
      ),
    },
    {
      title: '작업',
      width: 180,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />} type="link">
            보기
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
      <ProTable<ArticleItem>
        headerTitle="게시글 관리"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            게시글 작성
          </Button>,
        ]}
        request={async (_params) => {
          // Mock data
          const mockData: ArticleItem[] = Array.from(
            { length: 20 },
            (_, i) => ({
              id: `ART${1000 + i}`,
              title: `${['신규 서비스 오픈 안내', '배송 지연 공지', '타오바오 구매 가이드', '할인 이벤트', 'FAQ 업데이트'][i % 5]}`,
              category: ['notice', 'news', 'guide', 'event', 'faq'][
                i % 5
              ] as any,
              author: ['관리자', '운영팀', '고객센터'][i % 3],
              content: '게시글 내용입니다...',
              status: ['published', 'draft', 'hidden'][i % 3] as any,
              views: Math.floor(Math.random() * 10000),
              likes: Math.floor(Math.random() * 500),
              comments: Math.floor(Math.random() * 100),
              createdAt: `2025-11-${String((i % 28) + 1).padStart(2, '0')} 10:30`,
              updatedAt: `2025-11-${String((i % 28) + 1).padStart(2, '0')} 15:45`,
              tags: ['중요', '필독', '이벤트'].slice(0, (i % 3) + 1),
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
        title={editingItem ? '게시글 수정' : '게시글 작성'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="제목"
            rules={[{ required: true, message: '제목을 입력하세요' }]}
          >
            <Input placeholder="게시글 제목" />
          </Form.Item>
          <Form.Item
            name="category"
            label="카테고리"
            rules={[{ required: true }]}
          >
            <Select placeholder="카테고리 선택">
              <Option value="notice">공지사항</Option>
              <Option value="news">뉴스</Option>
              <Option value="guide">이용가이드</Option>
              <Option value="event">이벤트</Option>
              <Option value="faq">FAQ</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="내용"
            rules={[{ required: true, message: '내용을 입력하세요' }]}
          >
            <TextArea rows={10} placeholder="게시글 내용을 입력하세요" />
          </Form.Item>
          <Form.Item name="tags" label="태그">
            <Select mode="tags" placeholder="태그 입력 (Enter로 추가)">
              <Option value="중요">중요</Option>
              <Option value="필독">필독</Option>
              <Option value="이벤트">이벤트</Option>
              <Option value="긴급">긴급</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="상태" rules={[{ required: true }]}>
            <Select placeholder="상태 선택">
              <Option value="published">게시중</Option>
              <Option value="draft">임시저장</Option>
              <Option value="hidden">숨김</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ArticleManagement;
