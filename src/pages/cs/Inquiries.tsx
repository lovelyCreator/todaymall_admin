// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
// 1:1 문의 관리 페이지
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExportOutlined,
  MessageOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  message,
  Row,
  Space,
  Statistic,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';

const { TextArea } = Input;

interface InquiryItem {
  id: string;
  memberId: string;
  memberName: string;
  category: string;
  title: string;
  content: string;
  status: 'pending' | 'answered' | 'closed';
  createdAt: string;
  answeredAt?: string;
  answeredBy?: string;
  answer?: string;
  priority: 'high' | 'normal' | 'low';
}

const Inquiries: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InquiryItem | null>(null);
  const [form] = Form.useForm();

  const handleViewDetail = (record: InquiryItem) => {
    setSelectedItem(record);
    setDetailModalVisible(true);
  };

  const handleAnswer = (record: InquiryItem) => {
    setSelectedItem(record);
    form.resetFields();
    setAnswerModalVisible(true);
  };

  const handleSubmitAnswer = async () => {
    try {
      const _values = await form.validateFields();
      message.success('답변이 등록되었습니다');
      setAnswerModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns: ProColumns<InquiryItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '회원정보',
      dataIndex: 'memberName',
      width: 150,
      render: (_, record) => (
        <div>
          <div>
            <strong>{record.memberName}</strong>
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.memberId}</div>
        </div>
      ),
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      width: 120,
      valueType: 'select',
      valueEnum: {
        order: { text: '주문문의', status: 'Processing' },
        product: { text: '상품문의', status: 'Success' },
        delivery: { text: '배송문의', status: 'Warning' },
        payment: { text: '결제문의', status: 'Error' },
        etc: { text: '기타', status: 'Default' },
      },
      render: (_, record) => {
        const colors: Record<string, string> = {
          order: 'blue',
          product: 'green',
          delivery: 'orange',
          payment: 'red',
          etc: 'default',
        };
        const texts: Record<string, string> = {
          order: '주문문의',
          product: '상품문의',
          delivery: '배송문의',
          payment: '결제문의',
          etc: '기타',
        };
        return (
          <Tag color={colors[record.category]}>{texts[record.category]}</Tag>
        );
      },
    },
    {
      title: '제목',
      dataIndex: 'title',
      width: 300,
      ellipsis: true,
      render: (_, record) => (
        <a onClick={() => handleViewDetail(record)}>{record.title}</a>
      ),
    },
    {
      title: '우선순위',
      dataIndex: 'priority',
      width: 100,
      valueType: 'select',
      valueEnum: {
        high: { text: '높음', status: 'Error' },
        normal: { text: '보통', status: 'Success' },
        low: { text: '낮음', status: 'Default' },
      },
      render: (_, record) => {
        const colors: Record<string, string> = {
          high: 'red',
          normal: 'blue',
          low: 'default',
        };
        const texts: Record<string, string> = {
          high: '높음',
          normal: '보통',
          low: '낮음',
        };
        return (
          <Tag color={colors[record.priority]}>{texts[record.priority]}</Tag>
        );
      },
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        pending: { text: '대기중', status: 'Warning' },
        answered: { text: '답변완료', status: 'Success' },
        closed: { text: '종료', status: 'Default' },
      },
      render: (_, record) => {
        const config: Record<
          string,
          { color: string; icon: React.ReactNode; text: string }
        > = {
          pending: {
            color: 'orange',
            icon: <ClockCircleOutlined />,
            text: '대기중',
          },
          answered: {
            color: 'green',
            icon: <CheckCircleOutlined />,
            text: '답변완료',
          },
          closed: {
            color: 'default',
            icon: <CheckCircleOutlined />,
            text: '종료',
          },
        };
        const item = config[record.status];
        return (
          <Tag icon={item.icon} color={item.color}>
            {item.text}
          </Tag>
        );
      },
    },
    {
      title: '문의일시',
      dataIndex: 'createdAt',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>{record.createdAt}</div>
      ),
    },
    {
      title: '답변일시',
      dataIndex: 'answeredAt',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12, color: '#888' }}>
          {record.answeredAt || '-'}
        </div>
      ),
    },
    {
      title: '작업',
      width: 150,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<SearchOutlined />}
            type="link"
            onClick={() => handleViewDetail(record)}
          >
            상세
          </Button>
          {record.status === 'pending' && (
            <Button
              size="small"
              icon={<MessageOutlined />}
              type="link"
              onClick={() => handleAnswer(record)}
            >
              답변
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="1:1 문의 관리">
      {/* 통계 카드 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="전체 문의"
              value={1234}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="대기중"
              value={45}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="답변완료"
              value={1089}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="평균 응답시간"
              value={2.5}
              suffix="시간"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <ProTable<InquiryItem>
        headerTitle="문의 목록"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button key="export" icon={<ExportOutlined />}>
            엑셀 다운로드
          </Button>,
        ]}
        request={async (_params) => {
          // Mock data
          const categories = ['order', 'product', 'delivery', 'payment', 'etc'];
          const statuses: Array<'pending' | 'answered' | 'closed'> = [
            'pending',
            'answered',
            'closed',
          ];
          const priorities: Array<'high' | 'normal' | 'low'> = [
            'high',
            'normal',
            'low',
          ];

          const mockData: InquiryItem[] = Array.from({ length: 50 }, (_, i) => {
            const status = statuses[i % 3];
            return {
              id: `INQ${String(10000 + i).padStart(6, '0')}`,
              memberId: `user${1000 + (i % 20)}`,
              memberName: `회원${(i % 20) + 1}`,
              category: categories[i % 5],
              title: `문의 제목 ${i + 1} - 샘플 문의입니다`,
              content: `문의 내용입니다. 상세한 문의 내용이 여기에 표시됩니다. ${i + 1}`,
              status,
              createdAt: `2025-11-${String((i % 28) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
              answeredAt:
                status !== 'pending'
                  ? `2025-11-${String((i % 28) + 1).padStart(2, '0')} ${String((i % 24) + 2).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`
                  : undefined,
              answeredBy: status !== 'pending' ? '관리자' : undefined,
              answer:
                status !== 'pending'
                  ? `답변 내용입니다. 상세한 답변이 여기에 표시됩니다. ${i + 1}`
                  : undefined,
              priority: priorities[i % 3],
            };
          });

          return { data: mockData, success: true, total: mockData.length };
        }}
        columns={columns}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
      />

      {/* 상세 모달 */}
      <Modal
        title="문의 상세"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            닫기
          </Button>,
          selectedItem?.status === 'pending' && (
            <Button
              key="answer"
              type="primary"
              onClick={() => {
                setDetailModalVisible(false);
                handleAnswer(selectedItem);
              }}
            >
              답변하기
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedItem && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="문의 ID" span={2}>
                {selectedItem.id}
              </Descriptions.Item>
              <Descriptions.Item label="회원명">
                {selectedItem.memberName}
              </Descriptions.Item>
              <Descriptions.Item label="회원 ID">
                {selectedItem.memberId}
              </Descriptions.Item>
              <Descriptions.Item label="카테고리">
                <Tag color="blue">{selectedItem.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="우선순위">
                <Tag
                  color={
                    {
                      high: 'red',
                      normal: 'blue',
                      low: 'default',
                    }[selectedItem.priority]
                  }
                >
                  {
                    {
                      high: '높음',
                      normal: '보통',
                      low: '낮음',
                    }[selectedItem.priority]
                  }
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="상태" span={2}>
                <Badge
                  status={
                    {
                      pending: 'warning',
                      answered: 'success',
                      closed: 'default',
                    }[selectedItem.status] as any
                  }
                  text={
                    {
                      pending: '대기중',
                      answered: '답변완료',
                      closed: '종료',
                    }[selectedItem.status]
                  }
                />
              </Descriptions.Item>
              <Descriptions.Item label="문의일시" span={2}>
                {selectedItem.createdAt}
              </Descriptions.Item>
            </Descriptions>

            <Card title="문의 내용" size="small">
              <div style={{ padding: '12px 0' }}>
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ fontSize: 16 }}>{selectedItem.title}</strong>
                </div>
                <div style={{ lineHeight: 1.8, color: '#666' }}>
                  {selectedItem.content}
                </div>
              </div>
            </Card>

            {selectedItem.answer && (
              <Card title="답변 내용" size="small">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="답변자">
                    {selectedItem.answeredBy}
                  </Descriptions.Item>
                  <Descriptions.Item label="답변일시">
                    {selectedItem.answeredAt}
                  </Descriptions.Item>
                  <Descriptions.Item label="답변">
                    <div style={{ lineHeight: 1.8 }}>{selectedItem.answer}</div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Space>
        )}
      </Modal>

      {/* 답변 모달 */}
      <Modal
        title={`답변 작성 - ${selectedItem?.title}`}
        open={answerModalVisible}
        onCancel={() => setAnswerModalVisible(false)}
        onOk={handleSubmitAnswer}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="문의 내용">
            <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
              <div style={{ padding: '8px 0' }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>{selectedItem?.title}</strong>
                </div>
                <div style={{ color: '#666', fontSize: 14 }}>
                  {selectedItem?.content}
                </div>
              </div>
            </Card>
          </Form.Item>

          <Form.Item
            name="answer"
            label="답변 내용"
            rules={[{ required: true, message: '답변 내용을 입력하세요' }]}
          >
            <TextArea
              rows={8}
              placeholder="답변 내용을 입력하세요"
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Inquiries;
