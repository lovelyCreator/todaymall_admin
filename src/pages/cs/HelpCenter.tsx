import {
  CarOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
  SafetyOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  VideoCameraOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Input,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  tags: string[];
  views: number;
}

interface GuideItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  category: string;
}

const HelpCenter: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // FAQ Data
  const faqData: FAQItem[] = [
    {
      question: '타오바오 구매대행은 어떻게 이용하나요?',
      answer:
        '타오바오 상품 링크를 복사하여 우리 사이트에 붙여넣기만 하면 됩니다. 자동으로 상품 정보가 불러와지며, 주문서를 작성하여 결제하시면 구매대행이 시작됩니다.',
      category: 'order',
      tags: ['구매대행', '타오바오', '주문'],
      views: 1250,
    },
    {
      question: '배송비는 어떻게 계산되나요?',
      answer:
        '배송비는 실제 무게와 부피무게 중 큰 값을 기준으로 계산됩니다. 부피무게 = (가로 x 세로 x 높이) / 6000 입니다. 배송 방법(항공, 배, 특송)에 따라 kg당 요금이 다릅니다.',
      category: 'shipping',
      tags: ['배송비', '무게', '계산'],
      views: 2100,
    },
    {
      question: '결제 수단은 무엇이 있나요?',
      answer:
        '신용카드, 체크카드, 계좌이체, 무통장입금, 네이버페이, 카카오페이 등 다양한 결제 수단을 지원합니다.',
      category: 'payment',
      tags: ['결제', '카드', '계좌이체'],
      views: 890,
    },
    {
      question: '환불은 어떻게 받나요?',
      answer:
        '환불 신청 후 중국 판매자가 승인하면 환불이 진행됩니다. 환불 금액은 결제하신 수단으로 3-5영업일 내에 입금됩니다.',
      category: 'refund',
      tags: ['환불', '취소', '반품'],
      views: 1560,
    },
    {
      question: '배송 기간은 얼마나 걸리나요?',
      answer:
        '항공 특송: 3-5일, 일반 항공: 7-10일, 배 특송: 10-14일, 일반 배: 20-30일 정도 소요됩니다. 중국 내 배송 및 통관 상황에 따라 지연될 수 있습니다.',
      category: 'shipping',
      tags: ['배송기간', '항공', '배'],
      views: 3200,
    },
    {
      question: '통관 절차는 어떻게 되나요?',
      answer:
        '상품이 한국에 도착하면 자동으로 통관 절차가 진행됩니다. 개인통관고유부호가 필요하며, 관세 및 부가세가 발생할 수 있습니다.',
      category: 'customs',
      tags: ['통관', '관세', '개인통관고유부호'],
      views: 1780,
    },
  ];

  // Guide Data
  const guideData: GuideItem[] = [
    {
      title: '구매대행 시작하기',
      description: '타오바오 구매대행을 처음 이용하시는 분들을 위한 가이드',
      icon: <ShoppingCartOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      link: '/guide/start',
      category: 'beginner',
    },
    {
      title: '배송 방법 선택',
      description: '항공, 배, 특송 등 배송 방법별 특징과 선택 가이드',
      icon: <CarOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      link: '/guide/shipping',
      category: 'shipping',
    },
    {
      title: '결제 가이드',
      description: '안전한 결제 방법과 결제 관련 문제 해결',
      icon: <CreditCardOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      link: '/guide/payment',
      category: 'payment',
    },
    {
      title: '통관 안내',
      description: '통관 절차와 관세 계산 방법 안내',
      icon: <SafetyOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      link: '/guide/customs',
      category: 'customs',
    },
    {
      title: 'VVIC 하이패스',
      description: 'VVIC 도매시장 빠른 구매 서비스 이용 가이드',
      icon: <RocketOutlined style={{ fontSize: 32, color: '#f759ab' }} />,
      link: '/guide/vvic',
      category: 'advanced',
    },
    {
      title: '비디오 튜토리얼',
      description: '동영상으로 배우는 구매대행 이용 방법',
      icon: <VideoCameraOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />,
      link: '/guide/videos',
      category: 'video',
    },
  ];

  const categories = [
    { key: 'all', label: '전체', icon: <QuestionCircleOutlined /> },
    { key: 'order', label: '주문/구매', icon: <ShoppingCartOutlined /> },
    { key: 'shipping', label: '배송', icon: <CarOutlined /> },
    { key: 'payment', label: '결제', icon: <CreditCardOutlined /> },
    { key: 'refund', label: '환불/반품', icon: <SafetyOutlined /> },
    { key: 'customs', label: '통관', icon: <FileTextOutlined /> },
  ];

  const filteredFAQs = faqData.filter((faq) => {
    const matchCategory =
      activeCategory === 'all' || faq.category === activeCategory;
    const matchSearch =
      searchText === '' ||
      faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchText.toLowerCase()),
      );
    return matchCategory && matchSearch;
  });

  return (
    <PageContainer
      title="고객센터"
      subTitle="무엇을 도와드릴까요?"
      extra={[
        <Button key="contact" type="primary" icon={<CustomerServiceOutlined />}>
          1:1 문의하기
        </Button>,
      ]}
    >
      {/* Search Section */}
      <Card style={{ marginBottom: 24, textAlign: 'center' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3}>
            <SearchOutlined /> 무엇을 도와드릴까요?
          </Title>
          <Search
            placeholder="궁금한 내용을 검색해보세요 (예: 배송비, 환불, 통관)"
            size="large"
            style={{ maxWidth: 600 }}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            enterButton
          />
        </Space>
      </Card>

      {/* Quick Links */}
      <Card title="빠른 가이드" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {guideData.map((guide, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                style={{ height: '100%' }}
                onClick={() => (window.location.href = guide.link)}
              >
                <Space
                  direction="vertical"
                  align="center"
                  style={{ width: '100%' }}
                >
                  {guide.icon}
                  <Title level={5} style={{ margin: '8px 0' }}>
                    {guide.title}
                  </Title>
                  <Text
                    type="secondary"
                    style={{ textAlign: 'center', fontSize: 12 }}
                  >
                    {guide.description}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* FAQ Section */}
      <Card title="자주 묻는 질문 (FAQ)">
        {/* Category Tabs */}
        <Space style={{ marginBottom: 16 }} wrap>
          {categories.map((cat) => (
            <Button
              key={cat.key}
              type={activeCategory === cat.key ? 'primary' : 'default'}
              icon={cat.icon}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </Button>
          ))}
        </Space>

        <Divider />

        {/* FAQ List */}
        {filteredFAQs.length > 0 ? (
          <Collapse
            accordion
            expandIconPosition="end"
            style={{ background: 'transparent', border: 'none' }}
          >
            {filteredFAQs.map((faq, index) => (
              <Panel
                header={
                  <Space>
                    <QuestionCircleOutlined style={{ color: '#1890ff' }} />
                    <Text strong>{faq.question}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      조회 {faq.views.toLocaleString()}
                    </Text>
                  </Space>
                }
                key={index}
                style={{ marginBottom: 8, background: '#fff', borderRadius: 4 }}
              >
                <Paragraph style={{ paddingLeft: 24 }}>{faq.answer}</Paragraph>
                <Space style={{ paddingLeft: 24 }}>
                  {faq.tags.map((tag) => (
                    <Tag key={tag} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </Panel>
            ))}
          </Collapse>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">검색 결과가 없습니다.</Text>
          </div>
        )}
      </Card>

      {/* Contact Section */}
      <Card title="문의하기" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ textAlign: 'center' }}>
              <PhoneOutlined
                style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }}
              />
              <Title level={5}>전화 문의</Title>
              <Text>1588-1234</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                평일 09:00-18:00
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ textAlign: 'center' }}>
              <MailOutlined
                style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }}
              />
              <Title level={5}>이메일 문의</Title>
              <Text>support@TodayMall.com</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                24시간 접수
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ textAlign: 'center' }}>
              <WechatOutlined
                style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }}
              />
              <Title level={5}>카카오톡</Title>
              <Text>@TodayMall</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                평일 09:00-18:00
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ textAlign: 'center' }}>
              <CustomerServiceOutlined
                style={{ fontSize: 32, color: '#722ed1', marginBottom: 8 }}
              />
              <Title level={5}>1:1 문의</Title>
              <Text>실시간 상담</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                로그인 후 이용
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default HelpCenter;
