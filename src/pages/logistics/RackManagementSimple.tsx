// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const RackManagementSimple: React.FC = () => {
  return (
    <PageContainer
      title="랙 관리"
      breadcrumb={{
        items: [{ title: '물류관리' }, { title: '랙 관리' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>창고 랙 위치 관리</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            랙 위치 등록 및 재고 배치 관리
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default RackManagementSimple;

// Case 2: src/pages/logistics/RackManagement.tsx 참고
