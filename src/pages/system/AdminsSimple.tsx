// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const AdminsSimple: React.FC = () => {
  return (
    <PageContainer
      title="관리자 계정"
      breadcrumb={{
        items: [{ title: '시스템관리' }, { title: '관리자 계정' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>관리자 계정 관리</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            관리자 추가, 수정, 삭제 및 권한 설정
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default AdminsSimple;

// Case 2: src/pages/system/Administrators.tsx 참고
