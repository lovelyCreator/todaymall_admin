// src/components/UserInfoModal.tsx

import { Descriptions, Modal, Tag } from 'antd';
import React from 'react';

interface UserInfo {
  userName: string;
  userId: string;
  memberType: '일반' | '사업자';
  businessNo?: string;
  mailbox: string;
  registrationDate: string;
  totalOrders: number;
  totalAmount: number;
  phone: string;
  email: string;
  address: string;
  memo?: string;
}

interface UserInfoModalProps {
  visible: boolean;
  onClose: () => void;
  userInfo: UserInfo | null;
  position?: { x: number; y: number };
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({
  visible,
  onClose,
  userInfo,
  position,
}) => {
  if (!userInfo) return null;

  // Calculate modal position - show below and to the left of clicked element
  const modalStyle = position
    ? {
        position: 'absolute' as const,
        left: position.x,
        top: position.y + 20, // 20px below the click
        margin: 0,
      }
    : {};

  return (
    <Modal
      title={
        <div>
          {userInfo.userName}{' '}
          <Tag color={userInfo.memberType === '일반' ? 'blue' : 'gold'}>
            {userInfo.memberType === '일반' ? '일반회원' : '사업자회원'}
          </Tag>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      style={modalStyle}
      centered={!position}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="사서함번호">
          {userInfo.mailbox}
        </Descriptions.Item>
        {/* <Descriptions.Item label="아이디">{userInfo.userId}</Descriptions.Item> */}
        {userInfo.memberType === '사업자' && userInfo.businessNo && (
          <Descriptions.Item label="사업자등록번호">
            {userInfo.businessNo}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="가입일">
          {userInfo.registrationDate}
        </Descriptions.Item>
        <Descriptions.Item label="총 주문건수">
          {userInfo.totalOrders.toLocaleString()}건
        </Descriptions.Item>
        <Descriptions.Item label="총 주문금액">
          {userInfo.totalAmount.toLocaleString()}원
        </Descriptions.Item>
        <Descriptions.Item label="연락처">{userInfo.phone}</Descriptions.Item>
        <Descriptions.Item label="이메일">{userInfo.email}</Descriptions.Item>
        <Descriptions.Item label="주소">{userInfo.address}</Descriptions.Item>
        {userInfo.memo && (
          <Descriptions.Item label="메모">{userInfo.memo}</Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default UserInfoModal;
