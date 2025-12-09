import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from 'react-intl';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Upload,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface OptionValue {
  name: string;
  price: number;
  stock: number;
  sku: string;
}

const AddProduct: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [options, setOptions] = useState<OptionValue[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Product data:', values);
      message.success(intl.formatMessage({ id: 'pages.products.add.success' }));
      form.resetFields();
      setFileList([]);
      setOptions([]);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error(intl.formatMessage({ id: 'pages.products.add.error' }));
    }
  };

  const handleAddOption = () => {
    const newOption: OptionValue = {
      name: '',
      price: 0,
      stock: 0,
      sku: `SKU${Date.now()}`,
    };
    setOptions([...options, newOption]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (
    index: number,
    field: keyof OptionValue,
    value: any,
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const optionColumns = [
    {
      title: intl.formatMessage({ id: 'pages.products.add.optionName' }),
      dataIndex: 'name',
      width: 200,
      render: (_: any, record: OptionValue, index: number) => (
        <Input
          placeholder={intl.formatMessage({
            id: 'pages.products.add.optionNamePlaceholder',
          })}
          value={record.name}
          onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.add.optionPrice' }),
      dataIndex: 'price',
      width: 150,
      render: (_: any, record: OptionValue, index: number) => (
        <InputNumber
          placeholder={intl.formatMessage({
            id: 'pages.products.add.pricePlaceholder',
          })}
          value={record.price}
          onChange={(value) => handleOptionChange(index, 'price', value || 0)}
          style={{ width: '100%' }}
          formatter={(value) =>
            `${value}${intl.formatMessage({ id: 'pages.home.won' })}`
          }
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.add.optionStock' }),
      dataIndex: 'stock',
      width: 120,
      render: (_: any, record: OptionValue, index: number) => (
        <InputNumber
          placeholder={intl.formatMessage({
            id: 'pages.products.add.pricePlaceholder',
          })}
          value={record.stock}
          onChange={(value) => handleOptionChange(index, 'stock', value || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.add.optionSku' }),
      dataIndex: 'sku',
      width: 150,
      render: (_: any, record: OptionValue, index: number) => (
        <Input
          placeholder={intl.formatMessage({ id: 'pages.products.add.optionSku' })}
          value={record.sku}
          onChange={(e) => handleOptionChange(index, 'sku', e.target.value)}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.list.actions' }),
      width: 80,
      render: (_: any, _record: OptionValue, index: number) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveOption(index)}
        />
      ),
    },
  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'pages.products.add.title' })}
      extra={[
        <Button
          key="preview"
          icon={<EyeOutlined />}
          onClick={() => setPreviewVisible(true)}
        >
          {intl.formatMessage({ id: 'pages.products.add.preview' })}
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
        >
          {intl.formatMessage({ id: 'pages.products.add.submit' })}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          {/* Left Column - Basic Info */}
          <Col span={16}>
            <Card
              title={intl.formatMessage({ id: 'pages.products.add.basicInfo' })}
              style={{ marginBottom: 24 }}
            >
              <Form.Item
                name="productName"
                label={intl.formatMessage({
                  id: 'pages.products.add.productName',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.products.add.productNameRequired',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.products.add.productNamePlaceholder',
                  })}
                  size="large"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label={intl.formatMessage({
                      id: 'pages.products.add.category',
                    })}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'pages.products.add.categoryRequired',
                        }),
                      },
                    ]}
                  >
                    <Select
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.categoryPlaceholder',
                      })}
                      size="large"
                    >
                      <Option value="clothing">
                        {intl.formatMessage({
                          id: 'pages.products.add.category.clothing',
                        })}
                      </Option>
                      <Option value="shoes">
                        {intl.formatMessage({
                          id: 'pages.products.add.category.shoes',
                        })}
                      </Option>
                      <Option value="bags">
                        {intl.formatMessage({
                          id: 'pages.products.add.category.bags',
                        })}
                      </Option>
                      <Option value="accessories">
                        {intl.formatMessage({
                          id: 'pages.products.add.category.accessories',
                        })}
                      </Option>
                      <Option value="electronics">
                        {intl.formatMessage({
                          id: 'pages.products.add.category.electronics',
                        })}
                      </Option>
                      <Option value="home">
                        {intl.formatMessage({
                          id: 'pages.products.add.category.home',
                        })}
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="brand"
                    label={intl.formatMessage({ id: 'pages.products.add.brand' })}
                  >
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.brandPlaceholder',
                      })}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label={intl.formatMessage({
                  id: 'pages.products.add.description',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.products.add.descriptionRequired',
                    }),
                  },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder={intl.formatMessage({
                    id: 'pages.products.add.descriptionPlaceholder',
                  })}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="price"
                    label={intl.formatMessage({ id: 'pages.products.add.price' })}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'pages.products.add.priceRequired',
                        }),
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.pricePlaceholder',
                      })}
                      style={{ width: '100%' }}
                      size="large"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) =>
                        value?.replace(/\$\s?|(,*)/g, '') as any
                      }
                      addonAfter={intl.formatMessage({ id: 'pages.home.won' })}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="originalPrice"
                    label={intl.formatMessage({
                      id: 'pages.products.add.originalPrice',
                    })}
                  >
                    <InputNumber
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.pricePlaceholder',
                      })}
                      style={{ width: '100%' }}
                      size="large"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) =>
                        value?.replace(/\$\s?|(,*)/g, '') as any
                      }
                      addonAfter={intl.formatMessage({ id: 'pages.home.won' })}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="stock"
                    label={intl.formatMessage({ id: 'pages.products.add.stock' })}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.pricePlaceholder',
                      })}
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      addonAfter={intl.formatMessage({ id: 'pages.home.count' })}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="sku"
                    label={intl.formatMessage({ id: 'pages.products.add.sku' })}
                  >
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.skuPlaceholder',
                      })}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="barcode"
                    label={intl.formatMessage({
                      id: 'pages.products.add.barcode',
                    })}
                  >
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.barcodePlaceholder',
                      })}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Product Options */}
            <Card
              title={intl.formatMessage({ id: 'pages.products.add.options' })}
              style={{ marginBottom: 24 }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddOption}
                  block
                >
                  {intl.formatMessage({ id: 'pages.products.add.addOption' })}
                </Button>
                {options.length > 0 && (
                  <Table
                    dataSource={options}
                    columns={optionColumns}
                    pagination={false}
                    rowKey={(_record, index) => `option-${index}`}
                    size="small"
                  />
                )}
              </Space>
            </Card>

            {/* Shipping Info */}
            <Card
              title={intl.formatMessage({
                id: 'pages.products.add.shippingInfo',
              })}
              style={{ marginBottom: 24 }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="weight"
                    label={intl.formatMessage({ id: 'pages.products.add.weight' })}
                  >
                    <InputNumber
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.pricePlaceholder',
                      })}
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      step={0.1}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="width"
                    label={intl.formatMessage({ id: 'pages.products.add.width' })}
                  >
                    <InputNumber
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.pricePlaceholder',
                      })}
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="height"
                    label={intl.formatMessage({ id: 'pages.products.add.height' })}
                  >
                    <InputNumber
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.pricePlaceholder',
                      })}
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="depth"
                    label={intl.formatMessage({ id: 'pages.products.add.depth' })}
                  >
                    <InputNumber
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.pricePlaceholder',
                      })}
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name="shippingMethod"
                    label={intl.formatMessage({
                      id: 'pages.products.add.shippingMethod',
                    })}
                  >
                    <Select
                      placeholder={intl.formatMessage({
                        id: 'pages.products.add.shippingMethodPlaceholder',
                      })}
                      size="large"
                    >
                      <Option value="air">
                        {intl.formatMessage({
                          id: 'pages.products.add.shipping.air',
                        })}
                      </Option>
                      <Option value="air_express">
                        {intl.formatMessage({
                          id: 'pages.products.add.shipping.airExpress',
                        })}
                      </Option>
                      <Option value="sea">
                        {intl.formatMessage({
                          id: 'pages.products.add.shipping.sea',
                        })}
                      </Option>
                      <Option value="sea_express">
                        {intl.formatMessage({
                          id: 'pages.products.add.shipping.seaExpress',
                        })}
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Additional Info */}
            <Card
              title={intl.formatMessage({
                id: 'pages.products.add.additionalInfo',
              })}
            >
              <Form.Item
                name="tags"
                label={intl.formatMessage({ id: 'pages.products.add.tags' })}
              >
                <Select
                  mode="tags"
                  placeholder={intl.formatMessage({
                    id: 'pages.products.add.tagsPlaceholder',
                  })}
                  size="large"
                >
                  <Option value="new">
                    {intl.formatMessage({ id: 'pages.products.add.tag.new' })}
                  </Option>
                  <Option value="popular">
                    {intl.formatMessage({ id: 'pages.products.add.tag.popular' })}
                  </Option>
                  <Option value="sale">
                    {intl.formatMessage({ id: 'pages.products.add.tag.sale' })}
                  </Option>
                  <Option value="recommended">
                    {intl.formatMessage({
                      id: 'pages.products.add.tag.recommended',
                    })}
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="keywords"
                label={intl.formatMessage({ id: 'pages.products.add.keywords' })}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.products.add.keywordsPlaceholder',
                  })}
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="memo"
                label={intl.formatMessage({ id: 'pages.products.add.memo' })}
              >
                <TextArea
                  rows={3}
                  placeholder={intl.formatMessage({
                    id: 'pages.products.add.memoPlaceholder',
                  })}
                />
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column - Images & Settings */}
          <Col span={8}>
            <Card
              title={intl.formatMessage({ id: 'pages.products.add.images' })}
              style={{ marginBottom: 24 }}
            >
              <Form.Item
                name="images"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.products.add.imageRequired',
                    }),
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={({ fileList: newFileList }) =>
                    setFileList(newFileList)
                  }
                  beforeUpload={() => false}
                  maxCount={10}
                >
                  {fileList.length >= 10 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>
                        {intl.formatMessage({
                          id: 'pages.products.add.uploadImage',
                        })}
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                •{' '}
                {intl.formatMessage({ id: 'pages.products.add.imageNote1' })}
                <br />•{' '}
                {intl.formatMessage({ id: 'pages.products.add.imageNote2' })}
                <br />•{' '}
                {intl.formatMessage({ id: 'pages.products.add.imageNote3' })}
              </div>
            </Card>

            <Card
              title={intl.formatMessage({
                id: 'pages.products.add.salesSettings',
              })}
              style={{ marginBottom: 24 }}
            >
              <Form.Item
                name="status"
                label={intl.formatMessage({
                  id: 'pages.products.add.salesStatus',
                })}
                initialValue="active"
              >
                <Select size="large">
                  <Option value="active">
                    {intl.formatMessage({
                      id: 'pages.products.add.status.active',
                    })}
                  </Option>
                  <Option value="inactive">
                    {intl.formatMessage({
                      id: 'pages.products.add.status.inactive',
                    })}
                  </Option>
                  <Option value="soldout">
                    {intl.formatMessage({
                      id: 'pages.products.add.status.soldout',
                    })}
                  </Option>
                  <Option value="preparing">
                    {intl.formatMessage({
                      id: 'pages.products.add.status.preparing',
                    })}
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="displayStatus"
                label={intl.formatMessage({
                  id: 'pages.products.add.displayStatus',
                })}
                valuePropName="checked"
                initialValue={true}
              >
                <Switch
                  checkedChildren={intl.formatMessage({
                    id: 'pages.products.add.show',
                  })}
                  unCheckedChildren={intl.formatMessage({
                    id: 'pages.products.add.hide',
                  })}
                />
              </Form.Item>

              <Form.Item
                name="featured"
                label={intl.formatMessage({ id: 'pages.products.add.featured' })}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={intl.formatMessage({
                    id: 'pages.products.add.yes',
                  })}
                  unCheckedChildren={intl.formatMessage({
                    id: 'pages.products.add.no',
                  })}
                />
              </Form.Item>

              <Form.Item
                name="newArrival"
                label={intl.formatMessage({
                  id: 'pages.products.add.newArrival',
                })}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={intl.formatMessage({
                    id: 'pages.products.add.yes',
                  })}
                  unCheckedChildren={intl.formatMessage({
                    id: 'pages.products.add.no',
                  })}
                />
              </Form.Item>

              <Form.Item
                name="bestSeller"
                label={intl.formatMessage({
                  id: 'pages.products.add.bestSeller',
                })}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={intl.formatMessage({
                    id: 'pages.products.add.yes',
                  })}
                  unCheckedChildren={intl.formatMessage({
                    id: 'pages.products.add.no',
                  })}
                />
              </Form.Item>
            </Card>

            <Card
              title={intl.formatMessage({ id: 'pages.products.add.originInfo' })}
            >
              <Form.Item
                name="origin"
                label={intl.formatMessage({ id: 'pages.products.add.origin' })}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.products.add.originPlaceholder',
                  })}
                  size="large"
                >
                  <Option value="CN">
                    {intl.formatMessage({ id: 'pages.products.add.country.CN' })}
                  </Option>
                  <Option value="KR">
                    {intl.formatMessage({ id: 'pages.products.add.country.KR' })}
                  </Option>
                  <Option value="US">
                    {intl.formatMessage({ id: 'pages.products.add.country.US' })}
                  </Option>
                  <Option value="JP">
                    {intl.formatMessage({ id: 'pages.products.add.country.JP' })}
                  </Option>
                  <Option value="EU">
                    {intl.formatMessage({ id: 'pages.products.add.country.EU' })}
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="manufacturer"
                label={intl.formatMessage({
                  id: 'pages.products.add.manufacturer',
                })}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.products.add.manufacturerPlaceholder',
                  })}
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="importDate"
                label={intl.formatMessage({
                  id: 'pages.products.add.importDate',
                })}
              >
                <Input type="date" size="large" />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Preview Modal */}
      <Modal
        title={intl.formatMessage({ id: 'pages.products.add.previewModal' })}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ padding: 20 }}>
          <p>{intl.formatMessage({ id: 'pages.products.add.previewDev' })}</p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default AddProduct;
