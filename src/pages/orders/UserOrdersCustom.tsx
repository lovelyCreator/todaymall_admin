// src/pages/orders/UserOrdersCustom.tsx

import {
  AlertOutlined,
  ClearOutlined,
  EyeOutlined,
  HistoryOutlined,
  HomeOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
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
import React, { useState } from 'react';
import OrderLogModal from '@/components/OrderLogModal';
import UserInfoModal from '@/components/UserInfoModal';

const { Text } = Typography;
const { Option } = Select;

/* ==================== 상태 그룹 상수 ==================== */
export const STATUS_GROUPS = [
  {
    title: '구매대행',
    icon: <ShoppingCartOutlined style={{ color: '#722ed1' }} />,
    items: [
      { label: '임시저장', count: 143, code: 'BUY_TEMP' },
      { label: '구매견적', count: 8, code: 'BUY_EST' },
    ],
  },
  {
    title: '입/출고',
    icon: <HomeOutlined style={{ color: '#1890ff' }} />,
    items: [{ label: '입고완료', count: 86, code: 'WH_IN_DONE' }],
  },
  {
    title: '오류',
    icon: <AlertOutlined style={{ color: '#ff4d4f' }} />,
    items: [{ label: '오류입고', count: 37, code: 'ERR_IN' }],
  },
  {
    title: '반품관리',
    icon: <UndoOutlined style={{ color: '#fa541c' }} />,
    items: [{ label: '반품신청', count: 3, code: 'RETURN_REQ' }],
  },
  {
    title: '재고관리',
    icon: <StockOutlined style={{ color: '#52c41a' }} />,
    items: [{ label: '사용가능', count: 4, code: 'STOCK_OK' }],
  },
];

const UserOrders: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>('일반 회원 주문');
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);
  const [modalPosition, setModalPosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [orderLogVisible, setOrderLogVisible] = useState(false);
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>('');
  const [orderLogs, setOrderLogs] = useState<any[]>([]);

  const getSelectedCount = (): number => {
    if (!selectedCode) return 285430;
    const found = STATUS_GROUPS.flatMap((g) => g.items).find(
      (i) => i.code === selectedCode,
    );
    return found ? Math.floor(found.count * 0.65) : 285430;
  };

  const handleStatusClick = (groupTitle: string, item: any) => {
    setSelectedCode(item.code);
    setSelectedLabel(`${groupTitle} > ${item.label}`);
  };

  const handleClearFilter = () => {
    setSelectedCode(null);
    setSelectedLabel('일반 회원 주문');
  };

  const handleViewOrderLog = (orderNo: string) => {
    setSelectedOrderNo(orderNo);
    setOrderLogs([
      {
        timestamp: '2025-11-26 15:30:25',
        status: '주문완료',
        action: '주문이 접수되었습니다',
        user: '시스템',
      },
      {
        timestamp: '2025-11-26 15:35:10',
        status: '결제완료',
        action: '결제가 완료되었습니다',
        user: '홍길동',
      },
    ]);
    setOrderLogVisible(true);
  };

  const handleStatusChange = (orderNo: string, newStatus: string) => {
    message.success(
      `주문 ${orderNo}의 상태가 ${newStatus}(으)로 변경되었습니다`,
    );
  };

  const toggleExpand = (key: React.Key) => {
    if (expandedRowKeys.includes(key)) {
      setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
    } else {
      setExpandedRowKeys([...expandedRowKeys, key]);
    }
  };

  // Mock data
  const mockData = Array.from({ length: 10 }, (_, i) => ({
    key: `order-${i}`,
    orderNo: `USR20251126${String(10000 + i).padStart(5, '0')}`,
    userName: ['홍길동', '김철수', '이영희'][i % 3],
    progressStatus: ['임시저장', '구매견적', '결제완료'][i % 3],
    createdAt: '2025-11-26 14:32',
    updatedAt: '2025-11-26 18:45',
    additionalService: '검수 서비스, 사진 촬영',
    logisticsRequest: '빠른 배송 요청',
    adminMemo: '고객 VIP, 우선 처리',
  }));

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
      <PageContainer
        title={
          <Space>
            일반 회원 주문
            <Tag color={selectedCode ? 'blue' : 'green'}>
              {selectedLabel} ({getSelectedCount().toLocaleString()}건)
            </Tag>
          </Space>
        }
        extra={
          selectedCode && (
            <Button icon={<ClearOutlined />} onClick={handleClearFilter}>
              전체 보기
            </Button>
          )
        }
      >
        {/* 상태 카드 */}
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          {STATUS_GROUPS.map((group) => (
            <Col flex="1 1 20%" key={group.title}>
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
                              userCount === 0 ? '#d9d9d9' : '#595959',
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

        {/* Custom 2-Row Table */}
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #f0f0f0',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <th
                    style={{
                      padding: '12px 8px',
                      border: '1px solid #f0f0f0',
                      textAlign: 'center',
                      width: '60px',
                    }}
                  >
                    No
                  </th>
                  <th
                    style={{
                      padding: '12px 8px',
                      border: '1px solid #f0f0f0',
                      textAlign: 'center',
                      width: '200px',
                    }}
                  >
                    주문번호
                  </th>
                  <th
                    style={{
                      padding: '12px 8px',
                      border: '1px solid #f0f0f0',
                      textAlign: 'center',
                      width: '120px',
                    }}
                  >
                    회원명/구분
                  </th>
                  <th
                    style={{
                      padding: '12px 8px',
                      border: '1px solid #f0f0f0',
                      textAlign: 'center',
                      width: '150px',
                    }}
                  >
                    진행상태
                  </th>
                  <th
                    style={{
                      padding: '12px 8px',
                      border: '1px solid #f0f0f0',
                      textAlign: 'center',
                      width: '150px',
                    }}
                  >
                    등록일/수정일
                  </th>
                  <th
                    style={{
                      padding: '12px 8px',
                      border: '1px solid #f0f0f0',
                      textAlign: 'center',
                      width: '200px',
                    }}
                  >
                    기능
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((record, index) => {
                  const isExpanded = expandedRowKeys.includes(record.key);
                  return (
                    <React.Fragment key={record.key}>
                      {/* First Row - Main Data */}
                      <tr
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? '#ffffff' : '#fafafa',
                        }}
                      >
                        <td
                          style={{
                            padding: '12px 8px',
                            border: '1px solid #f0f0f0',
                            textAlign: 'center',
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: '12px 8px',
                            border: '1px solid #f0f0f0',
                          }}
                        >
                          <Space
                            direction="vertical"
                            size={4}
                            style={{ width: '100%' }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                              }}
                            >
                              <Button
                                size="small"
                                type="text"
                                icon={
                                  isExpanded ? (
                                    <MinusOutlined />
                                  ) : (
                                    <PlusOutlined />
                                  )
                                }
                                onClick={() => toggleExpand(record.key)}
                              />
                              <strong style={{ color: '#1890ff' }}>
                                {record.orderNo}
                              </strong>
                            </div>
                            <Space size={4}>
                              <Button
                                size="small"
                                icon={<EyeOutlined />}
                                type="link"
                              >
                                주문보기
                              </Button>
                              <Button
                                size="small"
                                icon={<HistoryOutlined />}
                                type="link"
                                onClick={() =>
                                  handleViewOrderLog(record.orderNo)
                                }
                              >
                                로그
                              </Button>
                            </Space>
                          </Space>
                        </td>
                        <td
                          style={{
                            padding: '12px 8px',
                            border: '1px solid #f0f0f0',
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              setModalPosition({
                                x: e.clientX - 300,
                                y: e.clientY,
                              });
                              setSelectedUserInfo({
                                userName: record.userName,
                                userId: 'user12345',
                                memberType: '일반',
                                mailbox: 'WH12345',
                                registrationDate: '2024-03-20',
                                totalOrders: 50,
                                totalAmount: 2500000,
                                phone: '010-9876-5432',
                                email: 'user@example.com',
                                address: '서울시 송파구 올림픽로 123',
                              });
                              setUserModalVisible(true);
                            }}
                          >
                            <div
                              style={{
                                fontSize: 12,
                                color: '#1890ff',
                                textDecoration: 'underline',
                              }}
                            >
                              {record.userName}
                            </div>
                            <Tag
                              color="blue"
                              style={{ fontSize: 10, marginTop: 2 }}
                            >
                              일반
                            </Tag>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '12px 8px',
                            border: '1px solid #f0f0f0',
                            textAlign: 'center',
                          }}
                        >
                          <Select
                            size="small"
                            value={record.progressStatus}
                            style={{ width: '100%' }}
                            onChange={(value) =>
                              handleStatusChange(record.orderNo, value)
                            }
                          >
                            <Option value="임시저장">임시저장</Option>
                            <Option value="구매견적">구매견적</Option>
                            <Option value="결제대기">결제대기</Option>
                            <Option value="결제완료">결제완료</Option>
                            <Option value="구매중">구매중</Option>
                            <Option value="구매최종완료">구매최종완료</Option>
                          </Select>
                        </td>
                        <td
                          style={{
                            padding: '12px 8px',
                            border: '1px solid #f0f0f0',
                            textAlign: 'center',
                            fontSize: 11,
                          }}
                        >
                          <div>{record.createdAt}</div>
                          <div style={{ color: '#888', marginTop: 2 }}>
                            {record.updatedAt}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '12px 8px',
                            border: '1px solid #f0f0f0',
                            textAlign: 'center',
                          }}
                        >
                          <Space size={4} wrap>
                            <Button size="small" type="primary">
                              주문복사
                            </Button>
                            <Button size="small">주문문의</Button>
                            <Button size="small" danger>
                              반품
                            </Button>
                          </Space>
                        </td>
                      </tr>

                      {/* Second Row - Additional Info (shown when expanded) */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={6}
                            style={{
                              padding: 0,
                              border: '1px solid #f0f0f0',
                              backgroundColor: '#f9f9f9',
                            }}
                          >
                            <table
                              style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      padding: '8px',
                                      width: '150px',
                                      backgroundColor: '#f5f5f5',
                                      border: '1px solid #e8e8e8',
                                      fontWeight: 'bold',
                                      fontSize: 12,
                                    }}
                                  >
                                    부가서비스
                                  </td>
                                  <td
                                    style={{
                                      padding: '8px',
                                      border: '1px solid #e8e8e8',
                                    }}
                                  >
                                    <Input.TextArea
                                      defaultValue={record.additionalService}
                                      autoSize={{ minRows: 1, maxRows: 2 }}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: 12,
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      padding: '8px',
                                      backgroundColor: '#f5f5f5',
                                      border: '1px solid #e8e8e8',
                                      fontWeight: 'bold',
                                      fontSize: 12,
                                    }}
                                  >
                                    물류센터 요청사항
                                  </td>
                                  <td
                                    style={{
                                      padding: '8px',
                                      border: '1px solid #e8e8e8',
                                    }}
                                  >
                                    <Input.TextArea
                                      defaultValue={record.logisticsRequest}
                                      autoSize={{ minRows: 1, maxRows: 2 }}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: 12,
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      padding: '8px',
                                      backgroundColor: '#f5f5f5',
                                      border: '1px solid #e8e8e8',
                                      fontWeight: 'bold',
                                      fontSize: 12,
                                    }}
                                  >
                                    관리자 메모
                                  </td>
                                  <td
                                    style={{
                                      padding: '8px',
                                      border: '1px solid #e8e8e8',
                                    }}
                                  >
                                    <Input.TextArea
                                      defaultValue={record.adminMemo}
                                      autoSize={{ minRows: 1, maxRows: 2 }}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: 12,
                                      }}
                                      placeholder="관리자 메모를 입력하세요..."
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Space>
              <span>총 {mockData.length}건</span>
              <Button size="small">이전</Button>
              <Button size="small" type="primary">
                1
              </Button>
              <Button size="small">다음</Button>
            </Space>
          </div>
        </Card>
      </PageContainer>
    </>
  );
};

export default UserOrders;
