import { EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { history, useModel, useIntl } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Spin } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import HeaderDropdown from '../HeaderDropdown';
import UserProfileModal from '../UserProfileModal';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { user } = useAuthStore();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // Prefer Zustand store, fallback to initialState
  const displayName = user?.name || currentUser?.name || 'Admin';
  return <span className="anticon">{displayName}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  children,
}) => {
  const intl = useIntl();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const logoutMutation = useLogout();
  const { user } = useAuthStore();
  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick: MenuProps['onClick'] = (event) => {
    const { key } = event;
    if (key === 'logout') {
      flushSync(() => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
      });
      logoutMutation.mutate();
      return;
    }
    if (key === 'changeInfo') {
      setProfileModalVisible(true);
      return;
    }
    history.push(`/account/${key}`);
  };

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;
  
  // Check both Zustand store and initialState for user
  const hasUser = user || currentUser;

  if (!hasUser || (!user?.name && !currentUser?.name)) {
    return loading;
  }

  const menuItems = [
    {
      key: 'changeInfo',
      icon: <EditOutlined />,
      label: intl.formatMessage({ id: 'pages.userProfile.editInfo' }),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: intl.formatMessage({ id: 'pages.userProfile.logout' }),
    },
  ];

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <UserProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </>
  );
};
