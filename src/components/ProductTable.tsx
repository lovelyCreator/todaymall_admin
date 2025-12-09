import { Button, Checkbox, Input, message, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import ProductLogModal from './ProductLogModal';

interface Product {
  image: string;
  name: string;
  option: string;
  quantity: number;
  price: number;
}

interface ProductTableProps {
  products: Product[];
  orderNo: string;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, orderNo }) => {
  const intl = useIntl();
  const [trackingNumbers, setTrackingNumbers] = useState<{
    [key: number]: string;
  }>({});
  const [shippingCosts, setShippingCosts] = useState<{
    [key: number]: {
      actual: string;
      seller: string;
      refundSeller: string;
      refundMember: string;
    };
  }>({});
  const [quantities, setQuantities] = useState<{
    [key: number]: { actualPrice: string; actualQty: string };
  }>({});
  const [productNotes, setProductNotes] = useState<{ [key: number]: string }>(
    {},
  );
  const [sellerAddresses, setSellerAddresses] = useState<{
    [key: number]: string;
  }>({});
  const [productLogVisible, setProductLogVisible] = useState(false);
  const [selectedProductNo, setSelectedProductNo] = useState<string>('');

  const _handleBatchSaveTracking = () => {
    const filledTracking = Object.entries(trackingNumbers).filter(
      ([_, value]) => value.trim() !== '',
    );
    if (filledTracking.length === 0) {
      message.warning(intl.formatMessage({ id: 'pages.orders.productTable.noTrackingNumber' }));
      return;
    }
    message.success(
      intl.formatMessage({ id: 'pages.orders.productTable.trackingNumbersSaved' }, { count: filledTracking.length }),
    );
    console.log('Saved tracking numbers:', trackingNumbers);
  };

  const handleSaveShippingCost = (
    index: number,
    field: 'actual' | 'seller' | 'refundSeller' | 'refundMember',
  ) => {
    const value = shippingCosts[index]?.[field];
    if (!value || value.trim() === '') {
      message.warning(intl.formatMessage({ id: 'pages.orders.productTable.pleaseEnterAmount' }));
      return;
    }
    message.success(intl.formatMessage({ id: 'pages.orders.productTable.shippingCostSaved' }, { value }));
    console.log(`Saved ${field} for product ${index}:`, value);
  };

  const handleSaveQuantity = (
    index: number,
    field: 'actualPrice' | 'actualQty',
  ) => {
    const value = quantities[index]?.[field];
    if (!value || value.trim() === '') {
      message.warning(intl.formatMessage({ id: 'pages.orders.productTable.pleaseEnterValue' }));
      return;
    }
    message.success(
      field === 'actualPrice' 
        ? intl.formatMessage({ id: 'pages.orders.productTable.actualPriceSaved' })
        : intl.formatMessage({ id: 'pages.orders.productTable.actualQuantitySaved' }),
    );
    console.log(`Saved ${field} for product ${index}:`, value);
  };

  const handleSaveProductNote = (index: number) => {
    const note = productNotes[index];
    message.success(intl.formatMessage({ id: 'pages.orders.productTable.productNoteSaved' }));
    console.log(`Saved product note for ${index}:`, note);
  };

  const handleSaveSellerAddress = (index: number) => {
    const address = sellerAddresses[index];
    message.success(intl.formatMessage({ id: 'pages.orders.productTable.sellerAddressSaved' }));
    console.log(`Saved seller address for ${index}:`, address);
  };

  const calculateTotal = (index: number) => {
    const _product = products[index];
    const actualPrice = parseFloat(quantities[index]?.actualPrice || '0');
    const actualQty = parseFloat(quantities[index]?.actualQty || '0');
    return actualPrice * actualQty;
  };

  const handleViewProductLog = (productNo: string) => {
    setSelectedProductNo(productNo);
    setProductLogVisible(true);
  };

  // Mock product logs
  const mockProductLogs = [
    {
      no: 1,
      manager: '김지영',
      content: `상품수정 - Y25B01227

트래킹번호 : 976390/VIC → 976390/VIC
상품명 : tracksuit → tracksuit
수량 : 3 → 6
합계 : 240.00 → 480.00
색상 : 颜色: 粉色1, 白色1, 卡其色1 → 颜色: 粉色1, 白色2, 卡其色2
사이즈 : 尺码:均码1 → 尺码:均码1`,
      timestamp: '2025-11-11\n07:30',
    },
    {
      no: 2,
      manager: '김지영',
      content: `상품수정 - Y25B01227

트래킹번호 : 976390/VIC → 976390/VIC
상품명 : tracksuit → tracksuit
수량 : 6 → 3
합계 : 480.00 → 240.00
색상 : 颜色: 粉色2, 白色2, 卡其色2 → 颜色: 粉色1, 白色1, 卡其色1
사이즈 : 尺码:均码1 → 尺码:均码1`,
      timestamp: '2025-11-11\n07:19',
    },
    {
      no: 3,
      manager: '김지영',
      content: `상품추가 - Y25B01227

트래킹번호 : 976390/VIC
색상 : 颜色: 粉色2, 白色2, 卡其色2
사이즈 : 尺码:均码1
수량 : 6
합계 : 480.00`,
      timestamp: '2025-11-10\n15:16',
    },
  ];

  const [batchTrackingNumber, setBatchTrackingNumber] = useState('');

  const handleBatchSaveTrackingWithInput = () => {
    if (!batchTrackingNumber.trim()) {
      message.warning(intl.formatMessage({ id: 'pages.orders.productTable.pleaseEnterTrackingNumber' }));
      return;
    }
    // Apply the batch tracking number to all products
    const newTrackingNumbers: { [key: number]: string } = {};
    products.forEach((_, index) => {
      newTrackingNumbers[index] = batchTrackingNumber;
    });
    setTrackingNumbers(newTrackingNumbers);
    message.success(
      intl.formatMessage({ id: 'pages.orders.productTable.trackingNumberAppliedToAll' }, { trackingNumber: batchTrackingNumber }),
    );
    setBatchTrackingNumber('');
  };

  return (
    <>
      <ProductLogModal
        visible={productLogVisible}
        onClose={() => setProductLogVisible(false)}
        productNo={selectedProductNo}
        logs={mockProductLogs}
      />
      <div style={{ marginTop: 8, width: '100%' }}>
        {/* Top section: Batch tracking number input */}
        <div
          style={{
            marginBottom: 8,
            padding: 10,
            backgroundColor: '#f5f5f5',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: 14 }}>{intl.formatMessage({ id: 'pages.orders.productTable.trackingNumber' })}:</span>
          <Input
            placeholder={intl.formatMessage({ id: 'pages.orders.productTable.enterTrackingNumber' })}
            style={{ width: 250, fontSize: 13 }}
            value={batchTrackingNumber}
            onChange={(e) => setBatchTrackingNumber(e.target.value)}
          />
          <Button type="primary" onClick={handleBatchSaveTrackingWithInput}>
            {intl.formatMessage({ id: 'pages.orders.productTable.batchSave' })}
          </Button>
        </div>

        {/* Product table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #d9d9d9',
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 40,
                  }}
                >
                  {intl.formatMessage({ id: 'pages.orders.productTable.checkbox' })}
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 80,
                  }}
                >
                  {intl.formatMessage({ id: 'pages.orders.productTable.number' })}
                  <br />
                  {intl.formatMessage({ id: 'pages.orders.productTable.productStatus' })}
                  <br />
                  {intl.formatMessage({ id: 'pages.orders.productTable.productLog' })}
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 70,
                  }}
                >
                  {intl.formatMessage({ id: 'pages.orders.productTable.image' })}
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 180,
                  }}
                >
                  [{intl.formatMessage({ id: 'pages.orders.productTable.customsItem' })}]
                  <br />
                  {intl.formatMessage({ id: 'pages.orders.productTable.productName' })}
                  <br />
                  [{intl.formatMessage({ id: 'pages.orders.productTable.color' })}]
                  <br />
                  {intl.formatMessage({ id: 'pages.orders.productTable.size' })}
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 100,
                  }}
                >
                  {intl.formatMessage({ id: 'pages.orders.productTable.productNumber' })} / {intl.formatMessage({ id: 'pages.orders.productTable.material' })}
                  <br />
                  {intl.formatMessage({ id: 'pages.orders.productTable.sellerInfo' })}
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 120,
                  }}
                >
                  [{intl.formatMessage({ id: 'pages.orders.productTable.trackingNo' })}]
                  <br />
                  {intl.formatMessage({ id: 'pages.orders.productTable.orderNo' })}
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 180,
                  }}
                >
                  ({intl.formatMessage({ id: 'pages.orders.productTable.exposureOX' })})
                  <br />
                  [{intl.formatMessage({ id: 'pages.orders.productTable.shippingCost' })}] {intl.formatMessage({ id: 'pages.orders.productTable.actual' })}(O) / {intl.formatMessage({ id: 'pages.orders.productTable.seller' })}(X)
                  <br />
                  [{intl.formatMessage({ id: 'pages.orders.productTable.refundCost' })}] {intl.formatMessage({ id: 'pages.orders.productTable.seller' })}(X) / {intl.formatMessage({ id: 'pages.orders.productTable.member' })}(O)
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 200,
                  }}
                >
                  {intl.formatMessage({ id: 'pages.orders.productTable.unitPrice' })} * {intl.formatMessage({ id: 'pages.orders.productTable.quantity' })}
                  <br />
                  {intl.formatMessage({ id: 'pages.orders.productTable.totalAmount' })} / {intl.formatMessage({ id: 'pages.orders.productTable.actualPaidAmount' })}
                  <br />* {intl.formatMessage({ id: 'pages.orders.productTable.actualQuantity' })}
                  <br />
                  {intl.formatMessage({ id: 'pages.orders.productTable.totalAmount' })}
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 80,
                  }}
                >
                  [{intl.formatMessage({ id: 'pages.orders.productTable.rackNumber' })}]
                  <br />
                  {intl.formatMessage({ id: 'pages.orders.productTable.previousRackNumber' })}
                </th>
                <th
                  style={{
                    padding: '8px',
                    border: '1px solid #d9d9d9',
                    fontSize: 11,
                    textAlign: 'center',
                    width: 60,
                  }}
                >
                  -
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <React.Fragment key={index}>
                  {/* First line: Main data */}
                  <tr>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        textAlign: 'center',
                      }}
                    >
                      <Checkbox />
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        textAlign: 'center',
                      }}
                    >
                      <Space direction="vertical" size={2}>
                        <div style={{ fontSize: 11 }}>No. {index + 1}</div>
                        <Tag
                          color="green"
                          style={{ fontSize: 10, padding: '0 4px' }}
                        >
                          {intl.formatMessage({ id: 'pages.orders.productTable.shipped' })}
                        </Tag>
                        <Button
                          size="small"
                          type="link"
                          style={{ fontSize: 10, padding: 0 }}
                          onClick={() =>
                            handleViewProductLog(`${orderNo}-${index + 1}`)
                          }
                        >
                          {intl.formatMessage({ id: 'pages.orders.productTable.log' })}
                        </Button>
                      </Space>
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        textAlign: 'center',
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        fontSize: 11,
                      }}
                    >
                      <div>[{intl.formatMessage({ id: 'pages.orders.productTable.furniture' })}]</div>
                      <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                      <div>[{product.option}]</div>
                      <div>L {intl.formatMessage({ id: 'pages.orders.productTable.size' })}</div>
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        fontSize: 11,
                        textAlign: 'center',
                      }}
                    >
                      <div>{intl.formatMessage({ id: 'pages.orders.productTable.productNumber' })}: FUR123</div>
                      <div>{intl.formatMessage({ id: 'pages.orders.productTable.material' })}: {intl.formatMessage({ id: 'pages.orders.productTable.cotton' })}</div>
                      <div style={{ color: '#1890ff' }}>{intl.formatMessage({ id: 'pages.orders.productTable.sellerA' })}</div>
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        fontSize: 11,
                      }}
                    >
                      <Space
                        direction="vertical"
                        size={2}
                        style={{ width: '100%' }}
                      >
                        <Input
                          placeholder={intl.formatMessage({ id: 'pages.orders.productTable.trackingNumber' })}
                          size="small"
                          value={trackingNumbers[index] || ''}
                          onChange={(e) =>
                            setTrackingNumbers({
                              ...trackingNumbers,
                              [index]: e.target.value,
                            })
                          }
                          style={{ fontSize: 11 }}
                        />
                        <div style={{ color: '#666', textAlign: 'center' }}>
                          ORD{index + 1001}
                        </div>
                      </Space>
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        fontSize: 11,
                      }}
                    >
                      <Space
                        direction="vertical"
                        size={2}
                        style={{ width: '100%' }}
                      >
                        <div>({intl.formatMessage({ id: 'pages.orders.productTable.exposureO' })})</div>
                        <Space size={2}>
                          <span>¥</span>
                          <Input
                            size="small"
                            style={{ width: 50, fontSize: 11 }}
                            value={shippingCosts[index]?.actual || ''}
                            onChange={(e) =>
                              setShippingCosts({
                                ...shippingCosts,
                                [index]: {
                                  ...shippingCosts[index],
                                  actual: e.target.value,
                                },
                              })
                            }
                          />
                          <Button
                            size="small"
                            style={{ fontSize: 10, padding: '0 4px' }}
                            onClick={() =>
                              handleSaveShippingCost(index, 'actual')
                            }
                          >
                            {intl.formatMessage({ id: 'pages.orders.user.register' })}
                          </Button>
                          <span>¥</span>
                          <Input
                            size="small"
                            style={{ width: 50, fontSize: 11 }}
                            value={shippingCosts[index]?.seller || ''}
                            onChange={(e) =>
                              setShippingCosts({
                                ...shippingCosts,
                                [index]: {
                                  ...shippingCosts[index],
                                  seller: e.target.value,
                                },
                              })
                            }
                          />
                          <Button
                            size="small"
                            style={{ fontSize: 10, padding: '0 4px' }}
                            onClick={() =>
                              handleSaveShippingCost(index, 'seller')
                            }
                          >
                            {intl.formatMessage({ id: 'pages.orders.user.register' })}
                          </Button>
                        </Space>
                        <Space size={2}>
                          <span>¥</span>
                          <Input
                            size="small"
                            style={{ width: 50, fontSize: 11 }}
                            value={shippingCosts[index]?.refundSeller || ''}
                            onChange={(e) =>
                              setShippingCosts({
                                ...shippingCosts,
                                [index]: {
                                  ...shippingCosts[index],
                                  refundSeller: e.target.value,
                                },
                              })
                            }
                          />
                          <Button
                            size="small"
                            style={{ fontSize: 10, padding: '0 4px' }}
                            onClick={() =>
                              handleSaveShippingCost(index, 'refundSeller')
                            }
                          >
                            {intl.formatMessage({ id: 'pages.orders.user.register' })}
                          </Button>
                          <span>¥</span>
                          <Input
                            size="small"
                            style={{ width: 50, fontSize: 11 }}
                            value={shippingCosts[index]?.refundMember || ''}
                            onChange={(e) =>
                              setShippingCosts({
                                ...shippingCosts,
                                [index]: {
                                  ...shippingCosts[index],
                                  refundMember: e.target.value,
                                },
                              })
                            }
                          />
                          <Button
                            size="small"
                            style={{ fontSize: 10, padding: '0 4px' }}
                            onClick={() =>
                              handleSaveShippingCost(index, 'refundMember')
                            }
                          >
                            {intl.formatMessage({ id: 'pages.orders.user.register' })}
                          </Button>
                        </Space>
                      </Space>
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        fontSize: 11,
                      }}
                    >
                      <Space
                        direction="vertical"
                        size={2}
                        style={{ width: '100%' }}
                      >
                        <div>
                          ¥{(product.price / 180).toFixed(2)} *{' '}
                          {product.quantity}
                        </div>
                        <div style={{ fontWeight: 'bold' }}>
                          ¥
                          {((product.price * product.quantity) / 180).toFixed(
                            2,
                          )}{' '}
                          ($
                          {(
                            (product.price * product.quantity) /
                            180 /
                            6.5
                          ).toFixed(2)}
                          )
                        </div>
                        <Space size={2}>
                          <Input
                            size="small"
                            placeholder={intl.formatMessage({ id: 'pages.orders.productTable.actualPaid' })}
                            style={{ width: 60, fontSize: 11 }}
                            value={quantities[index]?.actualPrice || ''}
                            onChange={(e) =>
                              setQuantities({
                                ...quantities,
                                [index]: {
                                  ...quantities[index],
                                  actualPrice: e.target.value,
                                },
                              })
                            }
                          />
                          <Button
                            size="small"
                            style={{ fontSize: 10, padding: '0 4px' }}
                            onClick={() =>
                              handleSaveQuantity(index, 'actualPrice')
                            }
                          >
                            {intl.formatMessage({ id: 'pages.orders.user.register' })}
                          </Button>
                          <span>*</span>
                          <Input
                            size="small"
                            placeholder={intl.formatMessage({ id: 'pages.orders.productTable.actualQuantity' })}
                            style={{ width: 50, fontSize: 11 }}
                            value={quantities[index]?.actualQty || ''}
                            onChange={(e) =>
                              setQuantities({
                                ...quantities,
                                [index]: {
                                  ...quantities[index],
                                  actualQty: e.target.value,
                                },
                              })
                            }
                          />
                          <Button
                            size="small"
                            style={{ fontSize: 10, padding: '0 4px' }}
                            onClick={() =>
                              handleSaveQuantity(index, 'actualQty')
                            }
                          >
                            {intl.formatMessage({ id: 'pages.orders.user.register' })}
                          </Button>
                        </Space>
                        <div style={{ color: '#1890ff' }}>
                          {intl.formatMessage({ id: 'pages.orders.productTable.totalActualPaid' })}: ¥{calculateTotal(index).toFixed(2)}
                        </div>
                      </Space>
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        fontSize: 11,
                        textAlign: 'center',
                      }}
                    >
                      <div>A-12-05</div>
                      <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'pages.orders.productTable.previous' })}: -</div>
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        fontSize: 11,
                        textAlign: 'center',
                      }}
                    >
                      <Tag
                        color="blue"
                        style={{ fontSize: 10, padding: '0 4px' }}
                      >
                        {intl.formatMessage({ id: 'pages.orders.productTable.arrivalExpected' })}
                      </Tag>
                    </td>
                  </tr>

                  {/* Second line: Notes and seller address - more compact layout */}
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #d9d9d9',
                        backgroundColor: '#fafafa',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: 16,
                          alignItems: 'center',
                        }}
                      >
                        {/* Product notes */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            flex: 1,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 'bold',
                              fontSize: 11,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {intl.formatMessage({ id: 'pages.orders.productTable.productMemo' })}:
                          </span>
                          <Input
                            placeholder={intl.formatMessage({ id: 'pages.orders.productTable.enterProductMemo' })}
                            style={{ flex: 1, fontSize: 11 }}
                            size="small"
                            value={productNotes[index] || ''}
                            onChange={(e) =>
                              setProductNotes({
                                ...productNotes,
                                [index]: e.target.value,
                              })
                            }
                          />
                          <Button
                            size="small"
                            type="primary"
                            style={{ fontSize: 11, padding: '0 8px' }}
                            onClick={() => handleSaveProductNote(index)}
                          >
                            {intl.formatMessage({ id: 'pages.orders.user.register' })}
                          </Button>
                        </div>

                        {/* Seller address */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            flex: 1,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 'bold',
                              fontSize: 11,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {intl.formatMessage({ id: 'pages.orders.productTable.sellerAddress' })}:
                          </span>
                          <Input
                            placeholder={intl.formatMessage({ id: 'pages.orders.productTable.enterSellerAddress' })}
                            style={{ flex: 1, fontSize: 11 }}
                            size="small"
                            value={sellerAddresses[index] || ''}
                            onChange={(e) =>
                              setSellerAddresses({
                                ...sellerAddresses,
                                [index]: e.target.value,
                              })
                            }
                          />
                          <Button
                            size="small"
                            type="primary"
                            style={{ fontSize: 11, padding: '0 8px' }}
                            onClick={() => handleSaveSellerAddress(index)}
                          >
                            {intl.formatMessage({ id: 'pages.orders.user.register' })}
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductTable;
