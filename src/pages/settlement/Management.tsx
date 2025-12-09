// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card, Tabs } from 'antd';
import React from 'react';

const SettlementManagement: React.FC = () => {
  return (
    <PageContainer
      title="정산 관리"
      breadcrumb={{
        items: [{ title: '정산' }, { title: '정산 관리' }],
      }}
    >
      <Card>
        <Tabs
          items={[
            {
              key: 'platform',
              label: '플랫폼 수수료',
              children: (
                <div
                  style={{
                    padding: '40px 0',
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  <p>플랫폼 수수료 정산 내역</p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>
                    월별 수수료 수익 및 통계
                  </p>
                </div>
              ),
            },
            {
              key: 'sellers',
              label: '판매자 정산',
              children: (
                <div
                  style={{
                    padding: '40px 0',
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  <p>판매자 정산 처리</p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>
                    판매자별 정산 내역 및 처리
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default SettlementManagement;

// ============================================
// Case 2: 상세한 레이아웃 (Detailed Layout) - 기존 코드 보존
// ============================================
/*
// 상세한 정산 관리 페이지 구현
// - 플랫폼 수수료 정산: src/pages/settlement/Platform.tsx 참고
// - 판매자 정산: src/pages/settlement/Sellers.tsx 참고
// 
// 기능:
// - 월별 정산 내역 조회
// - 정산 처리 및 승인
// - 정산 통계 및 리포트
// - 엑셀 다운로드
*/
