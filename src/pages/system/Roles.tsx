import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  message,
  Space,
  Switch,
  Tag,
  Tree,
} from 'antd';
import React, { useRef, useState } from 'react';

const { TextArea } = Input;

interface RoleItem {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

const Roles: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<RoleItem | null>(null);
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const permissionTree = [
    {
      title: '주문 관리',
      key: 'orders',
      children: [
        { title: '주문 조회', key: 'orders.view' },
        { title: '주문 수정', key: 'orders.edit' },
        { title: '주문 삭제', key: 'orders.delete' },
      ],
    },
    {
      title: '회원 관리',
      key: 'members',
      children: [
        { title: '회원 조회', key: 'members.view' },
        { title: '회원 수정', key: 'members.edit' },
        { title: '회원 삭제', key: 'members.delete' },
      ],
    },
    {
      title: '상품 관리',
      key: 'products',
      children: [
        { title: '상품 조회', key: 'products.view' },
        { title: '상품 등록', key: 'products.create' },
        { title: '상품 수정', key: 'products.edit' },
        { title: '상품 삭제', key: 'products.delete' },
      ],
    },
    {
      title: '정산 관리',
      key: 'settlement',
      children: [
        { title: '정산 조회', key: 'settlement.view' },
        { title: '정산 처리', key: 'settlement.process' },
      ],
    },
    {
      title: '시스템 관리',
      key: 'system',
      children: [
        { title: '관리자 관리', key: 'system.admins' },
        { title: '권한 관리', key: 'system.roles' },
        { title: '시스템 설정', key: 'system.settings' },
      ],
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setSelectedPermissions([]);
    setModalVisible(true);
  };

  const handleEdit = (record: RoleItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setSelectedPermissions(record.permissions);
    setModalVisible(true);
  };

  const handleDelete = (record: RoleItem) => {
    Modal.confirm({
      title: '역할 삭제',
      content: `"${record.name}" 역할을 삭제하시겠습니까?`,
      onOk: () => {
        message.success('역할이 삭제되었습니다');
        actionRef.current?.reload();
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.permissions = selectedPermissions;
      if (editingItem) {
        message.success('역할이 수정되었습니다');
      } else {
        message.success('역할이 추가되었습니다');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns: ProColumns<RoleItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '역할명',
      dataIndex: 'name',
      width: 150,
      render: (_, record) => (
        <strong style={{ color: '#1890ff' }}>{record.name}</strong>
      ),
    },
    {
      title: '역할 코드',
      dataIndex: 'code',
      width: 150,
      render: (_, record) => <Tag color="purple">{record.code}</Tag>,
    },
    {
      title: '설명',
      dataIndex: 'description',
      width: 250,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '사용자 수',
      dataIndex: 'userCount',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => <Tag color="blue">{record.userCount}명</Tag>,
    },
    {
      title: '권한 수',
      dataIndex: 'permissions',
      width: 100,
      hideInSearch: true,
      render: (_, record) => <Tag>{record.permissions.length}개</Tag>,
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
      title: '등록일',
      dataIndex: 'createdAt',
      width: 120,
      hideInSearch: true,
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
            disabled={record.userCount > 0}
          >
            삭제
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="권한 관리">
      <ProTable<RoleItem>
        headerTitle="역할 목록"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            역할 추가
          </Button>,
        ]}
        request={async (_params) => {
          const mockData: RoleItem[] = [
            {
              id: 'ROLE001',
              name: '최고관리자',
              code: 'SUPER_ADMIN',
              description: '모든 권한을 가진 최고 관리자',
              userCount: 3,
              permissions: ['*'],
              status: 'active',
              createdAt: '2024-01-01',
            },
            {
              id: 'ROLE002',
              name: '관리자',
              code: 'ADMIN',
              description: '대부분의 관리 권한을 가진 관리자',
              userCount: 12,
              permissions: ['orders.*', 'members.*', 'products.*'],
              status: 'active',
              createdAt: '2024-01-01',
            },
            {
              id: 'ROLE003',
              name: '매니저',
              code: 'MANAGER',
              description: '주문 및 회원 관리 권한',
              userCount: 18,
              permissions: ['orders.view', 'orders.edit', 'members.view'],
              status: 'active',
              createdAt: '2024-02-15',
            },
            {
              id: 'ROLE004',
              name: 'CS 담당자',
              code: 'CS_STAFF',
              description: '고객 지원 관련 권한',
              userCount: 25,
              permissions: ['orders.view', 'members.view'],
              status: 'active',
              createdAt: '2024-03-01',
            },
          ];

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
        title={editingItem ? '역할 수정' : '역할 추가'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="역할명"
            rules={[{ required: true, message: '역할명을 입력하세요' }]}
          >
            <Input placeholder="예: 관리자" />
          </Form.Item>

          <Form.Item
            name="code"
            label="역할 코드"
            rules={[{ required: true, message: '역할 코드를 입력하세요' }]}
          >
            <Input placeholder="예: ADMIN" />
          </Form.Item>

          <Form.Item name="description" label="설명">
            <TextArea rows={3} placeholder="역할에 대한 설명을 입력하세요" />
          </Form.Item>

          <Form.Item label="권한 설정">
            <Card size="small">
              <Tree
                checkable
                defaultExpandAll
                checkedKeys={selectedPermissions}
                onCheck={(checkedKeys: any) =>
                  setSelectedPermissions(checkedKeys)
                }
                treeData={permissionTree}
              />
            </Card>
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
    </PageContainer>
  );
};

export default Roles;
