import { PageContainer } from '@ant-design/pro-components';
import { Button, Input, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import QuestionModal from '@/components/QuestionModal';

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

const OrderQuestions: React.FC = () => {
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
      category: intl.formatMessage({ id: 'pages.orders.orderQuestions.category' }),
      status: intl.formatMessage({ id: 'pages.orders.orderQuestions.answered' }),
      content:
        '선물 기내반입 W1,442,012 → 선물 기내 배송은 결제에 대한 추가비 반영이 안되나요?',
      answer: '안녕하세요. 선물 기내반입의 경우...',
      createdAt: '2025-11-18',
      answeredAt: '2025-11-19',
      answeredBy: '관리자',
    },
    {
      key: '2',
      orderNo: 'A29AIEN947',
      userName: '이영희',
      userId: 'user67890',
      category: '고객문의',
      status: intl.formatMessage({ id: 'pages.orders.orderQuestions.unanswered' }),
      content: '주문한 제품 기내는 보드는 언제 도착하나요?',
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
      category: '고객문의',
      status: intl.formatMessage({ id: 'pages.orders.orderQuestions.answered' }),
      content: '고객님 안녕하십니까 주문 제품 보관은 어떻게 하나요?',
      answer: '보관 서비스는 별도로 신청하셔야 합니다.',
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
      title: intl.formatMessage({ id: 'pages.orders.orderQuestions.orderNo' }),
      dataIndex: 'orderNo',
      width: 140,
      render: (text) => <a>{text}</a>,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.orderQuestions.memberNameId' }),
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.userName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.userId}</div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.orderQuestions.memberManager' }),
      width: 100,
      render: () => '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.orderQuestions.content' }),
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
      title: intl.formatMessage({ id: 'pages.orders.orderQuestions.writer' }),
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.orderQuestions.status' }),
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (status) => {
        const answeredText = intl.formatMessage({
          id: 'pages.orders.orderQuestions.answered',
        });
        const unansweredText = intl.formatMessage({
          id: 'pages.orders.orderQuestions.unanswered',
        });
        return (
          <Tag color={status === answeredText ? 'green' : 'orange'}>{status}</Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.orderQuestions.registeredDate' }),
      dataIndex: 'createdAt',
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'pages.orders.orderQuestions.answerer' }),
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
          {intl.formatMessage({ id: 'pages.orders.orderQuestions.delete' })}
        </Button>
      ),
    },
  ];

  return (
    <PageContainer title={intl.formatMessage({ id: 'pages.orders.orderQuestions.title' })}>
      <div style={{ background: '#fff', padding: 24 }}>
        {/* Search and Filter Section */}
        <Space style={{ marginBottom: 16 }} size="middle">
          <Select
            defaultValue={intl.formatMessage({ id: 'pages.orders.orderQuestions.all' })}
            style={{ width: 120 }}
          >
            <Option value={intl.formatMessage({ id: 'pages.orders.orderQuestions.all' })}>
              {intl.formatMessage({ id: 'pages.orders.orderQuestions.all' })}
            </Option>
            <Option
              value={intl.formatMessage({ id: 'pages.orders.orderQuestions.answered' })}
            >
              {intl.formatMessage({ id: 'pages.orders.orderQuestions.answered' })}
            </Option>
            <Option
              value={intl.formatMessage({ id: 'pages.orders.orderQuestions.unanswered' })}
            >
              {intl.formatMessage({ id: 'pages.orders.orderQuestions.unanswered' })}
            </Option>
          </Select>
          <Select
            defaultValue={intl.formatMessage({
              id: 'pages.orders.orderQuestions.searchByContent',
            })}
            style={{ width: 120 }}
          >
            <Option
              value={intl.formatMessage({
                id: 'pages.orders.orderQuestions.searchByContent',
              })}
            >
              {intl.formatMessage({ id: 'pages.orders.orderQuestions.searchByContent' })}
            </Option>
            <Option
              value={intl.formatMessage({
                id: 'pages.orders.orderQuestions.searchByOrderNo',
              })}
            >
              {intl.formatMessage({ id: 'pages.orders.orderQuestions.searchByOrderNo' })}
            </Option>
            <Option
              value={intl.formatMessage({
                id: 'pages.orders.orderQuestions.searchByMemberName',
              })}
            >
              {intl.formatMessage({ id: 'pages.orders.orderQuestions.searchByMemberName' })}
            </Option>
          </Select>
          <Search
            placeholder={intl.formatMessage({
              id: 'pages.orders.orderQuestions.searchPlaceholder',
            })}
            style={{ width: 300 }}
            onSearch={(value) => console.log(value)}
          />
          <Button type="primary">
            {intl.formatMessage({ id: 'pages.orders.orderQuestions.search' })}
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
      <QuestionModal
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

export default OrderQuestions;
