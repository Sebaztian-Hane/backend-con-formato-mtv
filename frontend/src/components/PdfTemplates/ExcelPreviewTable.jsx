import React, { useState } from 'react';
import { Table } from 'antd';

const pastelGreen = '#95e472';
const darkGreen = '#2d5a3d';

const columns = [
  {
    title: 'ID Paciente',
    dataIndex: 'patient_id',
    key: 'patient_id',
    width: 110,
    align: 'center',
    fixed: 'left',
  },
  {
    title: 'Documento',
    dataIndex: 'document_number',
    key: 'document_number',
    width: 120,
    align: 'center',
    render: (text) => text || '-',
  },
  {
    title: 'Nombre Completo',
    key: 'full_name',
    width: 260,
    render: (_, record) =>
      `${record.name} ${record.paternal_lastname} ${record.maternal_lastname}`,
  },
  {
    title: 'Teléfono',
    dataIndex: 'primary_phone',
    key: 'primary_phone',
    width: 130,
    align: 'center',
    render: (text) => text || '-',
  },
  {
    title: 'Fecha',
    dataIndex: 'appointment_date',
    key: 'appointment_date',
    width: 120,
    align: 'center',
  },
  {
    title: 'Hora',
    dataIndex: 'appointment_hour',
    key: 'appointment_hour',
    width: 100,
    align: 'center',
    render: (text) => text || '-',
  },
];

const ExcelPreviewTable = ({
  data,
  pagination: controlledPagination,
  onPaginationChange,
}) => {
  const [localPagination, setLocalPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  // Usar paginación controlada si se pasa, si no usar local
  const pagination = controlledPagination || localPagination;
  const handleTableChange = (newPagination) => {
    if (onPaginationChange) {
      onPaginationChange(newPagination);
    } else {
      setLocalPagination(newPagination);
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 2px 12px #e0e0e0',
        padding: 24,
        marginTop: 16,
      }}
    >
      <Table
        columns={columns}
        dataSource={data?.appointments || []}
        rowKey="patient_id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          position: ['bottomCenter'],
          showTotal: false,
        }}
        onChange={handleTableChange}
        scroll={{ x: 900, y: 500 }}
        bordered
        size="middle"
        style={{ fontFamily: 'Helvetica', fontSize: 15 }}
        rowClassName={(_, idx) => (idx % 2 === 0 ? 'row-even' : 'row-odd')}
      />
      <style>{`
        .row-even td { background: #f8f8f8 !important; }
        .row-odd td { background: #fff !important; }
        .ant-table-thead > tr > th { 
          background: ${pastelGreen} !important; 
          color: #222 !important; 
          font-weight: bold !important;
          border: none !important;
        }
        .ant-table-tbody > tr > td {
          border: 1px solid #d9d9d9 !important;
        }
        .ant-pagination-item-active {
          border-color: ${pastelGreen} !important;
        }
        .ant-pagination-item-active a {
          color: ${darkGreen} !important;
        }
        .ant-pagination-item:hover {
          border-color: ${pastelGreen} !important;
        }
        .ant-pagination-item:hover a {
          color: ${darkGreen} !important;
        }
      `}</style>
    </div>
  );
};

export default ExcelPreviewTable;
