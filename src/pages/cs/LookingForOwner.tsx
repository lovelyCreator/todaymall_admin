import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

const LookingForOwner: React.FC = () => {
  const intl = useIntl();
  
  return (
    <PageContainer
      title={intl.formatMessage({ id: 'menu.cs.looking-for-owner' })}
      breadcrumb={{
        items: [
          { title: intl.formatMessage({ id: 'menu.cs' }) },
          { title: intl.formatMessage({ id: 'menu.cs.looking-for-owner' }) },
        ],
      }}
    >
      <Card>
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
          <p>{intl.formatMessage({ id: 'menu.cs.looking-for-owner' })}</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            {intl.formatMessage({ id: 'pages.cs.lookingForOwner.description' })}
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default LookingForOwner;

