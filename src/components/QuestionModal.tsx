import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  PictureOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Image, Input, Modal, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';

const { TextArea } = Input;

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

interface Message {
  id: string;
  date: string;
  author: string;
  content: string;
  isAdmin: boolean;
}

interface Product {
  no: string;
  image: string;
  name: string;
  nameEn: string;
  code: string;
  trackingNo: string;
  orderNo: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  rackNo: string;
  warehouseDate: string;
}

interface QuestionModalProps {
  visible: boolean;
  question: QuestionRecord | null;
  onClose: () => void;
  onSubmit: (answer: string) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  visible,
  question,
  onClose,
  onSubmit,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editorContent, setEditorContent] = useState('');
  const [editorMode, setEditorMode] = useState<'editor' | 'html' | 'text'>(
    'editor',
  );
  const editorRef = useRef<HTMLDivElement>(null);

  // Mock order and product data
  const orderData = {
    orderNo: 'A25B03010',
    applicationType: '배송대행',
    willShip: '지정배송',
    deliveryCenter: '위해',
    transportMethod: '항공',
    receiver: '최한홍',
    trackingCount: 1,
    arrivalCount: 1,
    rackNo: '-',
    status: '입고완료',
    progressStatus: '오유입고',
    date: '2025-11-24 17:17',
  };

  const productData: Product[] = [
    {
      no: '981841',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
      name: '【도어벨】',
      nameEn: 'Doorbell',
      code: '[]',
      trackingNo: '4302327399527723419',
      orderNo: '【商品:小号门铃】¥18.50 * 5 = ¥92.50 ($13.50) 最低:普通装',
      color: '',
      size: '',
      quantity: 5,
      price: 92.5,
      rackNo: '[]',
      warehouseDate: '오유입고',
    },
  ];

  useEffect(() => {
    if (question) {
      const initialMessages: Message[] = [
        {
          id: '1',
          date: question.createdAt,
          author: question.userName,
          content: question.content,
          isAdmin: false,
        },
      ];

      if (question.answer) {
        initialMessages.push({
          id: '2',
          date: question.answeredAt,
          author: question.answeredBy,
          content: question.answer,
          isAdmin: true,
        });
      }

      setMessages(initialMessages);
      setEditorContent('');
    }
  }, [question]);

  const handleSend = () => {
    let content = editorContent;
    if (editorMode === 'editor' && editorRef.current) {
      content = editorRef.current.innerHTML;
    }

    if (!content.trim() || content === '<br>') {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ko-KR'),
      author: '관리자',
      content: content,
      isAdmin: true,
    };

    setMessages([...messages, newMessage]);
    onSubmit(content);
    setEditorContent('');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      setEditorContent(message.content);
      if (editorRef.current) {
        editorRef.current.innerHTML = message.content;
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = `<img src="${e.target?.result}" style="max-width: 100%; height: auto;" />`;
          document.execCommand('insertHTML', false, img);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Order information table columns
  const orderColumns = [
    {
      title: '신청구분',
      dataIndex: 'applicationType',
      key: 'applicationType',
    },
    {
      title: '출고여부',
      dataIndex: 'willShip',
      key: 'willShip',
    },
    {
      title: '배송센터/운송방식',
      key: 'delivery',
      render: () => `${orderData.deliveryCenter}/${orderData.transportMethod}`,
    },
    {
      title: '수취인',
      dataIndex: 'receiver',
      key: 'receiver',
    },
    {
      title: '트래킹수/입고수',
      key: 'tracking',
      render: () => `${orderData.trackingCount}/${orderData.arrivalCount}`,
    },
    {
      title: '랙번호',
      dataIndex: 'rackNo',
      key: 'rackNo',
    },
    {
      title: '입고상태/진행상태',
      key: 'status',
      render: () => (
        <div>
          <Tag color="green">{orderData.status}</Tag>
          <div>{orderData.progressStatus}</div>
        </div>
      ),
    },
    {
      title: '일자',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const productColumns: ColumnsType<Product> = [
    {
      title: '번호',
      dataIndex: 'no',
      width: 80,
      align: 'center',
    },
    {
      title: '이미지',
      dataIndex: 'image',
      width: 100,
      render: (url: string) => <Image src={url} width={60} height={60} />,
    },
    {
      title: (
        <div>
          <div>【통관품목】</div>
          <div>상품명</div>
        </div>
      ),
      width: 150,
      render: (_, record: Product) => (
        <div>
          <div>{record.name}</div>
          {record.nameEn && (
            <div style={{ fontSize: 12, color: '#666' }}>{record.nameEn}</div>
          )}
        </div>
      ),
    },
    {
      title: (
        <div>
          <div>【브랜드/셀러】</div>
          <div>상품코드</div>
        </div>
      ),
      dataIndex: 'code',
      width: 120,
    },
    {
      title: (
        <div>
          <div>[Tracking No]</div>
          <div>Order No</div>
        </div>
      ),
      width: 200,
      render: (_, record: Product) => (
        <div>
          <div style={{ fontSize: 12, wordBreak: 'break-all' }}>
            {record.trackingNo}
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            {record.orderNo}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div>
          <div>【색상】</div>
          <div>사이즈</div>
        </div>
      ),
      width: 100,
      render: (_, record: Product) => (
        <div>
          <div>{record.color || '-'}</div>
          <div>{record.size || '-'}</div>
        </div>
      ),
    },
    {
      title: '단가 * 수량 = 합계',
      width: 150,
      render: (_, record: Product) => (
        <div>
          <div>
            ¥{(record.price / record.quantity).toFixed(2)} * {record.quantity}
          </div>
          <div style={{ fontWeight: 'bold' }}>= ¥{record.price.toFixed(2)}</div>
        </div>
      ),
    },
    {
      title: (
        <div>
          <div>【랙번호】</div>
          <div>이전 랙번호</div>
        </div>
      ),
      dataIndex: 'rackNo',
      width: 120,
    },
    {
      title: '입고상태',
      dataIndex: 'warehouseDate',
      width: 100,
    },
  ];

  if (!question) return null;

  return (
    <Modal
      title={
        <div
          style={{
            background: '#4a5568',
            color: 'white',
            padding: '12px 24px',
            margin: '-20px -24px 0',
            fontSize: 16,
          }}
        >
          주문번호 : {orderData.orderNo}
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={null}
      styles={{
        body: { padding: 0 },
        header: { padding: 0, border: 'none' },
      }}
    >
      <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {/* Order Information Section */}
        <div
          style={{
            padding: 16,
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {/* Order Section Header */}
          <div
            style={{
              background: '#4a5568',
              color: 'white',
              padding: '8px 16px',
              marginBottom: 12,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            주문 정보
          </div>

          {/* Order Details Table */}
          <Table
            columns={orderColumns}
            dataSource={[orderData]}
            pagination={false}
            size="small"
            rowKey="orderNo"
            style={{ background: 'white', marginBottom: 24 }}
          />

          {/* Product Section Header */}
          <div
            style={{
              background: '#4a5568',
              color: 'white',
              padding: '8px 16px',
              marginBottom: 12,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            상품 정보
          </div>

          {/* Product Table */}
          <Table
            columns={productColumns}
            dataSource={productData}
            pagination={false}
            size="small"
            rowKey="no"
            scroll={{ x: 1000 }}
            style={{ background: 'white' }}
          />
        </div>

        {/* Messages Area */}
        <div
          style={{
            padding: 24,
            background: '#f9fafb',
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.isAdmin ? 'flex-end' : 'flex-start',
              }}
            >
              {/* Date Header */}
              <div
                style={{
                  textAlign: 'center',
                  color: '#666',
                  fontSize: 12,
                  marginBottom: 12,
                  width: '100%',
                }}
              >
                {message.date}
              </div>

              {/* Message Card */}
              <div
                style={{
                  background: message.isAdmin ? '#e6f7ff' : 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  padding: 16,
                  maxWidth: '70%',
                }}
              >
                {/* Author */}
                <div
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 12,
                    color: message.isAdmin ? '#1890ff' : '#333',
                  }}
                >
                  {message.author}
                  {message.isAdmin && (
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      관리자
                    </Tag>
                  )}
                </div>

                {/* Content */}
                <div
                  style={{
                    marginBottom: 12,
                    lineHeight: 1.6,
                  }}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />

                {/* Action Buttons */}
                {message.isAdmin && (
                  <Space size="small">
                    <Button
                      size="small"
                      onClick={() => handleEditMessage(message.id)}
                    >
                      수정
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      삭제
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            background: 'white',
            padding: 16,
          }}
        >
          {/* Editor Mode Selector */}
          <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
            <Button
              type={editorMode === 'editor' ? 'primary' : 'default'}
              size="small"
              onClick={() => setEditorMode('editor')}
            >
              에디터
            </Button>
            <Button
              type={editorMode === 'html' ? 'primary' : 'default'}
              size="small"
              onClick={() => setEditorMode('html')}
            >
              HTML
            </Button>
            <Button
              type={editorMode === 'text' ? 'primary' : 'default'}
              size="small"
              onClick={() => setEditorMode('text')}
            >
              텍스트
            </Button>
          </div>

          {/* Editor Toolbar */}
          {editorMode === 'editor' && (
            <div
              style={{
                marginBottom: 8,
                padding: '8px 12px',
                background: '#f5f5f5',
                borderRadius: 4,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Button
                size="small"
                icon={<BoldOutlined />}
                onClick={() => execCommand('bold')}
              />
              <Button
                size="small"
                icon={<ItalicOutlined />}
                onClick={() => execCommand('italic')}
              />
              <Button
                size="small"
                icon={<UnderlineOutlined />}
                onClick={() => execCommand('underline')}
              />
              <div style={{ width: 1, height: 20, background: '#d9d9d9' }} />
              <Button
                size="small"
                icon={<AlignLeftOutlined />}
                onClick={() => execCommand('justifyLeft')}
              />
              <Button
                size="small"
                icon={<AlignCenterOutlined />}
                onClick={() => execCommand('justifyCenter')}
              />
              <Button
                size="small"
                icon={<AlignRightOutlined />}
                onClick={() => execCommand('justifyRight')}
              />
              <div style={{ width: 1, height: 20, background: '#d9d9d9' }} />
              <Button
                size="small"
                icon={<OrderedListOutlined />}
                onClick={() => execCommand('insertOrderedList')}
              />
              <Button
                size="small"
                icon={<UnorderedListOutlined />}
                onClick={() => execCommand('insertUnorderedList')}
              />
              <div style={{ width: 1, height: 20, background: '#d9d9d9' }} />
              <Button
                size="small"
                icon={<PictureOutlined />}
                onClick={handleImageUpload}
              />
            </div>
          )}

          {/* Editor Content */}
          {editorMode === 'editor' && (
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
              style={{
                minHeight: 100,
                padding: 12,
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                background: 'white',
                outline: 'none',
                overflowY: 'auto',
              }}
              data-placeholder="메시지를 입력하세요..."
            />
          )}

          {editorMode === 'html' && (
            <TextArea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
              }}
              rows={4}
              placeholder="HTML 코드를 입력하세요"
            />
          )}

          {editorMode === 'text' && (
            <TextArea
              value={editorContent.replace(/<[^>]*>/g, '')}
              onChange={(e) => setEditorContent(e.target.value)}
              rows={4}
              placeholder="텍스트를 입력하세요"
            />
          )}

          {/* Send Button */}
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <Space>
              <Button onClick={onClose}>닫기</Button>
              <Button type="primary" onClick={handleSend}>
                보내기
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionModal;
