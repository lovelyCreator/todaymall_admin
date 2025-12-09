import { DownOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams, useIntl } from '@umijs/max';
import {
  Button,
  Card,
  Descriptions,
  Image,
  message,
  Select,
  Space,
  Tag,
} from 'antd';
import React from 'react';

const { Option } = Select;

const OrderDetail: React.FC = () => {
  const intl = useIntl();
  const { orderNo } = useParams<{ orderNo: string }>();

  // Mock order data
  const orderData = {
    orderNo: orderNo || 'USR20251121000001',
    type: '구매대행',
    status: '입고완료',
    userName: '김철수',
    userId: 'user12345',
    receiver: '김철수',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    trackingCount: 3,
    warehousedCount: 2,
    totalAmount: 285000,
    paidAmount: 312500,
    shippingMethod: '배특송',
    krTrack: '123456789012',
    shipDate: '2025-11-20',
    rack: 'A-12-05',
    createdAt: '2025-11-21 14:32',
    updatedAt: '2025-11-21 18:45',
    buyer: '박구매',
    additionalService: '검수 서비스, 사진 촬영',
    logisticsRequest: '빠른 배송 요청',
    adminMemo: '고객 VIP, 우선 처리',
    products: [
      {
        image:
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        name: '기모 맨투맨',
        option: '블랙/L',
        quantity: 2,
        price: 45000,
        url: 'https://item.taobao.com/item.htm?id=123456',
      },
      {
        image:
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
        name: '후드 티셔츠',
        option: '화이트/M',
        quantity: 1,
        price: 52000,
        url: 'https://item.taobao.com/item.htm?id=789012',
      },
    ],
  };

  return (
    <PageContainer
      title={`${intl.formatMessage({ id: 'pages.orders.detail.title' })} - ${orderData.orderNo}`}
      extra={[
        <Button key="close" onClick={() => history.back()}>
          {intl.formatMessage({ id: 'pages.orders.detail.close' })}
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 주문 기본 정보 */}
        <Card title={intl.formatMessage({ id: 'pages.orders.detail.basicInfo' })} bordered={false}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.orderNumber' })}>
              {orderData.orderNo}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.orderType' })}>
              <Tag color="purple">{orderData.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.progressStatus' })}>
              <Tag color="success">{orderData.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.shippingMethod' })}>
              {orderData.shippingMethod}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.registrationDate' })}>
              {orderData.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.modifiedDate' })}>
              {orderData.updatedAt}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.purchaseManager' })}>
              {orderData.buyer}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.rackNumber' })}>
              {orderData.rack}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 회원 정보 */}
        <Card title={intl.formatMessage({ id: 'pages.orders.detail.memberInfo' })} bordered={false}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.memberName' })}>
              {orderData.userName}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.memberId' })}>
              {orderData.userId}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.receiver' })}>
              {orderData.receiver}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.contact' })}>
              {orderData.phone}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.deliveryAddress' })} span={2}>
              {orderData.address}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 배송 정보 */}
        <Card title={intl.formatMessage({ id: 'pages.orders.detail.shippingInfo' })} bordered={false}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.trackingCount' })}>
              {orderData.trackingCount}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.warehousedCount' })}>
              {orderData.warehousedCount}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.trackingNumber' })}>
              {orderData.krTrack ? (
                <Tag color="green">{orderData.krTrack}</Tag>
              ) : (
                <Tag>{intl.formatMessage({ id: 'pages.orders.detail.notRegistered' })}</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.shipmentDate' })}>
              {orderData.shipDate}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 상품 정보 */}
        <Card title={intl.formatMessage({ id: 'pages.orders.detail.productInfo' })} bordered={false}>
          {orderData.products.map((product, index) => (
            <div
              key={index}
              style={{
                marginBottom: 24,
                padding: 16,
                border: '1px solid #d9d9d9',
                borderRadius: 4,
              }}
            >
              <div style={{ display: 'flex', gap: 16 }}>
                {/* Left: Product Image */}
                <div style={{ flexShrink: 0 }}>
                  <Image
                    src={product.image}
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                  <div
                    style={{ textAlign: 'center', marginTop: 8, fontSize: 12 }}
                  >
                    {intl.formatMessage({ id: 'pages.orders.detail.preview' })}
                  </div>
                </div>

                {/* Right: Product Details Grid */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr 120px 1fr',
                      gap: '12px 16px',
                      fontSize: 14,
                    }}
                  >
                    {/* Row 1 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.trackingNo' })}</div>
                    <div style={{ fontWeight: 500 }}>1234567890123</div>
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.orderSite' })}</div>
                    <div>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1890ff' }}
                      >
                        https://detail.tmall.com/item.htm?id=XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
                      </a>
                    </div>

                    {/* Row 2 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.productName' })}</div>
                    <div style={{ fontWeight: 500 }}>{product.name}</div>
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.orderNo' })}</div>
                    <div>{orderData.orderNo}</div>

                    {/* Row 3 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.color' })}</div>
                    <div>{product.option.split('/')[0]}</div>
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.brandManufacturer' })}</div>
                    <div>-</div>

                    {/* Row 4 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.size' })}</div>
                    <div>{product.option.split('/')[1]}</div>
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.warehouseDate' })}</div>
                    <div>2025-11-20</div>

                    {/* Row 5 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.quantityPriceTotal' })}</div>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>
                        {product.quantity}
                      </span>
                      <span style={{ margin: '0 8px' }}>×</span>
                      <span>¥ {(product.price / 180).toFixed(2)}</span>
                      <span style={{ margin: '0 8px' }}>=</span>
                      <span style={{ fontWeight: 'bold', color: '#f5222d' }}>
                        ¥{' '}
                        {((product.price * product.quantity) / 180).toFixed(2)}
                      </span>
                    </div>
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.product' })}</div>
                    <div>{intl.formatMessage({ id: 'pages.orders.detail.product' })}</div>

                    {/* Row 6 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.memberProductName' })}</div>
                    <div style={{ gridColumn: 'span 3' }}>{product.name}</div>

                    {/* Row 7 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.productStorage' })}</div>
                    <div>{intl.formatMessage({ id: 'pages.orders.detail.noStorage' })}</div>
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.inspectionStorage' })}</div>
                    <div>{intl.formatMessage({ id: 'pages.orders.detail.noInspection' })}</div>

                    {/* Row 8 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.consumerPrice' })}</div>
                    <div style={{ gridColumn: 'span 3' }}>
                      {product.price.toLocaleString()}원
                    </div>

                    {/* Row 9 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.trackingNo' })}</div>
                    <div style={{ gridColumn: 'span 3' }}>1234567890123</div>

                    {/* Row 10 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.cnNumber' })}</div>
                    <div style={{ gridColumn: 'span 3' }}>-</div>

                    {/* Row 11 */}
                    <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.detail.customerRequest' })}</div>
                    <div style={{ gridColumn: 'span 3' }}>-</div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <Button size="small">{intl.formatMessage({ id: 'pages.orders.detail.productButton' })}</Button>
                    <Button size="small">{intl.formatMessage({ id: 'pages.orders.detail.storageButton' })}</Button>
                    <Button size="small">{intl.formatMessage({ id: 'pages.orders.detail.editButton' })}</Button>
                    <Button size="small" danger>
                      {intl.formatMessage({ id: 'pages.orders.detail.deleteButton' })}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Product Summary */}
          <div
            style={{
              marginTop: 16,
              padding: '12px 16px',
              backgroundColor: '#f5f5f5',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>{intl.formatMessage({ id: 'pages.orders.detail.trackingCount' })}:</span>
              <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                {orderData.products.length} {intl.formatMessage({ id: 'pages.orders.detail.items' })}
              </span>
            </div>
            <span style={{ color: '#d9d9d9' }}>/</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>{intl.formatMessage({ id: 'pages.orders.detail.totalQuantity' })}:</span>
              <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                {orderData.products.reduce((sum, p) => sum + p.quantity, 0)} {intl.formatMessage({ id: 'pages.orders.detail.items' })}
              </span>
            </div>
            <span style={{ color: '#d9d9d9' }}>/</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>{intl.formatMessage({ id: 'pages.orders.detail.totalAmount' })}:</span>
              <span
                style={{ fontSize: 16, fontWeight: 'bold', color: '#f5222d' }}
              >
                ¥{' '}
                {(
                  orderData.products.reduce(
                    (sum, p) => sum + p.price * p.quantity,
                    0,
                  ) / 180
                ).toFixed(2)}
              </span>
              <span style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>
                USD{' '}
                {(
                  orderData.products.reduce(
                    (sum, p) => sum + p.price * p.quantity,
                    0,
                  ) / 1300
                ).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              justifyContent: 'flex-start',
              gap: 12,
            }}
          >
            <Select
              defaultValue={intl.formatMessage({ id: 'pages.orders.detail.shipped' })}
              style={{ width: 200 }}
              size="large"
              suffixIcon={<DownOutlined />}
            >
              <Option value="출고">{intl.formatMessage({ id: 'pages.orders.detail.shipped' })}</Option>
              <Option value="미출고">{intl.formatMessage({ id: 'pages.orders.detail.notShipped' })}</Option>
            </Select>
            <Button
              type="primary"
              size="large"
              style={{
                width: 200,
                fontSize: 16,
                fontWeight: 'bold',
              }}
              onClick={() => message.success(intl.formatMessage({ id: 'pages.orders.detail.shipmentCompleteSuccess' }))}
            >
              {intl.formatMessage({ id: 'pages.orders.detail.shipmentComplete' })}
            </Button>
            <Button
              danger
              size="large"
              style={{
                width: 200,
                fontSize: 16,
                fontWeight: 'bold',
              }}
              onClick={() => message.info(intl.formatMessage({ id: 'pages.orders.detail.returnInfo' }))}
            >
              {intl.formatMessage({ id: 'pages.orders.detail.returnProduct' })}
            </Button>
          </div>
        </Card>

        {/* 수령인 정보입력 */}
        <Card title={intl.formatMessage({ id: 'pages.orders.detail.receiverInfo' })} bordered={false}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.nameCompany' })}>
              연계환율 : 사이트비율 / 기간 : P1B0011174471(공통)
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.addressContact' })}>
              0163388882 (628923) 경상남도 김해시 분성로 24-1 별로 안 (신안마을
              3차)
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.businessAddress' })}>0</Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.deliveryRequest' })}>
              무지 : 조사중으로 연락주기를
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.centerRequest' })}>
              판매 보장사업
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 결제 정보 */}
        <Card title={intl.formatMessage({ id: 'pages.orders.detail.paymentInfo' })} bordered={false}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.totalProductAmount' })}>
              {orderData.totalAmount.toLocaleString()}원
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.paidAmount' })}>
              <strong style={{ fontSize: 16, color: '#f5222d' }}>
                {orderData.paidAmount.toLocaleString()}원
              </strong>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 추가 정보 */}
        <Card title={intl.formatMessage({ id: 'pages.orders.detail.additionalInfo' })} bordered={false}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.additionalService' })}>
              {orderData.additionalService || intl.formatMessage({ id: 'pages.orders.detail.none' })}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.logisticsRequest' })}>
              {orderData.logisticsRequest || intl.formatMessage({ id: 'pages.orders.detail.none' })}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.orders.detail.adminMemo' })}>
              {orderData.adminMemo || intl.formatMessage({ id: 'pages.orders.detail.none' })}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 하단 닫기 버튼 */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button size="large" onClick={() => history.back()}>
            {intl.formatMessage({ id: 'pages.orders.detail.close' })}
          </Button>
        </div>
      </Space>
    </PageContainer>
  );
};

export default OrderDetail;
