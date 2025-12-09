// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const HelpCenterSimple: React.FC = () => {
  return (
    <PageContainer
      title="헬프센터"
      breadcrumb={{
        items: [{ title: '고객센터' }, { title: '헬프센터' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>고객 도움말 센터</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            자주 묻는 질문, 이용 가이드, 도움말 관리
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default HelpCenterSimple;

// Case 2: src/pages/cs/HelpCenter.tsx 참고
