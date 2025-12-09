import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  SyncOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-table';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Modal,
  message,
  Row,
  Select,
  Space,
  Statistic,
  Steps,
  Table,
  Tag,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useRef, useState } from 'react';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

interface TrackingItem {
  orderNo: string;
  trackingNumber: string;
  carrier: string;
  shippingDate: string;
  status: 'success' | 'error' | 'pending';
  errorMessage?: string;
  customerName: string;
  productCount: number;
}

const BatchTracking: React.FC = () => {
  const _actionRef = useRef<ActionType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);

  // Statistics
  const totalCount = trackingData.length;
  const successCount = trackingData.filter(
    (item) => item.status === 'success',
  ).length;
  const errorCount = trackingData.filter(
    (item) => item.status === 'error',
  ).length;
  const pendingCount = trackingData.filter(
    (item) => item.status === 'pending',
  ).length;

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.warning('파일을 선택해주세요');
      return;
    }

    setUploading(true);

    // Simulate file upload and parsing
    setTimeout(() => {
      const mockData: TrackingItem[] = Array.from({ length: 20 }, (_, i) => ({
        orderNo: `TAO2025${String(1000 + i).padStart(4, '0')}`,
        trackingNumber:
          i % 5 === 0
            ? ''
            : `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        carrier: ['CJ대한통운', '우체국택배', '한진택배', '로젠택배'][i % 4],
        shippingDate: `2025-11-${String((i % 28) + 1).padStart(2, '0')}`,
        status: i % 5 === 0 ? 'error' : 'pending',
        errorMessage: i % 5 === 0 ? '운송장번호가 비어있습니다' : undefined,
        customerName: `고객${i + 1}`,
        productCount: Math.floor(Math.random() * 5) + 1,
      }));

      setTrackingData(mockData);
      setUploading(false);
      setCurrentStep(1);
      message.success('파일 업로드 완료');
    }, 1500);
  };

  const handleProcess = () => {
    setProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const updatedData = trackingData.map((item) => {
        if (item.status === 'pending' && item.trackingNumber) {
          return { ...item, status: 'success' as const };
        }
        return item;
      });

      setTrackingData(updatedData);
      setProcessing(false);
      setCurrentStep(2);
      message.success('운송장 등록이 완료되었습니다');
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    message.success('템플릿 파일 다운로드를 시작합니다');
    // In real implementation, trigger file download
  };

  const handleDownloadErrors = () => {
    const errors = trackingData.filter((item) => item.status === 'error');
    if (errors.length === 0) {
      message.info('오류가 없습니다');
      return;
    }
    message.success(`${errors.length}건의 오류 데이터를 다운로드합니다`);
  };

  const columns: ColumnsType<TrackingItem> = [
    {
      title: '상태',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => {
        const statusConfig = {
          success: {
            color: 'success',
            icon: <CheckCircleOutlined />,
            text: '성공',
          },
          error: {
            color: 'error',
            icon: <CloseCircleOutlined />,
            text: '오류',
          },
          pending: {
            color: 'processing',
            icon: <SyncOutlined spin />,
            text: '대기',
          },
        };
        const config = statusConfig[record.status as keyof typeof statusConfig];
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '주문번호',
      dataIndex: 'orderNo',
      width: 150,
      render: (_, record) => (
        <strong style={{ color: '#1890ff' }}>{record.orderNo}</strong>
      ),
    },
    {
      title: '고객명',
      dataIndex: 'customerName',
      width: 100,
    },
    {
      title: '상품수',
      dataIndex: 'productCount',
      width: 80,
      render: (_, record) => `${record.productCount}개`,
    },
    {
      title: '운송장번호',
      dataIndex: 'trackingNumber',
      width: 150,
      render: (_, record) => {
        if (record.status === 'error' && !record.trackingNumber) {
          return <Tag color="red">미입력</Tag>;
        }
        return record.trackingNumber || '-';
      },
    },
    {
      title: '택배사',
      dataIndex: 'carrier',
      width: 120,
      render: (_, record) => <Tag color="blue">{record.carrier}</Tag>,
    },
    {
      title: '출고일자',
      dataIndex: 'shippingDate',
      width: 120,
    },
    {
      title: '오류 메시지',
      dataIndex: 'errorMessage',
      width: 200,
      render: (_, record) =>
        record.errorMessage ? (
          <span style={{ color: '#ff4d4f' }}>{record.errorMessage}</span>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <PageContainer
      title="운송장 일괄 등록"
      subTitle="엑셀 파일로 여러 주문의 운송장을 한번에 등록할 수 있습니다"
    >
      {/* Steps */}
      <Card style={{ marginBottom: 24 }}>
        <Steps current={currentStep}>
          <Step
            title="파일 업로드"
            description="엑셀 파일 선택"
            icon={<UploadOutlined />}
          />
          <Step
            title="데이터 확인"
            description="업로드된 데이터 검증"
            icon={<InfoCircleOutlined />}
          />
          <Step
            title="등록 완료"
            description="운송장 등록 완료"
            icon={<CheckCircleOutlined />}
          />
        </Steps>
      </Card>

      {/* Step 0: Upload */}
      {currentStep === 0 && (
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="엑셀 파일 업로드 안내"
              description={
                <div>
                  <p>• 지원 형식: .xlsx, .xls</p>
                  <p>• 필수 컬럼: 주문번호, 운송장번호, 택배사, 출고일자</p>
                  <p>• 최대 1,000건까지 한번에 등록 가능</p>
                  <p>• 템플릿 파일을 다운로드하여 양식에 맞게 작성해주세요</p>
                </div>
              }
              type="info"
              showIcon
            />

            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Upload
                fileList={fileList}
                onChange={({ fileList: newFileList }) =>
                  setFileList(newFileList)
                }
                beforeUpload={() => false}
                accept=".xlsx,.xls"
                maxCount={1}
              >
                <Button
                  icon={<UploadOutlined />}
                  size="large"
                  type="dashed"
                  style={{ height: 100, width: 300 }}
                >
                  <div style={{ marginTop: 8 }}>
                    <FileExcelOutlined
                      style={{ fontSize: 32, color: '#52c41a' }}
                    />
                    <div style={{ marginTop: 8 }}>엑셀 파일 선택</div>
                  </div>
                </Button>
              </Upload>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadTemplate}
                >
                  템플릿 다운로드
                </Button>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={handleUpload}
                  loading={uploading}
                  disabled={fileList.length === 0}
                  size="large"
                >
                  파일 업로드
                </Button>
                <Button onClick={() => setManualModalVisible(true)}>
                  수동 입력
                </Button>
              </Space>
            </div>
          </Space>
        </Card>
      )}

      {/* Step 1: Review Data */}
      {currentStep === 1 && (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="전체"
                  value={totalCount}
                  prefix={<FileExcelOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="정상"
                  value={successCount}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="오류"
                  value={errorCount}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="대기"
                  value={pendingCount}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<SyncOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {errorCount > 0 && (
            <Alert
              message={`${errorCount}건의 오류가 발견되었습니다`}
              description="오류가 있는 항목은 등록되지 않습니다. 오류 데이터를 다운로드하여 수정 후 다시 업로드해주세요."
              type="error"
              showIcon
              action={
                <Button size="small" danger onClick={handleDownloadErrors}>
                  오류 데이터 다운로드
                </Button>
              }
              style={{ marginBottom: 24 }}
            />
          )}

          <Card
            title={`업로드된 데이터 (${totalCount}건)`}
            extra={
              <Space>
                <Button onClick={() => setCurrentStep(0)}>다시 업로드</Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleProcess}
                  loading={processing}
                  disabled={pendingCount === 0}
                >
                  운송장 등록 ({pendingCount}건)
                </Button>
              </Space>
            }
          >
            <Table
              dataSource={trackingData}
              columns={columns}
              rowKey="orderNo"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </>
      )}

      {/* Step 2: Complete */}
      {currentStep === 2 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />
            <h2 style={{ marginTop: 24 }}>운송장 등록이 완료되었습니다</h2>
            <p style={{ fontSize: 16, color: '#666', marginTop: 16 }}>
              총 {successCount}건의 운송장이 성공적으로 등록되었습니다
            </p>

            {errorCount > 0 && (
              <Alert
                message={`${errorCount}건의 오류가 있습니다`}
                description="오류가 있는 항목은 등록되지 않았습니다"
                type="warning"
                showIcon
                style={{ marginTop: 24, maxWidth: 600, margin: '24px auto' }}
              />
            )}

            <Space size="large" style={{ marginTop: 32 }}>
              <Button size="large" onClick={() => window.location.reload()}>
                새로 등록하기
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => (window.location.href = '/orders/user')}
              >
                주문 관리로 이동
              </Button>
            </Space>

            <Divider />

            <div style={{ marginTop: 32 }}>
              <h3>등록 결과 상세</h3>
              <Table
                dataSource={trackingData}
                columns={columns}
                rowKey="orderNo"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Manual Input Modal */}
      <Modal
        title="운송장 수동 입력"
        open={manualModalVisible}
        onCancel={() => setManualModalVisible(false)}
        onOk={() => {
          message.success('운송장이 등록되었습니다');
          setManualModalVisible(false);
        }}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="주문번호" size="large" />
          <Input placeholder="운송장번호" size="large" />
          <Select
            placeholder="택배사 선택"
            size="large"
            style={{ width: '100%' }}
          >
            <Option value="cj">CJ대한통운</Option>
            <Option value="post">우체국택배</Option>
            <Option value="hanjin">한진택배</Option>
            <Option value="logen">로젠택배</Option>
            <Option value="kdexp">경동택배</Option>
          </Select>
          <Input type="date" placeholder="출고일자" size="large" />
          <TextArea rows={3} placeholder="메모 (선택사항)" />
        </Space>
      </Modal>
    </PageContainer>
  );
};

export default BatchTracking;
