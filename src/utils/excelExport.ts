import * as XLSX from 'xlsx';

interface InvoiceData {
  // Consignee Information
  consignee: string;
  consigneeAddress: string;
  consigneePhone: string;
  consigneeEmail: string;

  // Shipping Information
  portOfLoading: string;
  portOfDischarge: string;
  oceanVessel: string;
  voyageNo: string;

  // Products
  products: Array<{
    shippingMark: string;
    descriptionEn: string;
    descriptionCn: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;

  // Additional Info
  lcNumber?: string;
  lcIssuingBank?: string;
  notifyParty?: string;
  remarks?: string;
}

export const exportInvoiceToExcel = (
  data: InvoiceData,
  fileName: string = 'invoice.xlsx',
) => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Prepare data array for the invoice
  const invoiceData: any[][] = [];

  // Header section
  invoiceData.push([
    'Fifth District, Liuqing community, Beiyuan street, Yiwu City, Jinhua City,',
    '',
    '',
    '',
    '',
    'No. & date of L/C',
  ]);
  invoiceData.push(['Zhejiang Province', '', '', '', '', '']);
  invoiceData.push([data.consigneePhone || '18561073633', '', '', '', '', '']);
  invoiceData.push(['', '', '', '', '', '']);

  // Consignee section
  invoiceData.push(['Consignee', '', '', '', '', 'L/C issuing bank']);
  invoiceData.push([data.consignee, '', '', '', '', '']);
  invoiceData.push([data.consigneeAddress, '', '', '', '', '']);
  invoiceData.push([data.consigneePhone, '', '', '', '', '']);
  invoiceData.push([data.consigneeEmail, '', '', '', '', '']);

  // Notify party
  invoiceData.push(['Notify party', '', '', '', '', 'Remarks:']);
  invoiceData.push([data.notifyParty || 'SAME AS CNEE', '', '', '', '', '']);

  // Port information
  invoiceData.push(['Port of loading', '', '', 'Port of discharge', '', '']);
  invoiceData.push([
    data.portOfLoading || 'WEIHAI, CHINA',
    '',
    '',
    data.portOfDischarge || 'INCHEON, KOREA',
    '',
    '',
  ]);

  // Vessel information
  invoiceData.push(['Ocean vessel', '', '', 'Voy.no', '', '']);
  invoiceData.push(['', '', '', '', '', '']);

  // Product table header
  invoiceData.push([
    'Shipping Marks',
    'Description of goods',
    '',
    'Quantity/unit',
    '',
    'Unitprice',
    '',
    'AMOUNT',
  ]);

  // Product rows
  let totalQuantity = 0;
  let totalAmount = 0;

  data.products.forEach((product) => {
    invoiceData.push([
      product.shippingMark,
      product.descriptionEn,
      product.descriptionCn,
      product.quantity.toString(),
      '',
      product.unitPrice.toFixed(2),
      '',
      `USD ${product.amount.toFixed(2)}`,
    ]);
    totalQuantity += product.quantity;
    totalAmount += product.amount;
  });

  // Total row
  invoiceData.push([
    '',
    'Total',
    '',
    totalQuantity.toString(),
    'EA',
    '',
    '',
    `USD ${totalAmount.toFixed(2)}`,
  ]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(invoiceData);

  // Set column widths
  ws['!cols'] = [
    { wch: 12 }, // Shipping Marks
    { wch: 20 }, // Description (English)
    { wch: 15 }, // Description (Chinese)
    { wch: 15 }, // Quantity
    { wch: 10 }, // Unit
    { wch: 12 }, // Unit Price
    { wch: 5 }, // Empty
    { wch: 15 }, // Amount
  ];

  // Merge cells for headers
  if (!ws['!merges']) ws['!merges'] = [];

  // Merge consignee address cells
  ws['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // First address line
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Province
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Phone
    { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } }, // Consignee label
    { s: { r: 5, c: 0 }, e: { r: 5, c: 4 } }, // Consignee name
    { s: { r: 6, c: 0 }, e: { r: 6, c: 4 } }, // Consignee address
    { s: { r: 9, c: 0 }, e: { r: 9, c: 4 } }, // Notify party label
    { s: { r: 10, c: 0 }, e: { r: 10, c: 4 } }, // Notify party value
  );

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice');

  // Generate and download file
  XLSX.writeFile(wb, fileName);
};
