// ============================================
// Case 1: 간단한 레이아웃 (Simple Layout)
// ============================================
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

const OrderQuestionsSimple: React.FC = () => {
  const intl = useIntl();
  return (
    <PageContainer
      title={intl.formatMessage({ id: 'pages.orders.orderQuestions.title' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'pages.orders.orderQuestions.breadcrumb' }) },
          { title: intl.formatMessage({ id: 'pages.orders.orderQuestions.title' }) },
        ],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>{intl.formatMessage({ id: 'pages.orders.orderQuestions.description' })}</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            {intl.formatMessage({ id: 'pages.orders.orderQuestions.subDescription' })}
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default OrderQuestionsSimple;

// Case 2: src/pages/orders/OrderQuestions.tsx 참고
