// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const BatchTrackingSimple: React.FC = () => {
  return (
    <PageContainer
      title="운송장 일괄등록"
      breadcrumb={{
        items: [{ title: '물류관리' }, { title: '운송장 일괄등록' }],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>운송장 번호 일괄 등록 기능</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            엑셀 업로드 또는 직접 입력으로 운송장 등록
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default BatchTrackingSimple;

// Case 2: src/pages/logistics/BatchTracking.tsx 참고
