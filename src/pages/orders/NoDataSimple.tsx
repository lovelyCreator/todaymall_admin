// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

const NoDataSimple: React.FC = () => {
  const intl = useIntl();
  return (
    <PageContainer
      title={intl.formatMessage({ id: 'pages.orders.noData.title' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'pages.orders.noData.breadcrumb' }) },
          { title: intl.formatMessage({ id: 'pages.orders.noData.title' }) },
        ],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>{intl.formatMessage({ id: 'pages.orders.noData.description' })}</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            {intl.formatMessage({ id: 'pages.orders.noData.subDescription' })}
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default NoDataSimple;

// Case 2: src/pages/orders/NoData.tsx 참고
// 노데이타 = 주문 매칭 상태 관리 (미매칭/매칭완료/매칭해제)
