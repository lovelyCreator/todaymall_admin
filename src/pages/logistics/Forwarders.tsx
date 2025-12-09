import {
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Tabs,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface ForwarderItem {
  id: string;
  name: string;
  code: string;
  type: 'domestic' | 'international';
  apiStatus: 'connected' | 'disconnected' | 'error';
  apiKey: string;
  trackingUrl: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  shippingMethods: string[];
  pricePerKg: number;
  status: 'active' | 'inactive';
  totalOrders: number;
  lastSync: string;
  memo: string;
}

const Forwarders: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ForwarderItem | null>(null);
  const [apiModalVisible, setApiModalVisible] = useState(false);
  const [selectedForwarder, setSelectedForwarder] =
    useState<ForwarderItem | null>(null);
  const [form] = Form.useForm();
  const [apiForm] = Form.useForm();

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ForwarderItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: ForwarderItem) => {
    Modal.confirm({
      title: '배대지 삭제',
      content: `"${record.name}" 배대지를 삭제하시겠습니까?`,
      onOk: () => {
        message.success('배대지가 삭제되었습니다');
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const _values = await form.validateFields();
      if (editingItem) {
        message.success('배대지 정보가 수정되었습니다');
      } else {
        message.success('배대지가 등록되었습니다');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleApiConfig = (record: ForwarderItem) => {
    setSelectedForwarder(record);
    apiForm.setFieldsValue({
      apiKey: record.apiKey,
      trackingUrl: record.trackingUrl,
    });
    setApiModalVisible(true);
  };

  const handleApiTest = async () => {
    message.loading('API 연결 테스트 중...', 2);
    setTimeout(() => {
      message.success('API 연결 성공!');
    }, 2000);
  };

  const handleApiSave = async () => {
    try {
      const _values = await apiForm.validateFields();
      message.success('API 설정이 저장되었습니다');
      setApiModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSync = (record: ForwarderItem) => {
    message.loading('동기화 중...', 1);
    setTimeout(() => {
      message.success(`${record.name} 데이터 동기화 완료`);
      actionRef.current?.reload();
    }, 1500);
  };

  const columns: ProColumns<ForwarderItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '배대지명',
      dataIndex: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <strong style={{ color: '#1890ff' }}>{text}</strong>
          <Tag color={record.type === 'domestic' ? 'blue' : 'green'}>
            {record.type === 'domestic' ? '국내' : '국제'}
          </Tag>
        </Space>
      ),
    },
    {
      title: '배대지 코드',
      dataIndex: 'code',
      width: 120,
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: 'API 상태',
      dataIndex: 'apiStatus',
      width: 120,
      valueType: 'select',
      valueEnum: {
        connected: { text: '연결됨', status: 'Success' },
        disconnected: { text: '미연결', status: 'Default' },
        error: { text: '오류', status: 'Error' },
      },
      render: (_, record) => {
        const statusConfig = {
          connected: {
            color: 'success',
            icon: <CheckCircleOutlined />,
            text: '연결됨',
          },
          disconnected: {
            color: 'default',
            icon: <CloseCircleOutlined />,
            text: '미연결',
          },
          error: {
            color: 'error',
            icon: <CloseCircleOutlined />,
            text: '오류',
          },
        };
        const config = statusConfig[record.apiStatus];
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '배송 방법',
      dataIndex: 'shippingMethods',
      width: 200,
      hideInSearch: true,
      render: (_, record) => (
        <Space size={4} wrap>
          {record.shippingMethods.map((method) => (
            <Tag key={method} color="blue">
              {method}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '단가 (kg당)',
      dataIndex: 'pricePerKg',
      width: 120,
      hideInSearch: true,
      render: (_, record) => `${record.pricePerKg.toLocaleString()}원`,
    },
    {
      title: '담당자',
      dataIndex: 'contactPerson',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '연락처',
      dataIndex: 'phone',
      width: 130,
      hideInSearch: true,
    },
    {
      title: '총 주문수',
      dataIndex: 'totalOrders',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => record.totalOrders.toLocaleString(),
    },
    {
      title: '최종 동기화',
      dataIndex: 'lastSync',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>{record.lastSync}</div>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: { text: '활성', status: 'Success' },
        inactive: { text: '비활성', status: 'Default' },
      },
    },
    {
      title: '작업',
      width: 250,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<ApiOutlined />}
            type="link"
            onClick={() => handleApiConfig(record)}
          >
            API 설정
          </Button>
          <Button
            size="small"
            icon={<SyncOutlined />}
            type="link"
            onClick={() => handleSync(record)}
          >
            동기화
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
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="전체 배대지"
              value={12}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="API 연결"
              value={8}
              suffix="/ 12"
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="이번 달 주문"
              value={1234}
              valueStyle={{ color: '#1890ff' }}
              prefix={<SyncOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="평균 단가"
              value={8500}
              suffix="원/kg"
              prefix="¥"
            />
          </Card>
        </Col>
      </Row>

      <ProTable<ForwarderItem>
        headerTitle="배대지 관리"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            배대지 추가
          </Button>,
        ]}
        request={async (_params) => {
          // Mock data
          const mockData: ForwarderItem[] = [
            {
              id: 'FWD001',
              name: 'CJ대한통운',
              code: 'CJ',
              type: 'domestic',
              apiStatus: 'connected',
              apiKey: 'cj_api_key_xxxxx',
              trackingUrl:
                'https://www.cjlogistics.com/ko/tool/parcel/tracking',
              contactPerson: '김대리',
              phone: '02-1234-5678',
              email: 'cj@example.com',
              address: '서울시 중구 세종대로 39',
              shippingMethods: ['항공', '항공특송'],
              pricePerKg: 8500,
              status: 'active',
              totalOrders: 5234,
              lastSync: '2025-11-27 10:30',
              memo: 'CJ대한통운 메인 계정',
            },
            {
              id: 'FWD002',
              name: '우체국택배',
              code: 'POST',
              type: 'domestic',
              apiStatus: 'connected',
              apiKey: 'post_api_key_xxxxx',
              trackingUrl:
                'https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm',
              contactPerson: '이과장',
              phone: '02-2345-6789',
              email: 'post@example.com',
              address: '서울시 종로구 우정국로 26',
              shippingMethods: ['배', '배특송'],
              pricePerKg: 7800,
              status: 'active',
              totalOrders: 3456,
              lastSync: '2025-11-27 09:15',
              memo: '우체국택배 계정',
            },
            {
              id: 'FWD003',
              name: '한진택배',
              code: 'HANJIN',
              type: 'domestic',
              apiStatus: 'connected',
              apiKey: 'hanjin_api_key_xxxxx',
              trackingUrl:
                'https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do',
              contactPerson: '박부장',
              phone: '02-3456-7890',
              email: 'hanjin@example.com',
              address: '서울시 강남구 테헤란로 152',
              shippingMethods: ['항공', '배'],
              pricePerKg: 8200,
              status: 'active',
              totalOrders: 4123,
              lastSync: '2025-11-27 11:00',
              memo: '한진택배 계정',
            },
            {
              id: 'FWD004',
              name: '로젠택배',
              code: 'LOGEN',
              type: 'domestic',
              apiStatus: 'disconnected',
              apiKey: '',
              trackingUrl: 'https://www.ilogen.com/web/personal/trace',
              contactPerson: '최대리',
              phone: '02-4567-8901',
              email: 'logen@example.com',
              address: '서울시 송파구 올림픽로 289',
              shippingMethods: ['배'],
              pricePerKg: 7500,
              status: 'active',
              totalOrders: 2345,
              lastSync: '2025-11-20 14:30',
              memo: 'API 연동 대기중',
            },
            {
              id: 'FWD005',
              name: 'DHL Express',
              code: 'DHL',
              type: 'international',
              apiStatus: 'connected',
              apiKey: 'dhl_api_key_xxxxx',
              trackingUrl: 'https://www.dhl.com/kr-ko/home/tracking.html',
              contactPerson: 'John Kim',
              phone: '02-5678-9012',
              email: 'dhl@example.com',
              address: '서울시 강남구 영동대로 517',
              shippingMethods: ['항공특송'],
              pricePerKg: 15000,
              status: 'active',
              totalOrders: 1234,
              lastSync: '2025-11-27 08:45',
              memo: 'DHL 국제특송',
            },
            {
              id: 'FWD006',
              name: 'FedEx',
              code: 'FEDEX',
              type: 'international',
              apiStatus: 'error',
              apiKey: 'fedex_api_key_xxxxx',
              trackingUrl: 'https://www.fedex.com/ko-kr/tracking.html',
              contactPerson: 'Sarah Lee',
              phone: '02-6789-0123',
              email: 'fedex@example.com',
              address: '서울시 중구 세종대로 136',
              shippingMethods: ['항공특송'],
              pricePerKg: 14500,
              status: 'active',
              totalOrders: 987,
              lastSync: '2025-11-26 16:20',
              memo: 'API 오류 발생 - 확인 필요',
            },
          ];

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

      {/* Add/Edit Modal */}
      <Modal
        title={editingItem ? '배대지 수정' : '배대지 추가'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Tabs
            items={[
              {
                key: 'basic',
                label: '기본 정보',
                children: (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          label="배대지명"
                          rules={[
                            {
                              required: true,
                              message: '배대지명을 입력하세요',
                            },
                          ]}
                        >
                          <Input placeholder="예: CJ대한통운" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="code"
                          label="배대지 코드"
                          rules={[
                            { required: true, message: '코드를 입력하세요' },
                          ]}
                        >
                          <Input placeholder="예: CJ" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="type"
                          label="유형"
                          rules={[{ required: true }]}
                        >
                          <Select placeholder="유형 선택">
                            <Option value="domestic">국내</Option>
                            <Option value="international">국제</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="pricePerKg"
                          label="단가 (kg당)"
                          rules={[{ required: true }]}
                        >
                          <InputNumber
                            placeholder="0"
                            style={{ width: '100%' }}
                            addonAfter="원"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="shippingMethods"
                      label="배송 방법"
                      rules={[{ required: true }]}
                    >
                      <Select mode="multiple" placeholder="배송 방법 선택">
                        <Option value="항공">항공</Option>
                        <Option value="항공특송">항공특송</Option>
                        <Option value="배">배</Option>
                        <Option value="배특송">배특송</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="address" label="주소">
                      <Input placeholder="배대지 주소" />
                    </Form.Item>
                    <Form.Item
                      name="status"
                      label="상태"
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Switch
                        checkedChildren="활성"
                        unCheckedChildren="비활성"
                      />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: 'contact',
                label: '담당자 정보',
                children: (
                  <>
                    <Form.Item
                      name="contactPerson"
                      label="담당자명"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="담당자명" />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      label="연락처"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="02-1234-5678" />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="이메일"
                      rules={[{ required: true, type: 'email' }]}
                    >
                      <Input placeholder="email@example.com" />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: 'memo',
                label: '메모',
                children: (
                  <Form.Item name="memo" label="관리자 메모">
                    <TextArea rows={6} placeholder="메모를 입력하세요" />
                  </Form.Item>
                ),
              },
            ]}
          />
        </Form>
      </Modal>

      {/* API Configuration Modal */}
      <Modal
        title={
          <Space>
            <ApiOutlined />
            API 설정 - {selectedForwarder?.name}
          </Space>
        }
        open={apiModalVisible}
        onCancel={() => setApiModalVisible(false)}
        onOk={handleApiSave}
        width={700}
      >
        <Alert
          message="API 연동 안내"
          description="배대지 API를 연동하면 운송장 자동 조회 및 배송 상태 실시간 업데이트가 가능합니다."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={apiForm} layout="vertical">
          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[{ required: true, message: 'API Key를 입력하세요' }]}
          >
            <Input.Password
              placeholder="API Key를 입력하세요"
              prefix={<KeyOutlined />}
              iconRender={(visible) => (visible ? '👁️' : '🔒')}
            />
          </Form.Item>

          <Form.Item
            name="trackingUrl"
            label="운송장 조회 URL"
            rules={[
              {
                required: true,
                type: 'url',
                message: '올바른 URL을 입력하세요',
              },
            ]}
          >
            <Input placeholder="https://api.example.com/tracking" />
          </Form.Item>

          <Form.Item name="webhookUrl" label="Webhook URL (선택)">
            <Input placeholder="https://your-domain.com/webhook" />
          </Form.Item>

          <Form.Item name="timeout" label="타임아웃 (초)" initialValue={30}>
            <InputNumber min={5} max={120} style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button
              type="primary"
              icon={<ApiOutlined />}
              onClick={handleApiTest}
            >
              API 연결 테스트
            </Button>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Forwarders;
