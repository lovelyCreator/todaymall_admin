import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
  QrcodeOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
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
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';

const { Option } = Select;

interface RackItem {
  id: string;
  rackCode: string;
  warehouse: string;
  zone: string;
  row: string;
  column: string;
  level: string;
  capacity: number;
  currentLoad: number;
  status: 'available' | 'full' | 'maintenance' | 'reserved';
  productCount: number;
  lastUpdated: string;
  temperature?: string;
  humidity?: string;
}

const RackManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<RackItem | null>(null);
  const [form] = Form.useForm();

  // Statistics
  const totalRacks = 1250;
  const availableRacks = 856;
  const fullRacks = 324;
  const maintenanceRacks = 70;

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: RackItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: RackItem) => {
    Modal.confirm({
      title: '랙 삭제',
      content: `"${record.rackCode}" 랙을 삭제하시겠습니까?`,
      onOk: () => {
        message.success('랙이 삭제되었습니다');
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const _values = await form.validateFields();
      if (editingItem) {
        message.success('랙 정보가 수정되었습니다');
      } else {
        message.success('랙이 등록되었습니다');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrintQR = (record: RackItem) => {
    message.success(`${record.rackCode} QR 코드 출력 준비 중...`);
  };

  const columns: ProColumns<RackItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '랙 코드',
      dataIndex: 'rackCode',
      width: 150,
      render: (text, record) => (
        <Space>
          <strong style={{ color: '#1890ff', fontSize: 14 }}>{text}</strong>
          <Button
            size="small"
            icon={<QrcodeOutlined />}
            type="link"
            onClick={() => handlePrintQR(record)}
          />
        </Space>
      ),
    },
    {
      title: '창고',
      dataIndex: 'warehouse',
      width: 120,
      valueType: 'select',
      valueEnum: {
        weihai: { text: '위해창고', status: 'Processing' },
        qingdao: { text: '청도창고', status: 'Success' },
        guangzhou: { text: '광저우창고', status: 'Warning' },
        yiwu: { text: '이우창고', status: 'Default' },
      },
      render: (_, record) => {
        const colors = {
          weihai: 'blue',
          qingdao: 'green',
          guangzhou: 'orange',
          yiwu: 'purple',
        };
        return (
          <Tag color={colors[record.warehouse as keyof typeof colors]}>{_}</Tag>
        );
      },
    },
    {
      title: '구역',
      dataIndex: 'zone',
      width: 100,
      valueType: 'select',
      valueEnum: {
        A: 'A구역',
        B: 'B구역',
        C: 'C구역',
        D: 'D구역',
        E: 'E구역',
      },
    },
    {
      title: '위치',
      dataIndex: 'location',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>
            <strong>행:</strong> {record.row} | <strong>열:</strong>{' '}
            {record.column}
          </div>
          <div style={{ color: '#888' }}>
            <strong>층:</strong> {record.level}
          </div>
        </div>
      ),
    },
    {
      title: '행',
      dataIndex: 'row',
      hideInTable: true,
    },
    {
      title: '열',
      dataIndex: 'column',
      hideInTable: true,
    },
    {
      title: '층',
      dataIndex: 'level',
      hideInTable: true,
    },
    {
      title: '용량',
      dataIndex: 'capacity',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        const percentage = (record.currentLoad / record.capacity) * 100;
        const color =
          percentage >= 90
            ? '#ff4d4f'
            : percentage >= 70
              ? '#faad14'
              : '#52c41a';
        return (
          <div>
            <div style={{ fontSize: 12 }}>
              <strong>{record.currentLoad}</strong> / {record.capacity} 개
            </div>
            <div style={{ fontSize: 11, color }}>
              {percentage.toFixed(0)}% 사용중
            </div>
          </div>
        );
      },
    },
    {
      title: '상품 수',
      dataIndex: 'productCount',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <Tag color="blue">{record.productCount.toLocaleString()}개</Tag>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: 120,
      valueType: 'select',
      valueEnum: {
        available: { text: '사용가능', status: 'Success' },
        full: { text: '만석', status: 'Error' },
        maintenance: { text: '점검중', status: 'Warning' },
        reserved: { text: '예약됨', status: 'Processing' },
      },
      render: (_, record) => {
        const icons = {
          available: <CheckCircleOutlined />,
          full: <WarningOutlined />,
          maintenance: <WarningOutlined />,
          reserved: <InboxOutlined />,
        };
        return (
          <Space>
            {icons[record.status]}
            {_}
          </Space>
        );
      },
    },
    {
      title: '환경',
      dataIndex: 'environment',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 11 }}>
          {record.temperature && <div>온도: {record.temperature}</div>}
          {record.humidity && <div>습도: {record.humidity}</div>}
        </div>
      ),
    },
    {
      title: '최종 업데이트',
      dataIndex: 'lastUpdated',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>{record.lastUpdated}</div>
      ),
    },
    {
      title: '작업',
      width: 180,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<InboxOutlined />} type="link">
            재고보기
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
            disabled={record.productCount > 0}
          >
            삭제
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="전체 랙"
              value={totalRacks}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="사용 가능"
              value={availableRacks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${totalRacks}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="만석"
              value={fullRacks}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="점검중"
              value={maintenanceRacks}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <ProTable<RackItem>
        headerTitle="랙 관리"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button key="export">랙 현황 내보내기</Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            랙 추가
          </Button>,
        ]}
        request={async (_params) => {
          // Mock data
          const warehouses = ['weihai', 'qingdao', 'guangzhou', 'yiwu'];
          const zones = ['A', 'B', 'C', 'D', 'E'];
          const statuses: Array<
            'available' | 'full' | 'maintenance' | 'reserved'
          > = ['available', 'full', 'maintenance', 'reserved'];

          const mockData: RackItem[] = Array.from({ length: 50 }, (_, i) => {
            const warehouse = warehouses[i % 4];
            const zone = zones[i % 5];
            const row = String(Math.floor(i / 5) + 1).padStart(2, '0');
            const column = String((i % 10) + 1).padStart(2, '0');
            const level = String((i % 5) + 1);
            const capacity = 100;
            const currentLoad = Math.floor(Math.random() * 120);
            const status = currentLoad >= capacity ? 'full' : statuses[i % 4];

            return {
              id: `RACK${1000 + i}`,
              rackCode: `${zone}-${row}-${column}-${level}`,
              warehouse,
              zone,
              row,
              column,
              level,
              capacity,
              currentLoad: Math.min(currentLoad, capacity),
              status,
              productCount: Math.floor(Math.random() * 50),
              lastUpdated: `2025-11-${String((i % 28) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
              temperature: i % 3 === 0 ? `${15 + (i % 10)}°C` : undefined,
              humidity: i % 3 === 0 ? `${40 + (i % 20)}%` : undefined,
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

      <Modal
        title={editingItem ? '랙 정보 수정' : '랙 추가'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="warehouse" label="창고" rules={[{ required: true }]}>
            <Select placeholder="창고 선택">
              <Option value="weihai">위해창고</Option>
              <Option value="qingdao">청도창고</Option>
              <Option value="guangzhou">광저우창고</Option>
              <Option value="yiwu">이우창고</Option>
            </Select>
          </Form.Item>
          <Form.Item name="zone" label="구역" rules={[{ required: true }]}>
            <Select placeholder="구역 선택">
              <Option value="A">A구역</Option>
              <Option value="B">B구역</Option>
              <Option value="C">C구역</Option>
              <Option value="D">D구역</Option>
              <Option value="E">E구역</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="row" label="행" rules={[{ required: true }]}>
                <Input placeholder="예: 01" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="column" label="열" rules={[{ required: true }]}>
                <Input placeholder="예: 05" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="level" label="층" rules={[{ required: true }]}>
                <Input placeholder="예: 3" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="capacity"
            label="최대 용량"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} placeholder="개수" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="상태" rules={[{ required: true }]}>
            <Select placeholder="상태 선택">
              <Option value="available">사용가능</Option>
              <Option value="full">만석</Option>
              <Option value="maintenance">점검중</Option>
              <Option value="reserved">예약됨</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default RackManagement;
