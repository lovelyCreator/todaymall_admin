// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const RatesSimple: React.FC = () => {
  return (
    <PageContainer
      title="환율/관세 설정"
      breadcrumb={{
        items: [{ title: '시스템관리' }, { title: '환율/관세 설정' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>환율 및 관세율 설정</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            실시간 환율 조회 및 관세율 관리
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default RatesSimple;

// Case 2: src/pages/system/Rates.tsx 참고
