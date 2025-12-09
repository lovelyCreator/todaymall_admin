// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card, Tabs } from 'antd';
import React from 'react';

const SystemSettings: React.FC = () => {
  return (
    <PageContainer
      title="시스템 관리"
      breadcrumb={{
        items: [{ title: '시스템' }, { title: '시스템 관리' }],
      }}
    >
      <Card>
        <Tabs
          items={[
            {
              key: 'admins',
              label: '관리자 계정',
              children: (
                <div
                  style={{
                    padding: '40px 0',
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  <p>관리자 계정 관리</p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>
                    관리자 추가, 수정, 삭제 및 권한 설정
                  </p>
                </div>
              ),
            },
            {
              key: 'roles',
              label: '권한 관리',
              children: (
                <div
                  style={{
                    padding: '40px 0',
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  <p>역할 및 권한 관리</p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>
                    역할 생성 및 권한 할당
                  </p>
                </div>
              ),
            },
            // Case 1에서는 광고 관리와 게시글 관리 숨김
            // {
            //   key: 'ads',
            //   label: '광고 관리',
            //   children: <div>광고 관리</div>,
            // },
            // {
            //   key: 'posts',
            //   label: '게시글 관리',
            //   children: <div>게시글 관리</div>,
            // },
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default SystemSettings;

// ============================================
// Case 2: 상세한 레이아웃 (Detailed Layout) - 기존 코드 보존
// ============================================
/*
// 상세한 시스템 관리 페이지 구현
// 
// 포함된 기능:
// 1. 관리자 계정 관리: src/pages/system/Administrators.tsx 참고
// 2. 권한 관리: src/pages/system/Roles.tsx 참고
// 3. 광고 관리: src/pages/system/AdvertiseManagement.tsx (Case 2에서만 표시)
// 4. 게시글 관리: src/pages/system/ArticleManagement.tsx (Case 2에서만 표시)
// 5. 배너 관리: src/pages/system/Banners.tsx
// 
// Case 1과 Case 2의 차이:
// - Case 1: 관리자 계정, 권한 관리만 표시 (광고/게시글 관리 숨김)
// - Case 2: 모든 기능 표시 (광고/게시글 관리 포함)
*/
