import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

const ForexDepositApplication: React.FC = () => {
  const intl = useIntl();
  
  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.members.forexDepositApplication' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.members' }) },
          { title: intl.formatMessage({ id: 'menu.members.forexDepositApplication' }) },
        ],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>{intl.formatMessage({ id: 'pages.members.forexDepositApplication.description' })}</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            {intl.formatMessage({ id: 'pages.members.forexDepositApplication.subDescription' })}
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ForexDepositApplication;


