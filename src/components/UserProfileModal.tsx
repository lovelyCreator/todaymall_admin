import { Button, Descriptions, Form, Input, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useIntl } from '@umijs/max';

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  onClose,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock user data
  const userData = {
    id: 'admin001',
    grade: '최고관리자',
    name: 'Admin',
    email: 'admin@todaymall.com',
    phone: '010-1234-5678',
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // API call would go here
      console.log('Updated values:', values);
      message.success(intl.formatMessage({ id: 'pages.userProfile.updateSuccess' }));
      onClose();
    } catch (_error) {
      message.error(intl.formatMessage({ id: 'pages.userProfile.updateFailed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'pages.userProfile.modalTitle' })}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ marginBottom: 24 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.userProfile.userId' })}>{userData.id}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.userProfile.grade' })}>{userData.grade}</Descriptions.Item>
        </Descriptions>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={userData}
        onFinish={handleSubmit}
      >
        <Form.Item
          label={intl.formatMessage({ id: 'pages.userProfile.name' })}
          name="name"
          rules={[{ required: true, message: intl.formatMessage({ id: 'pages.userProfile.nameRequired' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.userProfile.namePlaceholder' })} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'pages.userProfile.email' })}
          name="email"
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.userProfile.emailRequired' }) },
            { type: 'email', message: intl.formatMessage({ id: 'pages.userProfile.emailInvalid' }) },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.userProfile.emailPlaceholder' })} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'pages.userProfile.phone' })}
          name="phone"
          rules={[{ required: true, message: intl.formatMessage({ id: 'pages.userProfile.phoneRequired' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.userProfile.phonePlaceholder' })} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'pages.userProfile.newPassword' })}
          name="password"
          rules={[{ min: 6, message: intl.formatMessage({ id: 'pages.userProfile.passwordMinLength' }) }]}
        >
          <Input.Password placeholder={intl.formatMessage({ id: 'pages.userProfile.newPasswordPlaceholder' })} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'pages.userProfile.confirmPassword' })}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'pages.userProfile.passwordMismatch' })),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder={intl.formatMessage({ id: 'pages.userProfile.confirmPasswordPlaceholder' })} />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'pages.common.cancel' })}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {intl.formatMessage({ id: 'pages.common.save' })}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserProfileModal;
