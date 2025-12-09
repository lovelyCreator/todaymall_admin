import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

const BankbookVerification: React.FC = () => {
  const intl = useIntl();
  
  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.members.bankbookVerification' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.members' }) },
          { title: intl.formatMessage({ id: 'menu.members.bankbookVerification' }) },
        ],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>{intl.formatMessage({ id: 'pages.members.bankbookVerification.description' })}</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            {intl.formatMessage({ id: 'pages.members.bankbookVerification.subDescription' })}
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default BankbookVerification;


