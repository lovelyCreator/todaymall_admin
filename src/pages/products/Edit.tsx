import { PageContainer } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Card } from 'antd';

const EditProduct: React.FC = () => {
  const { id } = useParams();
  return (
    <PageContainer title={`상품 수정 - ID: ${id}`}>
      <Card>상품 수정 ProForm 들어갈 자리</Card>
    </PageContainer>
  );
};

export default EditProduct;
