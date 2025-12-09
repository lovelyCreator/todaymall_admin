import {
  DeleteOutlined,
  ScanOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button, Card, Input, Modal, message, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const { Option } = Select;

interface BarcodeScanModalProps {
  visible: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
}

interface OrderResult {
  orderNo: string;
  trackingNo: string;
  receivedDate: string;
  rackNo: string;
  operator: string;
}

const BarcodeScanModal: React.FC<BarcodeScanModalProps> = ({
  visible,
  onClose,
  onScan,
}) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchTrackingNumber, setSearchTrackingNumber] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [warehouse, setWarehouse] = useState('광저우');
  const [language, setLanguage] = useState('Korean');
  const [searchResults, setSearchResults] = useState<OrderResult[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showScannerChoice, setShowScannerChoice] = useState(false);
  const [scannerMode, setScannerMode] = useState<'device' | null>(null);
  const [showRackAssignment, setShowRackAssignment] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResult | null>(null);
  const [rackSize, setRackSize] = useState('소');
  const webcamRef = useRef<Webcam>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanBufferRef = useRef<string>('');
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Camera scanning effect
  useEffect(() => {
    if (showCamera) {
      const timer = setTimeout(() => {
        startScanning();
      }, 500);
      return () => {
        clearTimeout(timer);
        if (codeReaderRef.current) {
          codeReaderRef.current.reset();
        }
      };
    }

    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    return undefined;
  }, [showCamera]);

  // Professional scanner device listener
  useEffect(() => {
    if (scannerMode !== 'device' || !visible) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Clear previous timeout
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }

      // Enter key means scan is complete
      if (e.key === 'Enter') {
        if (scanBufferRef.current.length > 0) {
          const scannedValue = scanBufferRef.current;
          console.log('Scanner device detected:', scannedValue);
          setTrackingNumber(scannedValue);
          message.success(`바코드 스캔 완료: ${scannedValue}`);
          scanBufferRef.current = '';
          setScannerMode(null);
        }
        return;
      }

      // Build the barcode string
      if (e.key.length === 1) {
        scanBufferRef.current += e.key;

        // Reset buffer after 100ms of no input (scanner types very fast)
        scanTimeoutRef.current = setTimeout(() => {
          scanBufferRef.current = '';
        }, 100);
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      scanBufferRef.current = '';
    };
  }, [scannerMode, visible]);

  const startScanning = async () => {
    if (!webcamRef.current) {
      console.log('Webcam ref not available');
      return;
    }

    const videoElement = webcamRef.current.video;
    if (!videoElement) {
      console.log('Video element not available');
      return;
    }

    // Wait for video to be ready
    if (videoElement.readyState < 2) {
      console.log('Video not ready, waiting...');
      videoElement.addEventListener(
        'loadeddata',
        () => {
          startScanning();
        },
        { once: true },
      );
      return;
    }

    try {
      codeReaderRef.current = new BrowserMultiFormatReader();
      console.log('Starting barcode scanner...');

      await codeReaderRef.current.decodeFromVideoDevice(
        null,
        videoElement,
        (result, error) => {
          if (result) {
            const scannedText = result.getText();
            console.log('Barcode detected:', scannedText);
            setTrackingNumber(scannedText);
            setShowCamera(false);
            message.success(`바코드 스캔 완료: ${scannedText}`);
            if (codeReaderRef.current) {
              codeReaderRef.current.reset();
            }
          }
          if (error && error.name !== 'NotFoundException') {
            console.error('Scan error:', error);
          }
        },
      );
    } catch (err) {
      console.error('Barcode scanning error:', err);
      message.error('바코드 스캔 중 오류가 발생했습니다');
    }
  };

  const handleSearch = (searchValue?: string) => {
    const valueToSearch = searchValue || searchTrackingNumber;
    if (!valueToSearch.trim()) {
      message.warning('트래킹번호를 입력하세요');
      return;
    }

    // Mock search results
    const mockResults: OrderResult[] = [
      {
        orderNo: 'A25B00821(배특송-숨)',
        trackingNo: '974345VVIC',
        receivedDate: '2025-11-05 16:22',
        rackNo: '',
        operator: '林茂盛',
      },
      {
        orderNo: 'A25B01118(배특송-숨)',
        trackingNo: '973457VVIC',
        receivedDate: '2025-11-04 16:32',
        rackNo: '',
        operator: '林茂盛',
      },
    ];

    setSearchResults(mockResults);
    onScan(valueToSearch);
    message.success(`${mockResults.length}건의 주문을 찾았습니다`);
  };

  const handleRegister = () => {
    if (!trackingNumber.trim()) {
      message.warning('트래킹번호를 입력하세요');
      return;
    }
    message.success(`등록: ${trackingNumber}`);
    // Add to search results
    handleSearch(trackingNumber);
  };

  const handleClose = () => {
    setTrackingNumber('');
    setSearchTrackingNumber('');
    setDepositAmount('');
    setSearchResults([]);
    setShowCamera(false);
    setShowScannerChoice(false);
    setScannerMode(null);
    scanBufferRef.current = '';
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    onClose();
  };

  const handleScanClick = () => {
    setShowScannerChoice(true);
  };

  const handleCameraMode = () => {
    setShowScannerChoice(false);
    setShowCamera(true);
    setScannerMode(null);
  };

  const handleDeviceMode = () => {
    setShowScannerChoice(false);
    setScannerMode('device');
    message.info('스캐너 장치로 바코드를 스캔하세요');
  };

  const handleCancelScan = () => {
    setShowCamera(false);
    setScannerMode(null);
    setShowScannerChoice(false);
  };

  const handleDeleteResult = (index: number) => {
    const newResults = searchResults.filter((_, i) => i !== index);
    setSearchResults(newResults);
    message.success('삭제되었습니다');
  };

  const handleRackLabel = (order: OrderResult) => {
    setSelectedOrder(order);
    setShowRackAssignment(true);
  };

  const handleCheckLabel = (order: OrderResult) => {
    message.success(`${order.orderNo} 점수라벨`);
  };

  const handleRackRecheck = () => {
    message.success('재검색');
  };

  const handleRackSave = () => {
    if (!selectedOrder) return;
    message.success(`${selectedOrder.orderNo} 랙 저장 완료`);
    setShowRackAssignment(false);
    setSelectedOrder(null);
  };

  const handleRackReset = () => {
    message.success('초기화');
    setRackSize('소');
  };

  const handleBackFromRack = () => {
    setShowRackAssignment(false);
    setSelectedOrder(null);
  };

  return (
    <Modal
      title={
        <div
          style={{
            background: 'linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)',
            color: 'white',
            padding: '10px 16px',
            margin: '-20px -24px 20px -24px',
            fontSize: 18,
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Admin</span>
          </div>
          <span style={{ flex: 1, textAlign: 'center' }}>
            {showRackAssignment ? '랙지정' : '입고스캔'}
          </span>
          <Space size="small">
            <Select
              value={warehouse}
              onChange={setWarehouse}
              style={{ width: 90 }}
              size="small"
            >
              <Option value="광저우">광저우</Option>
              <Option value="위해">위해</Option>
              <Option value="청도">청도</Option>
              <Option value="이우">이우</Option>
            </Select>
            <Select
              value={language}
              onChange={setLanguage}
              style={{ width: 90 }}
              size="small"
            >
              <Option value="Korean">Korean</Option>
              <Option value="English">English</Option>
              <Option value="Chinese">Chinese</Option>
            </Select>
          </Space>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
      closeIcon={null}
      styles={{
        header: { padding: 0, border: 'none', marginBottom: 0 },
        body: { padding: '24px' },
      }}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '4px' }}>
        {showRackAssignment && selectedOrder ? (
          /* Rack Assignment View */
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* Tracking Number Display */}
            <div
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14, color: '#666' }}>트래킹번호 :</span>
              <span
                style={{ fontSize: 20, fontWeight: 'bold', color: '#ff4d4f' }}
              >
                {selectedOrder.trackingNo}
              </span>
            </div>

            {/* Order Info Table */}
            <table
              style={{
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: 4,
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: '12px 16px',
                      color: '#666',
                      fontSize: 14,
                      width: '30%',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    주문번호
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    {selectedOrder.orderNo}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '12px 16px',
                      color: '#666',
                      fontSize: 14,
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    랙번호
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    {selectedOrder.rackNo || ''}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '12px 16px',
                      color: '#666',
                      fontSize: 14,
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    변경랙
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Select
                      value={rackSize}
                      onChange={setRackSize}
                      style={{ width: '100%' }}
                      size="large"
                    >
                      <Option value="소">소</Option>
                      <Option value="중">중</Option>
                      <Option value="대">대</Option>
                    </Select>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Action Buttons */}
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  size="large"
                  block
                  onClick={handleRackRecheck}
                  style={{
                    flex: 1,
                    height: 56,
                    fontSize: 16,
                    fontWeight: 'bold',
                    backgroundColor: '#595959',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  재검색
                </Button>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleRackSave}
                  style={{
                    flex: 1,
                    height: 56,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  저장
                </Button>
                <Button
                  size="large"
                  block
                  onClick={handleRackReset}
                  style={{
                    flex: 1,
                    height: 56,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  초기화
                </Button>
              </div>

              {/* Cancel Button */}
              <Button
                size="large"
                block
                onClick={handleBackFromRack}
                style={{
                  height: 56,
                  fontSize: 16,
                  fontWeight: 'bold',
                  backgroundColor: '#595959',
                  color: 'white',
                  border: 'none',
                }}
              >
                취소
              </Button>
            </Space>
          </Space>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* Input Table with Barcode Button */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#595959' }}>
                  <th
                    style={{
                      color: 'white',
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                  >
                    트래킹번호
                  </th>
                  <th
                    style={{
                      color: 'white',
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                  >
                    착불금 (元)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px' }}>
                    <Input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      onPressEnter={handleRegister}
                      size="large"
                      style={{ fontSize: 16 }}
                    />
                  </td>
                  <td style={{ padding: '8px' }}>
                    <Input
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      size="large"
                      style={{ fontSize: 16 }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Barcode Scan Button */}
            {!showScannerChoice && !showCamera && scannerMode !== 'device' && (
              <Button
                type="primary"
                size="large"
                block
                icon={<ScanOutlined />}
                onClick={handleScanClick}
                style={{
                  height: 56,
                  fontSize: 18,
                  fontWeight: 'bold',
                  backgroundColor: '#52c41a',
                }}
              >
                입고스캔
              </Button>
            )}

            {/* Scanner Choice Buttons */}
            {showScannerChoice && (
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="middle"
              >
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#666',
                    marginBottom: 8,
                  }}
                >
                  스캔 방법을 선택하세요
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleCameraMode}
                  style={{
                    height: 56,
                    fontSize: 18,
                    fontWeight: 'bold',
                    backgroundColor: '#1890ff',
                  }}
                >
                  📷 카메라 스캔
                </Button>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleDeviceMode}
                  style={{
                    height: 56,
                    fontSize: 18,
                    fontWeight: 'bold',
                    backgroundColor: '#722ed1',
                  }}
                >
                  🔫 스캐너 장치
                </Button>
                <Button
                  size="large"
                  block
                  onClick={() => setShowScannerChoice(false)}
                  style={{
                    height: 48,
                    fontSize: 16,
                  }}
                >
                  취소
                </Button>
              </Space>
            )}

            {/* Scanner Device Mode Active */}
            {scannerMode === 'device' && (
              <div
                style={{
                  padding: '24px',
                  backgroundColor: '#f0f2f5',
                  borderRadius: 8,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    marginBottom: 16,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                >
                  🔫
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#722ed1',
                    marginBottom: 8,
                  }}
                >
                  스캐너 장치 대기 중...
                </div>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
                  바코드 스캐너로 바코드를 스캔하세요
                </div>
                <Button danger onClick={handleCancelScan}>
                  취소
                </Button>
                <style>
                  {`
                  @keyframes pulse {
                    0%, 100% {
                      transform: scale(1);
                      opacity: 1;
                    }
                    50% {
                      transform: scale(1.1);
                      opacity: 0.8;
                    }
                  }
                `}
                </style>
              </div>
            )}

            {/* Register Button */}
            <Button
              type="primary"
              size="large"
              block
              style={{
                height: 56,
                fontSize: 18,
                fontWeight: 'bold',
                backgroundColor: '#1890ff',
              }}
              onClick={handleRegister}
            >
              등록
            </Button>

            {/* Camera View with Scanning Frame */}
            {showCamera && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  backgroundColor: '#000',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Scanning Frame Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '60%',
                    border: '3px solid #52c41a',
                    borderRadius: 8,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Corner indicators */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -3,
                      left: -3,
                      width: 40,
                      height: 40,
                      borderTop: '6px solid #52c41a',
                      borderLeft: '6px solid #52c41a',
                      borderRadius: '8px 0 0 0',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -3,
                      width: 40,
                      height: 40,
                      borderTop: '6px solid #52c41a',
                      borderRight: '6px solid #52c41a',
                      borderRadius: '0 8px 0 0',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -3,
                      left: -3,
                      width: 40,
                      height: 40,
                      borderBottom: '6px solid #52c41a',
                      borderLeft: '6px solid #52c41a',
                      borderRadius: '0 0 0 8px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -3,
                      right: -3,
                      width: 40,
                      height: 40,
                      borderBottom: '6px solid #52c41a',
                      borderRight: '6px solid #52c41a',
                      borderRadius: '0 0 8px 0',
                    }}
                  />

                  {/* Scanning line animation */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: '#52c41a',
                      boxShadow: '0 0 10px #52c41a',
                      animation: 'scan 2s linear infinite',
                    }}
                  />
                </div>

                {/* Instructions */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 60,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    padding: '0 20px',
                  }}
                >
                  바코드를 프레임 안에 맞춰주세요
                </div>

                {/* Close Button */}
                <Button
                  danger
                  size="large"
                  onClick={handleCancelScan}
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    minWidth: 120,
                  }}
                >
                  닫기
                </Button>

                {/* CSS Animation */}
                <style>
                  {`
                  @keyframes scan {
                    0% {
                      top: 0;
                    }
                    50% {
                      top: 100%;
                    }
                    100% {
                      top: 0;
                    }
                  }
                `}
                </style>
              </div>
            )}

            {/* Search Section */}
            <div
              style={{
                backgroundColor: '#f5f5f5',
                padding: '16px',
                borderRadius: 8,
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <Input
                  placeholder="트래킹번호"
                  size="large"
                  value={searchTrackingNumber}
                  onChange={(e) => setSearchTrackingNumber(e.target.value)}
                  onPressEnter={() => handleSearch()}
                  style={{ fontSize: 16 }}
                />
              </div>
              <Button
                size="large"
                icon={<SearchOutlined />}
                block
                style={{
                  height: 56,
                  fontSize: 16,
                  fontWeight: 'bold',
                  backgroundColor: '#595959',
                  color: 'white',
                  border: 'none',
                }}
                onClick={() => handleSearch()}
              >
                검색 Q
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="middle"
              >
                {searchResults.map((result, index) => (
                  <Card
                    key={index}
                    style={{
                      borderRadius: 4,
                      border: '1px solid #e8e8e8',
                      backgroundColor: '#fff',
                    }}
                    styles={{ body: { padding: '16px' } }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 14, color: '#666' }}>
                          주문번호 :{' '}
                        </span>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#ff4d4f',
                          }}
                        >
                          {result.orderNo}
                        </span>
                      </div>
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteResult(index)}
                        style={{ minWidth: 40 }}
                      />
                    </div>

                    <table style={{ width: '100%', fontSize: 14 }}>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              color: '#666',
                              padding: '6px 0',
                              width: '30%',
                            }}
                          >
                            트래킹번호
                          </td>
                          <td
                            style={{
                              fontWeight: 500,
                              color: '#1890ff',
                              padding: '6px 0',
                            }}
                          >
                            {result.trackingNo}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: '#666', padding: '6px 0' }}>
                            수취시간
                          </td>
                          <td style={{ padding: '6px 0' }}>
                            {result.receivedDate}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: '#666', padding: '6px 0' }}>
                            랙번호
                          </td>
                          <td style={{ padding: '6px 0' }}>
                            {result.rackNo || ''}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: '#666', padding: '6px 0' }}>
                            작업자
                          </td>
                          <td style={{ padding: '6px 0' }}>
                            {result.operator}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div
                      style={{
                        marginTop: 16,
                        display: 'flex',
                        gap: 8,
                        justifyContent: 'center',
                      }}
                    >
                      <Button
                        type="primary"
                        onClick={() => handleRackLabel(result)}
                        style={{ flex: 1 }}
                      >
                        랙지정
                      </Button>
                      <Button
                        onClick={() => handleCheckLabel(result)}
                        style={{ flex: 1 }}
                      >
                        접수라벨
                      </Button>
                    </div>
                  </Card>
                ))}
              </Space>
            )}
          </Space>
        )}
      </div>
    </Modal>
  );
};

export default BarcodeScanModal;
