import {
  CheckCircleOutlined,
  DownloadOutlined,
  LinkOutlined,
  PictureOutlined,
  SaveOutlined,
  SearchOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';

const { Text } = Typography;

import React, { useState } from 'react';
import { useIntl } from '@umijs/max';

const { TextArea } = Input;
const { Option } = Select;

interface ProductData {
  title: string;
  titleKo: string;
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  descriptionKo: string;
  options: Array<{
    name: string;
    nameKo: string;
    values: Array<{
      name: string;
      nameKo: string;
      price: number;
      stock: number;
    }>;
  }>;
  specs: Array<{ key: string; value: string; keyKo: string; valueKo: string }>;
  seller: {
    name: string;
    rating: number;
    sales: number;
  };
}

const ImportTaobao: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [translating, setTranslating] = useState(false);

  const handleFetchProduct = async () => {
    if (!url) {
      message.warning(intl.formatMessage({ id: 'pages.products.import.urlRequired' }));
      return;
    }

    // Validate URL
    const validPlatforms = [
      'taobao.com',
      '1688.com',
      'tmall.com',
      'aliexpress.com',
      'temu.com',
    ];
    const isValidUrl = validPlatforms.some((platform) =>
      url.includes(platform),
    );

    if (!isValidUrl) {
      message.error(intl.formatMessage({ id: 'pages.products.import.invalidUrl' }));
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockData: ProductData = {
        title: '2024新款韩版时尚休闲运动鞋男女情侣款透气网面跑步鞋',
        titleKo:
          '2024 신상 한국풍 패션 캐주얼 운동화 남녀 커플 통기성 메쉬 러닝화',
        price: 89.0,
        originalPrice: 199.0,
        images: [
          'https://via.placeholder.com/400x400?text=Image+1',
          'https://via.placeholder.com/400x400?text=Image+2',
          'https://via.placeholder.com/400x400?text=Image+3',
          'https://via.placeholder.com/400x400?text=Image+4',
          'https://via.placeholder.com/400x400?text=Image+5',
        ],
        description:
          '高品质运动鞋，采用透气网面材质，轻便舒适。适合日常休闲、运动健身等多种场合。多色可选，男女同款。',
        descriptionKo:
          '고품질 운동화, 통기성 메쉬 소재 사용, 가볍고 편안합니다. 일상 캐주얼, 운동 피트니스 등 다양한 장소에 적합합니다. 다양한 색상 선택 가능, 남녀 공용.',
        options: [
          {
            name: '颜色',
            nameKo: '색상',
            values: [
              { name: '黑色', nameKo: '블랙', price: 0, stock: 150 },
              { name: '白色', nameKo: '화이트', price: 0, stock: 200 },
              { name: '红色', nameKo: '레드', price: 5, stock: 80 },
            ],
          },
          {
            name: '尺码',
            nameKo: '사이즈',
            values: [
              { name: '36', nameKo: '36', price: 0, stock: 50 },
              { name: '37', nameKo: '37', price: 0, stock: 80 },
              { name: '38', nameKo: '38', price: 0, stock: 100 },
              { name: '39', nameKo: '39', price: 0, stock: 120 },
              { name: '40', nameKo: '40', price: 0, stock: 150 },
              { name: '41', nameKo: '41', price: 0, stock: 130 },
              { name: '42', nameKo: '42', price: 0, stock: 100 },
              { name: '43', nameKo: '43', price: 0, stock: 80 },
            ],
          },
        ],
        specs: [
          { key: '品牌', value: 'NIKE', keyKo: '브랜드', valueKo: 'NIKE' },
          {
            key: '材质',
            value: '网面+橡胶',
            keyKo: '소재',
            valueKo: '메쉬+고무',
          },
          { key: '产地', value: '中国', keyKo: '원산지', valueKo: '중국' },
          {
            key: '适用季节',
            value: '春夏秋冬',
            keyKo: '적용 계절',
            valueKo: '봄여름가을겨울',
          },
        ],
        seller: {
          name: '优质运动鞋专营店',
          rating: 4.8,
          sales: 15234,
        },
      };

      setProductData(mockData);
      setSelectedImages(mockData.images);
      setLoading(false);
      message.success(intl.formatMessage({ id: 'pages.products.import.fetchSuccess' }));
    }, 2000);
  };

  const handleTranslate = async () => {
    if (!productData) return;

    setTranslating(true);
    setTimeout(() => {
      message.success(intl.formatMessage({ id: 'pages.products.import.translateSuccess' }));
      setTranslating(false);
    }, 1500);
  };

  const handleDownloadImages = () => {
    message.success(
      intl.formatMessage(
        { id: 'pages.products.import.downloadStart' },
        { count: selectedImages.length },
      ),
    );
  };

  const handleSaveProduct = async () => {
    try {
      const values = await form.validateFields();
      console.log('Saving product:', { ...productData, ...values });
      message.success(intl.formatMessage({ id: 'pages.products.import.saveSuccess' }));
      // Reset
      setUrl('');
      setProductData(null);
      setSelectedImages([]);
      form.resetFields();
    } catch (_error) {
      message.error(intl.formatMessage({ id: 'pages.products.import.saveError' }));
    }
  };

  const optionColumns = [
    {
      title: intl.formatMessage({ id: 'pages.products.import.optionNameCn' }),
      dataIndex: 'name',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'pages.products.import.optionNameKo' }),
      dataIndex: 'nameKo',
      width: 150,
      render: (text: string) => <Input defaultValue={text} size="small" />,
    },
    {
      title: intl.formatMessage({ id: 'pages.products.import.optionPrice' }),
      dataIndex: 'price',
      width: 120,
      render: (text: number) => (
        <InputNumber defaultValue={text} size="small" addonAfter="원" />
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.import.optionStock' }),
      dataIndex: 'stock',
      width: 100,
      render: (text: number) => (
        <Tag color={text > 100 ? 'green' : text > 50 ? 'orange' : 'red'}>
          {text}
        </Tag>
      ),
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'pages.products.import.title' })}
      subTitle={intl.formatMessage({ id: 'pages.products.import.subtitle' })}
    >
      {/* URL Input Section */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message={intl.formatMessage({ id: 'pages.products.import.platforms' })}
            description={
              <Space wrap>
                <Tag color="orange">타오바오 (Taobao)</Tag>
                <Tag color="red">1688</Tag>
                <Tag color="red">티몰 (Tmall)</Tag>
                <Tag color="blue">알리익스프레스 (AliExpress)</Tag>
                <Tag color="purple">테무 (Temu)</Tag>
              </Space>
            }
            type="info"
            showIcon
          />

          <Input.Search
            size="large"
            placeholder={intl.formatMessage({ id: 'pages.products.import.urlPlaceholder' })}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onSearch={handleFetchProduct}
            enterButton={
              <Button
                type="primary"
                icon={<SearchOutlined />}
                loading={loading}
              >
                {intl.formatMessage({ id: 'pages.products.import.fetch' })}
              </Button>
            }
            prefix={<LinkOutlined />}
          />
        </Space>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, fontSize: 16 }}>
              {intl.formatMessage({ id: 'pages.products.import.fetching' })}
            </div>
          </div>
        </Card>
      )}

      {/* Product Data Display */}
      {productData && !loading && (
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            {/* Left Column - Product Info */}
            <Col span={16}>
              <Card
                title={intl.formatMessage({ id: 'pages.products.import.productInfo' })}
                extra={
                  <Space>
                    <Button
                      icon={<TranslationOutlined />}
                      onClick={handleTranslate}
                      loading={translating}
                    >
                      {intl.formatMessage({ id: 'pages.products.import.translate' })}
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={handleSaveProduct}
                    >
                      {intl.formatMessage({ id: 'pages.products.import.save' })}
                    </Button>
                  </Space>
                }
                style={{ marginBottom: 24 }}
              >
                <Tabs
                  items={[
                    {
                      key: 'basic',
                      label: intl.formatMessage({ id: 'pages.products.import.basicInfo' }),
                      children: (
                        <Space
                          direction="vertical"
                          style={{ width: '100%' }}
                          size="large"
                        >
                          <Form.Item
                            label={intl.formatMessage({ id: 'pages.products.import.titleCn' })}
                            name="titleCn"
                            initialValue={productData.title}
                          >
                            <Input size="large" disabled />
                          </Form.Item>

                          <Form.Item
                            label={intl.formatMessage({ id: 'pages.products.import.titleKo' })}
                            name="titleKo"
                            initialValue={productData.titleKo}
                            rules={[{ required: true }]}
                          >
                            <Input
                              size="large"
                              placeholder={intl.formatMessage({ id: 'pages.products.import.titleKoPlaceholder' })}
                            />
                          </Form.Item>

                          <Row gutter={16}>
                            <Col span={8}>
                              <Form.Item
                                label={intl.formatMessage({ id: 'pages.products.import.originalPrice' })}
                                initialValue={productData.price}
                              >
                                <InputNumber
                                  size="large"
                                  style={{ width: '100%' }}
                                  addonAfter="¥"
                                  disabled
                                />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                label={intl.formatMessage({ id: 'pages.products.import.sellingPrice' })}
                                name="price"
                                rules={[{ required: true }]}
                                initialValue={Math.round(
                                  productData.price * 200,
                                )}
                              >
                                <InputNumber
                                  size="large"
                                  style={{ width: '100%' }}
                                  addonAfter="원"
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ',',
                                    )
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label={intl.formatMessage({ id: 'pages.products.import.margin' })} initialValue={30}>
                                <InputNumber
                                  size="large"
                                  style={{ width: '100%' }}
                                  addonAfter="%"
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            label={intl.formatMessage({ id: 'pages.products.import.descriptionCn' })}
                            initialValue={productData.description}
                          >
                            <TextArea rows={3} disabled />
                          </Form.Item>

                          <Form.Item
                            label={intl.formatMessage({ id: 'pages.products.import.descriptionKo' })}
                            name="descriptionKo"
                            initialValue={productData.descriptionKo}
                            rules={[{ required: true }]}
                          >
                            <TextArea
                              rows={4}
                              placeholder={intl.formatMessage({ id: 'pages.products.import.descriptionKoPlaceholder' })}
                            />
                          </Form.Item>

                          <Form.Item
                            label={intl.formatMessage({ id: 'pages.products.import.category' })}
                            name="category"
                            rules={[{ required: true }]}
                          >
                            <Select size="large" placeholder={intl.formatMessage({ id: 'pages.products.import.categoryPlaceholder' })}>
                              <Option value="clothing">의류</Option>
                              <Option value="shoes">신발</Option>
                              <Option value="bags">가방</Option>
                              <Option value="accessories">액세서리</Option>
                              <Option value="electronics">전자제품</Option>
                              <Option value="home">홈/리빙</Option>
                            </Select>
                          </Form.Item>
                        </Space>
                      ),
                    },
                    {
                      key: 'options',
                      label: intl.formatMessage({ id: 'pages.products.import.optionsInfo' }),
                      children: (
                        <Space
                          direction="vertical"
                          style={{ width: '100%' }}
                          size="large"
                        >
                          {productData.options.map((option, index) => (
                            <div key={index}>
                              <div
                                style={{ marginBottom: 8, fontWeight: 'bold' }}
                              >
                                {option.nameKo} ({option.name})
                              </div>
                              <Table
                                dataSource={option.values}
                                columns={optionColumns}
                                pagination={false}
                                size="small"
                                rowKey={(record) =>
                                  `${option.name}-${record.name}`
                                }
                              />
                            </div>
                          ))}
                        </Space>
                      ),
                    },
                    {
                      key: 'specs',
                      label: intl.formatMessage({ id: 'pages.products.import.specsInfo' }),
                      children: (
                        <Descriptions bordered column={2}>
                          {productData.specs.map((spec, index) => (
                            <Descriptions.Item
                              key={index}
                              label={
                                <span>
                                  {spec.keyKo}{' '}
                                  <Text type="secondary">({spec.key})</Text>
                                </span>
                              }
                            >
                              {spec.valueKo}{' '}
                              <Text type="secondary">({spec.value})</Text>
                            </Descriptions.Item>
                          ))}
                        </Descriptions>
                      ),
                    },
                  ]}
                />
              </Card>

              {/* Seller Info */}
              <Card title={intl.formatMessage({ id: 'pages.products.import.sellerInfo' })}>
                <Descriptions column={3}>
                  <Descriptions.Item label={intl.formatMessage({ id: 'pages.products.import.seller' })}>
                    {productData.seller.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={intl.formatMessage({ id: 'pages.products.import.rating' })}>
                    <Tag color="gold">{productData.seller.rating} / 5.0</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={intl.formatMessage({ id: 'pages.products.import.sales' })}>
                    <Tag color="blue">
                      {productData.seller.sales.toLocaleString()}{intl.formatMessage({ id: 'pages.products.import.salesUnit' })}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Right Column - Images */}
            <Col span={8}>
              <Card
                title={intl.formatMessage(
                  { id: 'pages.products.import.imagesCount' },
                  { count: selectedImages.length },
                )}
                extra={
                  <Button
                    type="primary"
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadImages}
                  >
                    {intl.formatMessage({ id: 'pages.products.import.download' })}
                  </Button>
                }
              >
                <Space
                  direction="vertical"
                  style={{ width: '100%' }}
                  size="middle"
                >
                  <Alert
                    message={intl.formatMessage({ id: 'pages.products.import.imageSelectInfo' })}
                    type="info"
                    showIcon
                    icon={<PictureOutlined />}
                  />

                  <Image.PreviewGroup>
                    <Row gutter={[8, 8]}>
                      {productData.images.map((img, index) => (
                        <Col span={12} key={index}>
                          <div
                            style={{
                              position: 'relative',
                              border: selectedImages.includes(img)
                                ? '3px solid #1890ff'
                                : '1px solid #d9d9d9',
                              borderRadius: 4,
                              overflow: 'hidden',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              if (selectedImages.includes(img)) {
                                setSelectedImages(
                                  selectedImages.filter((i) => i !== img),
                                );
                              } else {
                                setSelectedImages([...selectedImages, img]);
                              }
                            }}
                          >
                            <Image
                              src={img}
                              width="100%"
                              height={120}
                              style={{ objectFit: 'cover' }}
                            />
                            {selectedImages.includes(img) && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  background: '#1890ff',
                                  borderRadius: '50%',
                                  width: 24,
                                  height: 24,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <CheckCircleOutlined
                                  style={{ color: 'white', fontSize: 16 }}
                                />
                              </div>
                            )}
                            {index === 0 && (
                              <Tag
                                color="red"
                                style={{
                                  position: 'absolute',
                                  top: 4,
                                  left: 4,
                                  margin: 0,
                                }}
                              >
                                {intl.formatMessage({ id: 'pages.products.import.mainImage' })}
                              </Tag>
                            )}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Image.PreviewGroup>
                </Space>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </PageContainer>
  );
};

export default ImportTaobao;
