// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const ForwardersSimple: React.FC = () => {
  return (
    <PageContainer
      title="배대지 관리"
      breadcrumb={{
        items: [{ title: '물류관리' }, { title: '배대지 관리' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>배송대행지 정보 관리</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            배대지 추가, 수정, 삭제 및 정보 관리
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ForwardersSimple;

// Case 2: src/pages/logistics/Forwarders.tsx 참고
