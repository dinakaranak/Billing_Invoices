import React from 'react';
import { Modal, Button, Row, Col, Typography, Table, Divider } from 'antd';
import dayjs from 'dayjs';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BillingPrint = ({ 
  visible, 
  onCancel, 
  bills, 
  topProducts, 
  summary, 
  selectedCounter, 
  timeRange, 
  customDateRange,
  searchTerm 
}) => {
  
  const getDateRangeText = () => {
    if (timeRange === 'custom' && customDateRange.length === 2) {
      return `${dayjs(customDateRange[0]).format('DD/MM/YYYY')} to ${dayjs(customDateRange[1]).format('DD/MM/YYYY')}`;
    }
    
    switch (timeRange) {
      case 'year': return `Year: ${dayjs().format('YYYY')}`;
      case 'month': return `Month: ${dayjs().format('MMMM YYYY')}`;
      case 'week': return `Week: ${dayjs().startOf('week').format('DD/MM')} - ${dayjs().endOf('week').format('DD/MM/YYYY')}`;
      case 'day': return `Date: ${dayjs().format('DD/MM/YYYY')}`;
      default: return 'All Time';
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-content').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

//   const handleDownload = () => {
//     // Create a printable HTML content
//     const printContent = document.getElementById('print-content').innerHTML;
//     const originalContent = document.body.innerHTML;
    
//     document.body.innerHTML = printContent;
//     window.print();
//     document.body.innerHTML = originalContent;
//     window.location.reload();
//   };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <Title level={4} className="mb-0">Print Billing Report</Title>
          <div className="flex gap-2 mr-10">
            {/* <Button icon={<DownloadOutlined />} onClick={handleDownload}>
              Download PDF
            </Button> */}
            <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
              Print
            </Button>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <div id="print-content" className="p-6 bg-white">
        {/* Print Header */}
        <div className="text-center mb-6 border-b pb-4">
          <Title level={2}>Billing Report</Title>
          <Row gutter={16} className="text-left mt-4">
            <Col span={8}>
              <Text strong>Counter: </Text>
              {selectedCounter === 'all' ? 'All Counters' : `Counter ${selectedCounter}`}
            </Col>
            <Col span={8}>
              <Text strong>Date Range: </Text>
              {getDateRangeText()}
            </Col>
            <Col span={8}>
              <Text strong>Generated On: </Text>
              {dayjs().format('DD/MM/YYYY HH:mm')}
            </Col>
            {searchTerm && (
              <Col span={24} className="mt-2">
                <Text strong>Search Term: </Text>
                {searchTerm}
              </Col>
            )}
          </Row>
        </div>

        {/* Summary Section */}
        <div className="mb-6">
          <Title level={4}>Summary</Title>
          <Row gutter={16} className="text-center">
            <Col span={8}>
              <div className="p-3 border rounded">
                <Text strong>Total Bills</Text>
                <div className="text-xl font-bold">{summary.totalBills}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="p-3 border rounded">
                <Text strong>Total Amount</Text>
                <div className="text-xl font-bold">₹{summary.totalAmount.toFixed(2)}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="p-3 border rounded">
                <Text strong>Total Customers</Text>
                <div className="text-xl font-bold">{summary.totalCustomers}</div>
              </div>
            </Col>
            {/* <Col span={6}>
              <div className="p-3 border rounded">
                <Text strong>Avg. Bill Amount</Text>
                <div className="text-xl font-bold">₹{summary.averageBill.toFixed(2)}</div>
              </div>
            </Col> */}
          </Row>
        </div>

        {/* Top Products Section */}
        {topProducts.length > 0 && (
          <div className="mb-6">
            <Title level={4}>Top Selling Products</Title>
            <Table
              dataSource={topProducts}
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Product',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Total Amount',
                  dataIndex: 'totalAmount',
                  key: 'totalAmount',
                  render: (amount) => `₹${amount.toFixed(2)}`
                },
                {
                  title: 'No. of Bills',
                  dataIndex: 'bills',
                  key: 'bills',
                }
              ]}
            />
          </div>
        )}

        {/* Bills Table */}
        <div className="mb-6">
          <Title level={4}>Bills Details</Title>
          <Table
            dataSource={bills}
            pagination={false}
            size="small"
            columns={[
              {
                title: 'Bill Date',
                dataIndex: 'date',
                key: 'date',
                render: date => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
              },
              {
                title: 'Bill Number',
                dataIndex: 'billNumber',
                key: 'billNumber',
              },
              {
                title: 'Counter',
                dataIndex: 'cashier',
                key: 'counter',
                render: cashier => cashier?.counterNum || 'N/A',
              },
              {
                title: 'Customer',
                dataIndex: 'customer',
                key: 'customer',
                render: customer => customer?.name || 'Walk-in Customer',
              },
              {
                title: 'Grand Total',
                dataIndex: 'grandTotal',
                key: 'grandTotal',
                render: amount => `₹${amount?.toFixed(2) || '0.00'}`
              }
            ]}
          />
        </div>

        {/* Footer */}
        <Divider />
        <div className="text-center text-sm text-gray-500">
          Generated by Billing System | {window.location.hostname}
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-content, #print-content * {
              visibility: visible;
            }
            #print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .ant-modal-wrap,
            .ant-modal-mask {
              display: none;
            }
          }
        `}
      </style>
    </Modal>
  );
};

export default BillingPrint;