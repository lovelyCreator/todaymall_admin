// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

const BannersSimple: React.FC = () => {
  const intl = useIntl();
  
  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.cs.banners' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.cs' }) },
          { title: intl.formatMessage({ id: 'menu.cs.banners' }) },
        ],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>{intl.formatMessage({ id: 'menu.cs.banners' })}</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            {intl.formatMessage({ id: 'pages.cs.banners.description' })}
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default BannersSimple;

// Case 2: src/pages/system/Banners.tsx 참고
