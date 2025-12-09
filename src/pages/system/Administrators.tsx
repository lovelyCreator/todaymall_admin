// 관리자 계정 관리 페이지 (Case 1 - New Implementation)
import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusOutlined,
  UnlockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  message,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';

const { Option } = Select;

interface AdminItem {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleCode: string;
  department: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

const Administrators: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<AdminItem | null>(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: AdminItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleViewDetail = (record: AdminItem) => {
    setSelectedItem(record);
    setDetailModalVisible(true);
  };

  const handleResetPassword = (record: AdminItem) => {
    setSelectedItem(record);
    passwordForm.resetFields();
    setPasswordModalVisible(true);
  };

  const handleDelete = (record: AdminItem) => {
    Modal.confirm({
      title: '관리자 삭제',
      content: `"${record.name}" 관리자를 삭제하시겠습니까?`,
      onOk: () => {
        message.success('관리자가 삭제되었습니다');
        actionRef.current?.reload();
      },
    });
  };

  const handleToggleStatus = (record: AdminItem) => {
    const newStatus = record.status === 'active' ? 'inactive' : 'active';
    message.success(
      `관리자가 ${newStatus === 'active' ? '활성화' : '비활성화'}되었습니다`,
    );
    actionRef.current?.reload();
  };

  const handleSubmit = async () => {
    try {
      const _values = await form.validateFields();
      if (editingItem) {
        message.success('관리자 정보가 수정되었습니다');
      } else {
        message.success('관리자가 등록되었습니다');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const _values = await passwordForm.validateFields();
      message.success('비밀번호가 재설정되었습니다');
      setPasswordModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns: ProColumns<AdminItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '관리자 정보',
      dataIndex: 'name',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar
            style={{ backgroundColor: '#1890ff' }}
            icon={<UserOutlined />}
          >
            {record.name[0]}
          </Avatar>
          <div>
            <div>
              <strong>{record.name}</strong>
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '이메일',
      dataIndex: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: '전화번호',
      dataIndex: 'phone',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '역할',
      dataIndex: 'role',
      width: 150,
      valueType: 'select',
      valueEnum: {
        최고관리자: { text: '최고관리자', status: 'Error' },
        관리자: { text: '관리자', status: 'Processing' },
        매니저: { text: '매니저', status: 'Success' },
        'CS 담당자': { text: 'CS 담당자', status: 'Default' },
      },
      render: (_, record) => {
        const colors: Record<string, string> = {
          최고관리자: 'red',
          관리자: 'blue',
          매니저: 'green',
          'CS 담당자': 'orange',
        };
        return <Tag color={colors[record.role]}>{record.role}</Tag>;
      },
    },
    {
      title: '부서',
      dataIndex: 'department',
      width: 120,
      valueType: 'select',
      valueEnum: {
        운영팀: '운영팀',
        고객지원팀: '고객지원팀',
        물류팀: '물류팀',
        개발팀: '개발팀',
      },
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: { text: '활성', status: 'Success' },
        inactive: { text: '비활성', status: 'Default' },
        locked: { text: '잠김', status: 'Error' },
      },
      render: (_, record) => {
        const config: Record<string, { color: string; text: string }> = {
          active: { color: 'green', text: '활성' },
          inactive: { color: 'default', text: '비활성' },
          locked: { color: 'red', text: '잠김' },
        };
        const item = config[record.status];
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: '최근 로그인',
      dataIndex: 'lastLogin',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>{record.lastLogin}</div>
      ),
    },
    {
      title: '등록일',
      dataIndex: 'createdAt',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12, color: '#888' }}>{record.createdAt}</div>
      ),
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
            icon={<UserOutlined />}
            type="link"
            onClick={() => handleViewDetail(record)}
          >
            상세
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
            icon={<LockOutlined />}
            type="link"
            onClick={() => handleResetPassword(record)}
          >
            비밀번호
          </Button>
          <Button
            size="small"
            icon={
              record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />
            }
            type="link"
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? '비활성' : '활성'}
          </Button>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDelete(record)}
            disabled={record.roleCode === 'SUPER_ADMIN'}
          >
            삭제
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="관리자 계정 관리">
      {/* 통계 카드 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="전체 관리자"
              value={58}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="활성 계정"
              value={52}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="비활성 계정"
              value={4}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="잠긴 계정"
              value={2}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <ProTable<AdminItem>
        headerTitle="관리자 목록"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            관리자 추가
          </Button>,
        ]}
        request={async (_params) => {
          // Mock data
          const roles = ['최고관리자', '관리자', '매니저', 'CS 담당자'];
          const roleCodes = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CS_STAFF'];
          const departments = ['운영팀', '고객지원팀', '물류팀', '개발팀'];
          const statuses: Array<'active' | 'inactive' | 'locked'> = [
            'active',
            'inactive',
            'locked',
          ];

          const mockData: AdminItem[] = Array.from({ length: 20 }, (_, i) => ({
            id: `ADM${String(1000 + i).padStart(4, '0')}`,
            username: `admin${i + 1}`,
            name: `관리자${i + 1}`,
            email: `admin${i + 1}@example.com`,
            phone: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
            role: roles[i % 4],
            roleCode: roleCodes[i % 4],
            department: departments[i % 4],
            status: i === 0 ? 'active' : statuses[i % 3],
            lastLogin: `2025-11-${String((i % 28) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
            createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-01`,
            permissions: ['orders.*', 'members.*', 'products.*'],
          }));

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

      {/* 등록/수정 모달 */}
      <Modal
        title={editingItem ? '관리자 수정' : '관리자 추가'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="아이디"
            rules={[{ required: true, message: '아이디를 입력하세요' }]}
          >
            <Input placeholder="아이디" disabled={!!editingItem} />
          </Form.Item>

          {!editingItem && (
            <Form.Item
              name="password"
              label="비밀번호"
              rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
            >
              <Input.Password placeholder="비밀번호" />
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="이름"
            rules={[{ required: true, message: '이름을 입력하세요' }]}
          >
            <Input placeholder="이름" />
          </Form.Item>

          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력하세요' },
              { type: 'email', message: '올바른 이메일을 입력하세요' },
            ]}
          >
            <Input placeholder="이메일" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="전화번호"
            rules={[{ required: true, message: '전화번호를 입력하세요' }]}
          >
            <Input placeholder="010-0000-0000" />
          </Form.Item>

          <Form.Item
            name="role"
            label="역할"
            rules={[{ required: true, message: '역할을 선택하세요' }]}
          >
            <Select placeholder="역할 선택">
              <Option value="최고관리자">최고관리자</Option>
              <Option value="관리자">관리자</Option>
              <Option value="매니저">매니저</Option>
              <Option value="CS 담당자">CS 담당자</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="department"
            label="부서"
            rules={[{ required: true, message: '부서를 선택하세요' }]}
          >
            <Select placeholder="부서 선택">
              <Option value="운영팀">운영팀</Option>
              <Option value="고객지원팀">고객지원팀</Option>
              <Option value="물류팀">물류팀</Option>
              <Option value="개발팀">개발팀</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="상태"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="활성" unCheckedChildren="비활성" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 상세 모달 */}
      <Modal
        title="관리자 상세 정보"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            닫기
          </Button>,
        ]}
        width={700}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID" span={2}>
              {selectedItem.id}
            </Descriptions.Item>
            <Descriptions.Item label="아이디">
              {selectedItem.username}
            </Descriptions.Item>
            <Descriptions.Item label="이름">
              {selectedItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="이메일" span={2}>
              {selectedItem.email}
            </Descriptions.Item>
            <Descriptions.Item label="전화번호">
              {selectedItem.phone}
            </Descriptions.Item>
            <Descriptions.Item label="부서">
              {selectedItem.department}
            </Descriptions.Item>
            <Descriptions.Item label="역할">
              <Tag color="blue">{selectedItem.role}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="상태">
              <Tag
                color={
                  {
                    active: 'green',
                    inactive: 'default',
                    locked: 'red',
                  }[selectedItem.status]
                }
              >
                {
                  {
                    active: '활성',
                    inactive: '비활성',
                    locked: '잠김',
                  }[selectedItem.status]
                }
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="최근 로그인">
              {selectedItem.lastLogin}
            </Descriptions.Item>
            <Descriptions.Item label="등록일">
              {selectedItem.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label="권한" span={2}>
              <Space wrap>
                {selectedItem.permissions.map((perm) => (
                  <Tag key={perm} color="purple">
                    {perm}
                  </Tag>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 비밀번호 재설정 모달 */}
      <Modal
        title={`비밀번호 재설정 - ${selectedItem?.name}`}
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        onOk={handlePasswordSubmit}
        width={500}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="newPassword"
            label="새 비밀번호"
            rules={[
              { required: true, message: '새 비밀번호를 입력하세요' },
              { min: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' },
            ]}
          >
            <Input.Password placeholder="새 비밀번호" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="비밀번호 확인"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '비밀번호를 다시 입력하세요' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('비밀번호가 일치하지 않습니다'),
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="비밀번호 확인" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Administrators;
