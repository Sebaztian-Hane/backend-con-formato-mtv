import React, { useState, useEffect, useMemo } from 'react';
import { ConfigProvider, DatePicker, Button, theme, Card, Select } from 'antd';
import ReportSelector from './ReportSelector';
import ReportPreview from './ReportPreview';
import EditCashReportModal from './EditCashReportModal';
import styles from './reports.module.css';
import dayjs from 'dayjs';
import {
  useDailyTherapistReport,
  usePatientsByTherapistReport,
  useDailyCashReport,
  useAppointmentsBetweenDatesReport,
} from '../hook/reportsHook';
import { PDFViewer } from '@react-pdf/renderer';
import DailyTherapistReportPDF from '../../../components/PdfTemplates/DailyTherapistReportPDF';
import PatientsByTherapistReportPDF from '../../../components/PdfTemplates/PatientsByTherapistReportPDF';
import DailyCashReportPDF from '../../../components/PdfTemplates/DailyCashReportPDF';
import ExcelPreviewTable from '../../../components/PdfTemplates/ExcelPreviewTable';
import ExcelJS from 'exceljs';
import {
  FilePlus,
  ChartPieSlice,
  Users,
  Wallet,
  CalendarBlank,
} from '@phosphor-icons/react';
import {
  useCompanyInfo,
  useSystemHook,
} from '../../configuration/cSystem/hook/systemHook';

const reportOptions = [
  {
    key: 'diariaTerapeuta',
    title: 'Reporte Diario de Terapeutas',
    description:
      'Resumen de citas y actividades por cada terapeuta en un día específico.',
    icon: <Users size={32} color="#4CAF50" />,
  },
  {
    key: 'pacientesTerapeuta',
    title: 'Pacientes por Terapeuta',
    description:
      'Lista de pacientes atendidos por cada terapeuta en una fecha determinada.',
    icon: <ChartPieSlice size={32} color="#4CAF50" />,
  },
  {
    key: 'reporteCaja',
    title: 'Reporte de Caja Diario',
    description: 'Detalle de los ingresos y transacciones financieras del día.',
    icon: <Wallet size={32} color="#4CAF50" />,
  },
  {
    key: 'rangoCitas',
    title: 'Citas por Rango de Fechas',
    description:
      'Exporta un listado de todas las citas programadas entre dos fechas.',
    icon: <CalendarBlank size={32} color="#4CAF50" />,
  },
];

const Reporte = () => {
  const [reportType, setReportType] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [range, setRange] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [excelPagination, setExcelPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  // Nuevos estados para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedCajaData, setEditedCajaData] = useState(null);

  const { companyInfo, loadingInfo, errorInfo } = useCompanyInfo();
  const { logoUrl, loading: logoLoading, error: logoError } = useSystemHook();

  const {
    data: diariaData,
    loading: diariaLoading,
    error: diariaError,
    fetchReport: fetchDiaria,
  } = useDailyTherapistReport();
  const {
    data: pacientesData,
    loading: pacientesLoading,
    error: pacientesError,
    fetchReport: fetchPacientes,
  } = usePatientsByTherapistReport();
  const {
    data: cajaData,
    loading: cajaLoading,
    error: cajaError,
    fetchReport: fetchCaja,
  } = useDailyCashReport();
  const {
    data: rangoData,
    loading: rangoLoading,
    error: rangoError,
    fetchReport: fetchRango,
  } = useAppointmentsBetweenDatesReport();

  const safeDate = useMemo(() => date || dayjs(), [date]);

  // Memoize PDF viewer styles to prevent re-renders
  const pdfViewerStyle = useMemo(
    () => ({
      minHeight: 500,
      maxHeight: 'calc(96vh - 180px)',
      margin: '0 auto',
      display: 'block',
      borderRadius: 14,
    }),
    [],
  );

  // Memoize theme config to prevent re-renders
  const themeConfig = useMemo(
    () => ({
      algorithm: theme.darkAlgorithm,
      components: {
        Button: {
          colorPrimary: '#00AA55',
          colorTextLightSolid: '#ffffff',
          colorPrimaryHover: '#00cc6a',
          colorPrimaryActive: '#ffffff',
        },
        Select: {
          colorPrimary: '#00AA55',
          colorBgContainer: '#1f1f1f',
          colorText: '#ffffff',
          colorBorder: '#ffffff',
          controlOutline: '#00AA55',
          colorPrimaryHover: '#00cc6a',
          optionSelectedBg: '#00AA55',
        },
        DatePicker: {
          colorTextPlaceholder: '#AAAAAA',
          colorBgContainer: '#333333',
          colorText: '#FFFFFF',
          colorBorder: '#444444',
          borderRadius: 4,
          hoverBorderColor: '#555555',
          activeBorderColor: '#00AA55',
          colorIcon: '#FFFFFF',
          colorIconHover: '#00AA55',
          colorBgElevated: '#121212',
          colorPrimary: '#00AA55',
          colorTextDisabled: '#333333',
          colorTextHeading: '#FFFFFF',
          cellHoverBg: '#00AA55',
          colorSplit: '#444444',
        },
        Modal: {
          colorBgElevated: '#1f1f1f',
          colorText: '#fff',
          borderRadius: 12,
        },
        Message: {
          colorBgElevated: '#1f1f1f',
          colorText: '#fff',
          borderRadius: 8,
        },
      },
    }),
    [],
  );

  // Resetear paginación cuando cambian los datos de rango
  useEffect(() => {
    setExcelPagination((prev) => ({ current: 1, pageSize: prev.pageSize }));
  }, [rangoData]);

  const handleGenerate = async () => {
    setGenerating(true);
    if (reportType === 'diariaTerapeuta') {
      await fetchDiaria(date);
      setShowPreview('diariaTerapeuta');
    } else if (reportType === 'pacientesTerapeuta') {
      await fetchPacientes(date);
      setShowPreview('pacientesTerapeuta');
    } else if (reportType === 'reporteCaja') {
      await fetchCaja(date);
      setShowPreview('reporteCaja');
    } else if (reportType === 'rangoCitas' && range && range[0] && range[1]) {
      await fetchRango(
        range[0].format('YYYY-MM-DD'),
        range[1].format('YYYY-MM-DD'),
      );
      setShowPreview('rangoCitas');
    }
    setGenerating(false);
  };

  const handleCancel = () => {
    setShowPreview(false);
    setReportType(null);
    setDate(dayjs());
    setRange(null);
    setEditedCajaData(null); // Resetear datos editados
  };

  // Nueva función para manejar la edición
  const handleEditCashReport = () => {
    setShowEditModal(true);
  };

  // Nueva función para guardar los cambios editados
  const handleSaveEditedData = (updatedData) => {
    setEditedCajaData(updatedData);
    setShowEditModal(false);
  };

  // Nueva función para cancelar la edición
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  // Nueva función para resetear los datos editados
  const handleResetData = () => {
    setEditedCajaData(null);
  };

  // Nueva función para exportar a Excel usando exceljs
  const exportToExcel = async (data, fileName = 'Reporte_Rango_Citas.xlsx') => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Citas');
    worksheet.columns = [
      { header: 'ID Paciente', key: 'patient_id', width: 12 },
      { header: 'Documento', key: 'document_number', width: 15 },
      { header: 'Nombre Completo', key: 'full_name', width: 30 },
      { header: 'Teléfono', key: 'primary_phone', width: 15 },
      { header: 'Fecha', key: 'appointment_date', width: 12 },
      { header: 'Hora', key: 'appointment_hour', width: 10 },
    ];
    data.forEach((item) => {
      worksheet.addRow({
        patient_id: item.patient_id,
        document_number: item.document_number,
        full_name: `${item.name} ${item.paternal_lastname} ${item.maternal_lastname}`,
        primary_phone: item.primary_phone,
        appointment_date: item.appointment_date,
        appointment_hour: item.appointment_hour,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Lógica para la previsualización y descarga
  let loading = false,
    error = null,
    content = null,
    downloadBtn = null;
  if (showPreview) {
    if (showPreview === 'diariaTerapeuta') {
      loading = diariaLoading || logoLoading || loadingInfo;
      error = diariaError || logoError || errorInfo;
      content = diariaData && (
        <PDFViewer
          key={`diaria-${safeDate.format('YYYY-MM-DD')}`}
          width="100%"
          height="95%"
          style={pdfViewerStyle}
        >
          <DailyTherapistReportPDF
            data={diariaData}
            date={safeDate}
            logoUrl={logoUrl}
            companyInfo={companyInfo}
          />
        </PDFViewer>
      );
    } else if (showPreview === 'pacientesTerapeuta') {
      loading = pacientesLoading || logoLoading || loadingInfo;
      error = pacientesError || logoError || errorInfo;
      content =
        pacientesData && pacientesData.length > 0 ? (
          <PDFViewer
            key={`pacientes-${safeDate.format('YYYY-MM-DD')}`}
            width="100%"
            height="95%"
            style={pdfViewerStyle}
          >
            <PatientsByTherapistReportPDF
              data={pacientesData}
              date={safeDate}
              logoUrl={logoUrl}
              companyInfo={companyInfo}
            />
          </PDFViewer>
        ) : (
          <div className={styles.errorMsg}>
            Error: No se pudo generar el archivo porque no hay datos.
          </div>
        );
    } else if (showPreview === 'reporteCaja') {
      loading = cajaLoading || logoLoading || loadingInfo;
      error = cajaError || logoError || errorInfo;

      // Usar datos editados si están disponibles, sino usar los datos originales
      const dataToShow = editedCajaData || cajaData;

      content =
        dataToShow && Object.keys(dataToShow).length > 0 ? (
          <PDFViewer
            key={`caja-${safeDate.format('YYYY-MM-DD')}-${editedCajaData ? 'edited' : 'original'}`}
            width="100%"
            height="95%"
            style={pdfViewerStyle}
          >
            <DailyCashReportPDF
              data={dataToShow}
              date={safeDate}
              logoUrl={logoUrl}
              companyInfo={companyInfo}
              isEdited={!!editedCajaData}
            />
          </PDFViewer>
        ) : (
          <div className={styles.errorMsg}>
            No hay datos para mostrar en la fecha seleccionada.
          </div>
        );
    } else if (showPreview === 'rangoCitas') {
      loading = rangoLoading;
      error = rangoError;
      content =
        rangoData &&
        rangoData.appointments &&
        rangoData.appointments.length > 0 ? (
          <ExcelPreviewTable
            data={rangoData}
            pagination={excelPagination}
            onPaginationChange={setExcelPagination}
          />
        ) : (
          <div className={styles.noDataMsg}>No hay datos para mostrar</div>
        );
      if (
        rangoData &&
        rangoData.appointments &&
        rangoData.appointments.length > 0
      ) {
        downloadBtn = (
          <Button
            type="primary"
            style={{
              marginTop: 10,
              background: '#4CAF50',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 8,
              height: 42,
              fontSize: 15,
            }}
            onClick={() =>
              exportToExcel(
                rangoData.appointments,
                `Reporte_Rango_Citas_${range && range[0] ? range[0].format('YYYY-MM-DD') : ''}_${range && range[1] ? range[1].format('YYYY-MM-DD') : ''}.xlsx`,
              )
            }
          >
            Descargar Excel
          </Button>
        );
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene que la página se recargue
    if (reportType && !generating) {
      // Doble chequeo para seguridad
      handleGenerate();
    }
  };

  if (showPreview) {
    return (
      <>
        <ReportPreview
          showPreview={showPreview}
          loading={loading}
          generating={generating}
          error={error}
          content={content}
          downloadBtn={downloadBtn}
          handleCancel={handleCancel}
          onEdit={
            showPreview === 'reporteCaja' ? handleEditCashReport : undefined
          }
          showEditButton={showPreview === 'reporteCaja'}
          onReset={showPreview === 'reporteCaja' ? handleResetData : undefined}
          showResetButton={showPreview === 'reporteCaja' && !!editedCajaData}
        />

        {/* Modal de edición para reporte de caja */}
        {showPreview === 'reporteCaja' && (
          <EditCashReportModal
            visible={showEditModal}
            onCancel={handleCancelEdit}
            onSave={handleSaveEditedData}
            data={cajaData}
            date={safeDate}
          />
        )}
      </>
    );
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={styles.mainContainer}>
        <Card className={styles.card}>
          <h2 className={styles.title}>Generador de Reportes</h2>

          <form onSubmit={handleSubmit}>
            <ReportSelector
              options={reportOptions}
              selectedReport={reportType}
              onSelectReport={setReportType}
            />

            {reportType && (
              <div className={styles.controlsWrapper}>
                <div className={styles.datePickerContainer}>
                  {reportType === 'rangoCitas' ? (
                    <DatePicker.RangePicker
                      style={{ width: '100%' }}
                      format="DD-MM-YYYY"
                      onChange={(dates) => setRange(dates)}
                      value={range}
                    />
                  ) : (
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD-MM-YYYY"
                      value={date}
                      onChange={(d) => setDate(d)}
                    />
                  )}
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<FilePlus size={20} weight="bold" />}
                  onClick={handleGenerate}
                  loading={generating}
                  disabled={!reportType || generating}
                  className={styles.generateBtn}
                >
                  Generar
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default Reporte;
