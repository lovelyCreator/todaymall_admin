// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout) - 이미지 참고
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const InquiriesSimple: React.FC = () => {
  return (
    <PageContainer
      title="1:1 문의 관리"
      breadcrumb={{
        items: [{ title: '고객센터' }, { title: '문의사항' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>문의 목록 + 답변 달기</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            여기에 1:1 문의 관리 기능이 구현됩니다
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default InquiriesSimple;

// ============================================
// Case 2: 상세한 레이아웃 (Detailed Layout) - 기존 코드 보존
// ============================================
/*
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExportOutlined,
  MessageOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Statistic,
  Tag,
  message,
} from 'antd';
import React, { useRef, useState } from 'react';

const { TextArea } = Input;

interface InquiryItem {
  id: string;
  memberId: string;
  memberName: string;
  category: string;
  title: string;
  content: string;
  status: 'pending' | 'answered' | 'closed';
  createdAt: string;
  answeredAt?: string;
  answeredBy?: string;
  answer?: string;
  priority: 'high' | 'normal' | 'low';
}

const InquiriesDetailed: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InquiryItem | null>(null);
  const [form] = Form.useForm();

  // ... 전체 구현 코드는 src/pages/cs/Inquiries.tsx 참고
  
  return (
    <PageContainer title="1:1 문의 관리">
      // 통계 카드, 테이블, 모달 등 상세 구현
    </PageContainer>
  );
};

export default InquiriesDetailed;
*/
