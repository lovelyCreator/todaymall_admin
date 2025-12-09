import {
  CarOutlined,
  DollarCircleOutlined,
  FallOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Avatar, Card, Col, List, Progress, Row, Statistic } from 'antd';
import React from 'react';
import CountUp from 'react-countup';

// 임시 mock 데이터 (나중에 API로 교체하면 됨)
const mockData = {
  todayOrders: 487,
  todaySales: 2849200,
  pendingPayment: 23,
  pendingAddress: 12,
  inChinaWarehouse: 89,
  inKoreaDelivery: 156,
  completedToday: 312,
  totalMembers: 18452,
  newMembersToday: 87,
  pendingInquiries: 8,
  processingRate: 94.2,
  salesGrowth: 18.7,
  recentOrders: [
    {
      id: 'OD20251119001',
      user: 'Kim**',
      amount: 128000,
      statusKey: 'paymentComplete',
      timeMinutes: 2,
    },
    {
      id: 'OD20251119002',
      user: 'Lee**',
      amount: 89000,
      statusKey: 'pendingAddress',
      timeMinutes: 5,
    },
    {
      id: 'OD20251119003',
      user: 'Park**',
      amount: 256000,
      statusKey: 'inChinaWarehouse',
      timeMinutes: 12,
    },
    {
      id: 'OD20251119004',
      user: 'Choi**',
      amount: 178000,
      statusKey: 'inTransit',
      timeMinutes: 25,
    },
    {
      id: 'OD20251119005',
      user: 'Jung**',
      amount: 98000,
      statusKey: 'delivered',
      timeMinutes: 41,
    },
  ],
};

const Home: React.FC = () => {
  const intl = useIntl();
  
  // 실제로는 API 호출할 곳
  const { data } = useRequest(() => Promise.resolve(mockData), {
    refreshDeps: [],
  });

  const dashboardData = (data as typeof mockData) || mockData;

  const formatter = (value: number) => <CountUp end={value} separator="," />;
  
  // Helper function to get translated status
  const getStatusText = (statusKey: string) => {
    return intl.formatMessage({ id: `pages.home.status.${statusKey}` });
  };
  
  // Helper function to format time
  const getTimeText = (minutes: number) => {
    if (minutes < 60) {
      return intl.formatMessage(
        { id: 'pages.home.time.minutesAgo' },
        { minutes }
      );
    }
    const hours = Math.floor(minutes / 60);
    return intl.formatMessage(
      { id: 'pages.home.time.hoursAgo' },
      { hours }
    );
  };

  return (
    <PageContainer title={false}>
      {/* 1. 상단 요약 카드 4개 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.home.todayOrders' })}
              value={dashboardData.todayOrders}
              formatter={formatter as any}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              suffix={intl.formatMessage({ id: 'pages.home.count' })}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.home.todaySales' })}
              value={dashboardData.todaySales}
              formatter={formatter as any}
              prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />}
              suffix={intl.formatMessage({ id: 'pages.home.won' })}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.home.processingRate' })}
              value={dashboardData.processingRate}
              precision={1}
              suffix="%"
              prefix={
                dashboardData.processingRate > 90 ? (
                  <RiseOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <FallOutlined style={{ color: '#ff4d4f' }} />
                )
              }
              valueStyle={{
                color:
                  dashboardData.processingRate > 90 ? '#52c41a' : '#ff4d4f',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'pages.home.newMembers' })}
              value={dashboardData.newMembersToday}
              prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
              suffix={intl.formatMessage({ id: 'pages.home.people' })}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 2. 주문 상태별 현황 */}
      <Card title={intl.formatMessage({ id: 'pages.home.orderStatus' })} style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {[
            {
              labelId: 'pages.home.pendingPayment',
              value: dashboardData.pendingPayment,
              color: '#ff4d4f',
              icon: <WarningOutlined />,
            },
            {
              labelId: 'pages.home.pendingAddress',
              value: dashboardData.pendingAddress,
              color: '#fa8c16',
              icon: <SyncOutlined spin />,
            },
            {
              labelId: 'pages.home.inChinaWarehouse',
              value: dashboardData.inChinaWarehouse,
              color: '#1890ff',
              icon: <CarOutlined />,
            },
            {
              labelId: 'pages.home.inKoreaDelivery',
              value: dashboardData.inKoreaDelivery,
              color: '#722ed1',
              icon: <CarOutlined />,
            },
          ].map((item) => (
            <Col xs={12} sm={6} key={item.labelId}>
              <Card hoverable style={{ textAlign: 'center' }}>
                {item.icon} <strong>{intl.formatMessage({ id: item.labelId })}</strong>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: item.color,
                  }}
                >
                  {item.value}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 3. 실시간 주문 목록 + 처리해야 할 문의 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={intl.formatMessage({ id: 'pages.home.recentOrders' })}>
            <List
              itemLayout="horizontal"
              dataSource={dashboardData.recentOrders}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {item.user}
                      </Avatar>
                    }
                    title={<a>{item.id}</a>}
                    description={`${item.amount.toLocaleString()}${intl.formatMessage({ id: 'pages.home.won' })} • ${getStatusText(item.statusKey)}`}
                  />
                  <div>{getTimeText(item.timeMinutes)}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={intl.formatMessage({ id: 'pages.home.pendingTasks' })}
            extra={<a href="/cs/inquiries">{intl.formatMessage({ id: 'pages.home.goTo' })} →</a>}
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <WarningOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
              <div
                style={{ fontSize: 28, fontWeight: 'bold', margin: '16px 0' }}
              >
                {dashboardData.pendingInquiries}{intl.formatMessage({ id: 'pages.home.count' })}
              </div>
              <div style={{ color: '#888' }}>{intl.formatMessage({ id: 'pages.home.pendingInquiries' })}</div>
            </div>
          </Card>

          <Card title={intl.formatMessage({ id: 'pages.home.salesGrowth' })} style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={dashboardData.salesGrowth}
                format={() => `${dashboardData.salesGrowth}%`}
                strokeColor="#52c41a"
                size={120}
              />
              <div
                style={{ marginTop: 16, color: '#52c41a', fontWeight: 'bold' }}
              >
                {intl.formatMessage({ id: 'pages.home.comparedYesterday' })}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Home;
