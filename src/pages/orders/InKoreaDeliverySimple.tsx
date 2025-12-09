// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

const InKoreaDeliverySimple: React.FC = () => {
  const intl = useIntl();
  return (
    <PageContainer
      title={intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.title' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.breadcrumb' }) },
          { title: intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.title' }) },
        ],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>{intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.description' })}</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            {intl.formatMessage({ id: 'pages.orders.inKoreaDelivery.subDescription' })}
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default InKoreaDeliverySimple;

// Case 2: src/pages/orders/InKoreaDelivery.tsx 참고
