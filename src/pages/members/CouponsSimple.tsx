// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const CouponsSimple: React.FC = () => {
  return (
    <PageContainer
      title="쿠폰 관리"
      breadcrumb={{
        items: [{ title: '회원관리' }, { title: '쿠폰 관리' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>쿠폰 발급 및 사용 관리</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            쿠폰 생성, 발급, 사용 내역 조회
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default CouponsSimple;

// Case 2: src/pages/members/Coupons.tsx 참고
