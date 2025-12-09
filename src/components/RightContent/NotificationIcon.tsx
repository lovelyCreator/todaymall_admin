import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Badge, Popover } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 12px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const NotificationIcon: React.FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [popoverVisible, setPopoverVisible] = useState(false);

  const notificationData = [
    { title: '1:1문의 문의중', count: 0, path: '/cs/inquiries' },
    { title: '주문문의 문의중', count: 2, path: '/orders/questions' },
    { title: '재고문의중', count: 1, path: '/orders/inventory-questions' },
  ];

  const handleNotificationClick = (path: string) => {
    setPopoverVisible(false);
    navigate(path);
  };

  const notificationContent = (
    <div style={{ width: 280, padding: '8px 0' }}>
      {notificationData.map((item, index) => (
        <div
          key={index}
          onClick={() => handleNotificationClick(item.path)}
          style={{
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom:
              index < notificationData.length - 1
                ? '1px solid #f0f0f0'
                : 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span style={{ fontSize: 14 }}>{item.title}</span>
          <span
            className={item.count > 0 ? 'pulse-number-strong' : ''}
            style={{
              color: item.count > 0 ? '#faad14' : '#999',
              fontWeight: 'bold',
              fontSize: 14,
            }}
          >
            {item.count} 건
          </span>
        </div>
      ))}
    </div>
  );

  const totalCount = 3; // 0 + 2 + 1

  return (
    <Popover
      content={notificationContent}
      title="알림"
      trigger="click"
      placement="bottomRight"
      open={popoverVisible}
      onOpenChange={setPopoverVisible}
    >
      <span className={styles.action}>
        <Badge
          count={totalCount}
          offset={[8, -8]}
          size="small"
          className="pulse-badge"
          style={{ fontSize: 10 }}
        >
          <BellOutlined style={{ fontSize: 18 }} />
        </Badge>
      </span>
    </Popover>
  );
};
