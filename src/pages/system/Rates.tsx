import {
  DollarOutlined,
  HistoryOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  message,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import React, { useState } from 'react';

const Rates: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      const _values = await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        message.success('환율 및 관세 설정이 저장되었습니다');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const exchangeRateHistory = [
    { date: '2025-11-27', rate: 1350, change: +5 },
    { date: '2025-11-26', rate: 1345, change: -3 },
    { date: '2025-11-25', rate: 1348, change: +8 },
    { date: '2025-11-24', rate: 1340, change: +2 },
    { date: '2025-11-23', rate: 1338, change: -4 },
  ];

  const historyColumns = [
    {
      title: '날짜',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '환율',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => `¥1 = ${rate}원`,
    },
    {
      title: '변동',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => (
        <Tag color={change >= 0 ? 'green' : 'red'}>
          {change >= 0 ? '+' : ''}
          {change}원
        </Tag>
      ),
    },
  ];

  return (
    <PageContainer title="환율/관세 설정">
      {/* Current Rates */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="현재 환율 (위안화)"
              value={1350}
              prefix="¥1 ="
              suffix="원"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="기본 관세율"
              value={8}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="부가세율"
              value={10}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Alert
        message="환율 및 관세 안내"
        description="환율은 매일 자동으로 업데이트되며, 수동으로 조정할 수 있습니다. 관세율은 상품 카테고리별로 다르게 적용될 수 있습니다."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={16}>
        <Col span={12}>
          <Card title="환율 설정" extra={<DollarOutlined />}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                cnyRate: 1350,
                usdRate: 1300,
                jpyRate: 900,
                eurRate: 1450,
              }}
            >
              <Form.Item
                name="cnyRate"
                label="위안화 (CNY)"
                rules={[{ required: true, message: '환율을 입력하세요' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  addonBefore="¥1 ="
                  addonAfter="원"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>

              <Form.Item
                name="usdRate"
                label="달러 (USD)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  addonBefore="$1 ="
                  addonAfter="원"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>

              <Form.Item
                name="jpyRate"
                label="엔화 (JPY)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  addonBefore="¥100 ="
                  addonAfter="원"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>

              <Form.Item
                name="eurRate"
                label="유로 (EUR)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  addonBefore="€1 ="
                  addonAfter="원"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="관세 설정" style={{ marginBottom: 16 }}>
            <Form
              layout="vertical"
              initialValues={{
                basicTariff: 8,
                vat: 10,
                specialTariff: 13,
                luxuryTariff: 20,
              }}
            >
              <Form.Item
                name="basicTariff"
                label="기본 관세율"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  addonAfter="%"
                />
              </Form.Item>

              <Form.Item
                name="vat"
                label="부가세율 (VAT)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  addonAfter="%"
                />
              </Form.Item>

              <Form.Item name="specialTariff" label="특별 관세율 (전자제품)">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  addonAfter="%"
                />
              </Form.Item>

              <Form.Item name="luxuryTariff" label="사치품 관세율">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  addonAfter="%"
                />
              </Form.Item>
            </Form>
          </Card>

          <Card
            title={
              <Space>
                <HistoryOutlined />
                환율 변동 내역
              </Space>
            }
          >
            <Table
              dataSource={exchangeRateHistory}
              columns={historyColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Space size="large">
          <Button size="large" onClick={() => form.resetFields()}>
            초기화
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
          >
            저장
          </Button>
        </Space>
      </div>
    </PageContainer>
  );
};

export default Rates;
