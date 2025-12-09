// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const PointsSimple: React.FC = () => {
  return (
    <PageContainer
      title="포인트 내역"
      breadcrumb={{
        items: [{ title: '회원관리' }, { title: '포인트 내역' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>회원 포인트 적립/사용 내역</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            포인트 조회, 지급, 차감 관리
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default PointsSimple;

// Case 2: src/pages/members/Points.tsx 참고
