import { PageContainer } from '@ant-design/pro-components';
import { Button, Input, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import InventoryQuestionModal from '@/components/InventoryQuestionModal';

const { Search } = Input;
const { Option } = Select;

interface QuestionRecord {
  key: string;
  orderNo: string;
  userName: string;
  userId: string;
  category: string;
  status: string;
  content: string;
  answer: string;
  createdAt: string;
  answeredAt: string;
  answeredBy: string;
}

const InventoryQuestions: React.FC = () => {
  const intl = useIntl();
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock data
  const mockData: QuestionRecord[] = [
    {
      key: '1',
      orderNo: 'USR20251168',
      userName: '김철수',
      userId: 'user12345',
      category: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.category' }),
      status: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.answered' }),
      content: '주문한 제품 재고는 보드는 언제 도착하나요? W823,077',
      answer: '재고 확인 결과 11월 25일 입고 예정입니다.',
      createdAt: '2025-11-18',
      answeredAt: '2025-11-19',
      answeredBy: '관리자',
    },
    {
      key: '2',
      orderNo: 'A29AIEN947',
      userName: '이영희',
      userId: 'user67890',
      category: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.category' }),
      status: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.unanswered' }),
      content: '재고 확인 부탁드립니다.',
      answer: '',
      createdAt: '2025-11-17',
      answeredAt: '',
      answeredBy: '',
    },
    {
      key: '3',
      orderNo: 'A29AIEN947',
      userName: '박민수',
      userId: 'user11122',
      category: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.category' }),
      status: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.answered' }),
      content: '상품이 언제쯤 입고될 예정인가요? 빠른 답변 부탁드립니다.',
      answer: '해당 상품은 11월 30일 입고 예정입니다.',
      createdAt: '2025-11-16',
      answeredAt: '2025-11-17',
      answeredBy: '관리자',
    },
  ];

  const columns: ColumnsType<QuestionRecord> = [
    {
      title: 'No',
      dataIndex: 'key',
      width: 60,
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.orderNo' }),
      dataIndex: 'orderNo',
      width: 140,
      render: (text) => <a>{text}</a>,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.memberNameId' }),
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.userName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.userId}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.memberManager' }),
      width: 100,
      render: () => '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.content' }),
      dataIndex: 'content',
      ellipsis: true,
      render: (text, record) => (
        <a
          onClick={() => {
            setSelectedQuestion(record);
            setModalVisible(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.writer' }),
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.status' }),
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (status) => {
        const answeredText = intl.formatMessage({
          id: 'pages.orders.inventoryQuestions.answered',
        });
        const unansweredText = intl.formatMessage({
          id: 'pages.orders.inventoryQuestions.unanswered',
        });
        return (
          <Tag color={status === answeredText ? 'green' : 'orange'}>{status}</Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.registeredDate' }),
      dataIndex: 'createdAt',
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.inventoryQuestions.answerer' }),
      dataIndex: 'answeredBy',
      width: 100,
      render: (text) => text || '-',
    },
    {
      title: '-',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Button
          size="small"
          danger
          onClick={() => {
            console.log('Delete question:', record.key);
          }}
        >
          {intl.formatMessage({ id: 'pages.orders.inventoryQuestions.delete' })}
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'pages.orders.inventoryQuestions.title' })}
    >
      <div style={{ background: '#fff', padding: 24 }}>
        {/* Search and Filter Section */}
        <Space style={{ marginBottom: 16 }} size="middle">
          <Select
            defaultValue={intl.formatMessage({ id: 'pages.orders.inventoryQuestions.all' })}
            style={{ width: 120 }}
          >
            <Option
              value={intl.formatMessage({ id: 'pages.orders.inventoryQuestions.all' })}
            >
              {intl.formatMessage({ id: 'pages.orders.inventoryQuestions.all' })}
            </Option>
            <Option
              value={intl.formatMessage({ id: 'pages.orders.inventoryQuestions.answered' })}
            >
              {intl.formatMessage({ id: 'pages.orders.inventoryQuestions.answered' })}
            </Option>
            <Option
              value={intl.formatMessage({ id: 'pages.orders.inventoryQuestions.unanswered' })}
            >
              {intl.formatMessage({ id: 'pages.orders.inventoryQuestions.unanswered' })}
            </Option>
          </Select>
          <Select
            defaultValue={intl.formatMessage({
              id: 'pages.orders.inventoryQuestions.searchByContent',
            })}
            style={{ width: 120 }}
          >
            <Option
              value={intl.formatMessage({
                id: 'pages.orders.inventoryQuestions.searchByContent',
              })}
            >
              {intl.formatMessage({ id: 'pages.orders.inventoryQuestions.searchByContent' })}
            </Option>
            <Option
              value={intl.formatMessage({
                id: 'pages.orders.inventoryQuestions.searchByOrderNo',
              })}
            >
              {intl.formatMessage({ id: 'pages.orders.inventoryQuestions.searchByOrderNo' })}
            </Option>
            <Option
              value={intl.formatMessage({
                id: 'pages.orders.inventoryQuestions.searchByMemberName',
              })}
            >
              {intl.formatMessage({ id: 'pages.orders.inventoryQuestions.searchByMemberName' })}
            </Option>
          </Select>
          <Search
            placeholder={intl.formatMessage({
              id: 'pages.orders.inventoryQuestions.searchPlaceholder',
            })}
            style={{ width: 300 }}
            onSearch={(value) => console.log(value)}
          />
          <Button type="primary">
            {intl.formatMessage({ id: 'pages.orders.inventoryQuestions.search' })}
          </Button>
        </Space>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={mockData}
          pagination={{
            total: mockData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>

      {/* Question Detail Modal */}
      <InventoryQuestionModal
        visible={modalVisible}
        question={selectedQuestion}
        onClose={() => {
          setModalVisible(false);
          setSelectedQuestion(null);
        }}
        onSubmit={(answer) => {
          console.log('Answer submitted:', answer);
          setModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default InventoryQuestions;
