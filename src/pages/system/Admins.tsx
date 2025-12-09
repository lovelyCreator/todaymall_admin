import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SafetyOutlined,
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
  Tabs,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useAdmins, useCreateAdmin, useUpdateAdmin, useDeleteAdmin } from '@/hooks/useAdmins';
import { getAdmins } from '@/services/ant-design-pro/api';
import type { API } from '@/services/ant-design-pro/typings';

const { Option } = Select;
const { TextArea } = Input;

interface AdminItem {
  id: string;
  _id?: string;
  username?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
  isActive?: boolean;
}

const Admins: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminItem | null>(null);
  const [form] = Form.useForm();
  // React Query hooks
  const createAdminMutation = useCreateAdmin();
  const updateAdminMutation = useUpdateAdmin();
  const deleteAdminMutation = useDeleteAdmin();
  
  // Use query for initial load and cache management
  const { isLoading } = useAdmins({ current: 1, pageSize: 20 });

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: AdminItem) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      status: record.status === 'active' || record.isActive,
    });
    setModalVisible(true);
  };

  const handleDelete = (record: AdminItem) => {
    const adminId = record._id || record.id;
    if (!adminId) {
      message.error('관리자 ID를 찾을 수 없습니다');
      return;
    }

    Modal.confirm({
      title: '관리자 삭제',
      content: `"${record.name}" 관리자를 삭제하시겠습니까?`,
      onOk: () => {
        deleteAdminMutation.mutate(adminId, {
          onSuccess: () => {
            actionRef.current?.reload();
          },
        });
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingItem) {
        // Update existing admin
        const adminId = editingItem._id || editingItem.id;
        if (!adminId) {
          message.error('관리자 ID를 찾을 수 없습니다');
          return;
        }

        const updateData: API.UpdateAdminParams = {
          email: values.email,
          name: values.name,
          role: values.role,
          permissions: values.permissions || [],
          isActive: values.status === 'active' || values.status === true,
        };

        // Only include password if it's provided
        if (values.password) {
          updateData.password = values.password;
        }

        updateAdminMutation.mutate(
          { id: adminId, data: updateData },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
              actionRef.current?.reload();
            },
          },
        );
      } else {
        // Create new admin
        const createData: API.CreateAdminParams = {
          email: values.email,
          password: values.password,
          name: values.name,
          role: values.role,
          permissions: values.permissions || [],
          isActive: values.status === 'active' || values.status === true,
        };

        createAdminMutation.mutate(createData, {
          onSuccess: () => {
            setModalVisible(false);
            form.resetFields();
            actionRef.current?.reload();
          },
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleResetPassword = (record: AdminItem) => {
    Modal.confirm({
      title: '비밀번호 초기화',
      content: `${record.name}의 비밀번호를 초기화하시겠습니까?`,
      onOk: () => {
        message.success(
          '비밀번호가 초기화되었습니다. 임시 비밀번호가 이메일로 발송되었습니다.',
        );
      },
    });
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
      render: (text, record) => (
        <Space>
          <Avatar
            style={{ backgroundColor: '#1890ff' }}
            icon={<UserOutlined />}
          >
            {record.name[0]}
          </Avatar>
          <div>
            <div>
              <strong>{text}</strong>
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
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '전화번호',
      dataIndex: 'phone',
      width: 130,
      hideInSearch: true,
      render: (text) => (
        <Space>
          <PhoneOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '역할',
      dataIndex: 'role',
      width: 120,
      valueType: 'select',
      valueEnum: {
        super_admin: { text: '최고관리자', status: 'Error' },
        admin: { text: '관리자', status: 'Processing' },
        manager: { text: '매니저', status: 'Success' },
        staff: { text: '직원', status: 'Default' },
      },
      render: (_, record) => {
        const roleColors = {
          super_admin: 'red',
          admin: 'blue',
          manager: 'green',
          staff: 'default',
        };
        const roleNames = {
          super_admin: '최고관리자',
          admin: '관리자',
          manager: '매니저',
          staff: '직원',
        };
        return (
          <Tag color={roleColors[record.role as keyof typeof roleColors]}>
            {roleNames[record.role as keyof typeof roleNames]}
          </Tag>
        );
      },
    },
    {
      title: '부서',
      dataIndex: 'department',
      width: 120,
      valueType: 'select',
      valueEnum: {
        management: '경영지원',
        sales: '영업',
        cs: '고객지원',
        logistics: '물류',
        it: 'IT',
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
      },
      render: (_, record) => (
        <Tag
          icon={
            record.status === 'active' ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
          color={record.status === 'active' ? 'success' : 'default'}
        >
          {record.status === 'active' ? '활성' : '비활성'}
        </Tag>
      ),
    },
    {
      title: '최근 로그인',
      dataIndex: 'lastLogin',
      width: 150,
      hideInSearch: true,
      render: (text) => <div style={{ fontSize: 12 }}>{text}</div>,
    },
    {
      title: '등록일',
      dataIndex: 'createdAt',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '작업',
      width: 220,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type="link"
            onClick={() => {
              setSelectedAdmin(record);
              setDetailModalVisible(true);
            }}
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
            초기화
          </Button>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDelete(record)}
            disabled={record.role === 'super_admin'}
          >
            삭제
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="관리자 계정 관리">
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="전체 관리자"
              value={45}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="활성 계정"
              value={42}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="최고관리자"
              value={3}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="이번 달 신규"
              value={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<PlusOutlined />}
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
        request={async (params) => {
          console.log('📋 ProTable request params:', params);
          
          // Update table params to trigger refetch
          setTableParams({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            role: params.role,
            status: params.status,
            name: params.name,
            email: params.email,
          });

          // Wait for data to be fetched
          await refetch();

          if (isLoading) {
            return { data: [], success: true, total: 0 };
          }

          // Map API response to AdminItem format
          const adminItems: AdminItem[] = (adminsData?.data?.admins || []).map((admin) => ({
            id: admin._id || '',
            _id: admin._id,
            name: admin.name || '',
            email: admin.email || '',
            role: admin.role || '',
            status: admin.isActive ? 'active' : 'inactive',
            isActive: admin.isActive,
            createdAt: admin.createdAt || new Date().toISOString(),
            lastLogin: admin.lastLogin,
            permissions: admin.permissions || [],
          }));

          return {
            data: adminItems,
            success: adminsData?.status === 'success',
            total: adminsData?.data?.total || adminItems.length,
          };
        }}
        loading={isLoading}
        columns={columns}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingItem ? '관리자 수정' : '관리자 추가'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="사용자명"
                rules={[{ required: true, message: '사용자명을 입력하세요' }]}
              >
                <Input placeholder="admin001" prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="이름"
                rules={[{ required: true, message: '이름을 입력하세요' }]}
              >
                <Input placeholder="홍길동" />
              </Form.Item>
            </Col>
          </Row>

          {!editingItem && (
            <Form.Item
              name="password"
              label="비밀번호"
              rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
            >
              <Input.Password
                placeholder="비밀번호"
                prefix={<LockOutlined />}
              />
            </Form.Item>
          )}

          {editingItem && (
            <Form.Item
              name="password"
              label="비밀번호 (변경 시에만 입력)"
            >
              <Input.Password
                placeholder="비밀번호를 변경하려면 입력하세요"
                prefix={<LockOutlined />}
              />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="이메일"
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: '올바른 이메일을 입력하세요',
                  },
                ]}
              >
                <Input
                  placeholder="admin@TodayMall.com"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="전화번호"
                rules={[{ required: true }]}
              >
                <Input placeholder="010-1234-5678" prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="role" label="역할" rules={[{ required: true }]}>
                <Select placeholder="역할 선택">
                  <Option value="super_admin">최고관리자</Option>
                  <Option value="admin">관리자</Option>
                  <Option value="manager">매니저</Option>
                  <Option value="staff">직원</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="부서"
                rules={[{ required: true }]}
              >
                <Select placeholder="부서 선택">
                  <Option value="management">경영지원</Option>
                  <Option value="sales">영업</Option>
                  <Option value="cs">고객지원</Option>
                  <Option value="logistics">물류</Option>
                  <Option value="it">IT</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

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

      {/* Detail Modal */}
      <Modal
        title={`관리자 상세 - ${selectedAdmin?.name}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            닫기
          </Button>,
        ]}
        width={700}
      >
        {selectedAdmin && (
          <Tabs
            items={[
              {
                key: 'basic',
                label: '기본 정보',
                children: (
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="ID">
                      {selectedAdmin.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="사용자명">
                      {selectedAdmin.username}
                    </Descriptions.Item>
                    <Descriptions.Item label="이름">
                      {selectedAdmin.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="역할">
                      <Tag color="blue">{selectedAdmin.role}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="이메일" span={2}>
                      {selectedAdmin.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="전화번호">
                      {selectedAdmin.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="부서">
                      {selectedAdmin.department}
                    </Descriptions.Item>
                    <Descriptions.Item label="상태">
                      <Tag
                        color={
                          selectedAdmin.status === 'active'
                            ? 'success'
                            : 'default'
                        }
                      >
                        {selectedAdmin.status === 'active' ? '활성' : '비활성'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="등록일">
                      {selectedAdmin.createdAt}
                    </Descriptions.Item>
                    <Descriptions.Item label="최근 로그인" span={2}>
                      {selectedAdmin.lastLogin}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'permissions',
                label: '권한',
                children: (
                  <div>
                    <Space wrap>
                      {selectedAdmin.permissions.map((perm) => (
                        <Tag key={perm} color="blue">
                          {perm}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default Admins;
