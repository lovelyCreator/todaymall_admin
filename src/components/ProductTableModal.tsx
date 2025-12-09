import { Button, Checkbox, Input, Modal, Space, Tag } from 'antd';
import React from 'react';

interface Product {
  image: string;
  name: string;
  option: string;
  quantity: number;
  price: number;
}

interface ProductTableModalProps {
  visible: boolean;
  onClose: () => void;
  products: Product[];
  orderNo: string;
}

const ProductTableModal: React.FC<ProductTableModalProps> = ({
  visible,
  onClose,
  products,
  orderNo,
}) => {
  return (
    <Modal
      title={`주문 상품 목록 - ${orderNo}`}
      open={visible}
      onCancel={onClose}
      width={1400}
      footer={null}
    >
      {/* Top section: Tracking number input */}
      <div
        style={{
          marginBottom: 16,
          padding: 12,
          backgroundColor: '#f5f5f5',
          borderRadius: 4,
        }}
      >
        <Space>
          <span style={{ fontWeight: 'bold', fontSize: 12 }}>
            트래킹번호 입력:
          </span>
          <Input placeholder="트래킹번호" style={{ width: 200 }} />
          <Button type="primary" size="small">
            등록
          </Button>
        </Space>
      </div>

      {/* Product table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d9d9d9',
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
                  width: 100,
                }}
              >
                번호
                <br />
                체크박스
                <br />
                상품상태
                <br />
                상품로그
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
                이미지
              </th>
              <th
                style={{
                  padding: '8px',
                  border: '1px solid #d9d9d9',
                  fontSize: 11,
                  textAlign: 'center',
                  minWidth: 200,
                }}
              >
                [통관품목]
                <br />
                상품명
                <br />
                [색상]
                <br />
                사이즈
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
                품번 / 재질
                <br />
                판매자정보
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
                [Tracking No]
                <br />
                Order No
              </th>
              <th
                style={{
                  padding: '8px',
                  border: '1px solid #d9d9d9',
                  fontSize: 11,
                  textAlign: 'center',
                  width: 150,
                }}
              >
                (노출OX)
                <br />
                [배송비용] 실제(O) / 판매자(X)
                <br />
                [환불비용] 판매자(X) / 회원(O)
              </th>
              <th
                style={{
                  padding: '8px',
                  border: '1px solid #d9d9d9',
                  fontSize: 11,
                  textAlign: 'center',
                  width: 150,
                }}
              >
                단가 * 수량
                <br />
                총액 / 실지불금액
                <br />* 실수량
                <br />
                총액
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
                [랙번호]
                <br />
                이전 랙번호
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
                    <Space direction="vertical" size={4}>
                      <div style={{ fontSize: 11 }}>No. {index + 1}</div>
                      <Checkbox />
                      <Tag color="green" style={{ fontSize: 10 }}>
                        출고
                      </Tag>
                      <Button
                        size="small"
                        type="link"
                        style={{ fontSize: 10, padding: 0 }}
                      >
                        로그
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
                      style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      border: '1px solid #d9d9d9',
                      fontSize: 11,
                    }}
                  >
                    <div>[가구]</div>
                    <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                    <div>[{product.option}]</div>
                    <div>L 사이즈</div>
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      border: '1px solid #d9d9d9',
                      fontSize: 11,
                      textAlign: 'center',
                    }}
                  >
                    <div>품번: FUR123</div>
                    <div>재질: 면</div>
                    <div style={{ color: '#1890ff' }}>판매자A</div>
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      border: '1px solid #d9d9d9',
                      fontSize: 11,
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      TRK{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                    <div style={{ color: '#666' }}>ORD{index + 1001}</div>
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      border: '1px solid #d9d9d9',
                      fontSize: 11,
                      textAlign: 'center',
                    }}
                  >
                    <div>(노출 O)</div>
                    <div>배송: ¥50 / ¥0</div>
                    <div>환불: ¥0 / ¥0</div>
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      border: '1px solid #d9d9d9',
                      fontSize: 11,
                      textAlign: 'right',
                    }}
                  >
                    <div>
                      ¥{(product.price / 180).toFixed(2)} * {product.quantity}
                    </div>
                    <div style={{ fontWeight: 'bold' }}>
                      ¥{((product.price * product.quantity) / 180).toFixed(2)}
                    </div>
                    <div style={{ color: '#1890ff' }}>
                      실지불: ¥
                      {((product.price * product.quantity) / 180).toFixed(2)}
                    </div>
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
                    <div style={{ color: '#666' }}>이전: -</div>
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      border: '1px solid #d9d9d9',
                      fontSize: 11,
                      textAlign: 'center',
                    }}
                  >
                    <Tag color="blue" style={{ fontSize: 10 }}>
                      도착예정
                    </Tag>
                  </td>
                </tr>

                {/* Second line: Notes and seller address */}
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: '8px',
                      border: '1px solid #d9d9d9',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <Space
                      direction="vertical"
                      size={4}
                      style={{ width: '100%' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 'bold',
                            fontSize: 11,
                            minWidth: 80,
                          }}
                        >
                          상품 비고:
                        </span>
                        <Input
                          placeholder="상품 비고 입력"
                          style={{ flex: 1, fontSize: 11 }}
                        />
                        <Button size="small" type="primary">
                          등록
                        </Button>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 'bold',
                            fontSize: 11,
                            minWidth: 80,
                          }}
                        >
                          판매자 주소:
                        </span>
                        <Input
                          placeholder="판매자 주소 입력"
                          style={{ flex: 1, fontSize: 11 }}
                        />
                        <Button size="small" type="primary">
                          등록
                        </Button>
                      </div>
                    </Space>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default ProductTableModal;
