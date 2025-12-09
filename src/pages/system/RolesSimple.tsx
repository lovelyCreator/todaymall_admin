// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const RolesSimple: React.FC = () => {
  return (
    <PageContainer
      title="권한 관리"
      breadcrumb={{
        items: [{ title: '시스템관리' }, { title: '권한 관리' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>역할 및 권한 관리</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>역할 생성 및 권한 할당</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default RolesSimple;

// Case 2: src/pages/system/Roles.tsx 참고
