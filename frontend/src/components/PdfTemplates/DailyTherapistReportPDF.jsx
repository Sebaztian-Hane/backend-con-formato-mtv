import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const defaultLogo = '/src/assets/Img/Dashboard/MiniLogoReflexo.png';
const defaultClinicName = 'Reflexo Perú';

// Paleta de colores pastel
const pastelGreen = '#95e472';
const darkGreen = '#2d5a3d';
const lightBackground = '#f8f9fa';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  // Cabecera
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  headerTitles: {
    marginLeft: 15,
  },
  clinicName: {
    color: darkGreen,
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
  },
  reportTitle: {
    color: '#444',
    fontSize: 14,
  },
  headerInfo: {
    marginLeft: 'auto',
    textAlign: 'right',
  },
  infoText: {
    fontSize: 9,
    color: '#555',
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: pastelGreen,
    marginVertical: 15,
  },
  // Resumen
  summaryContainer: {
    backgroundColor: lightBackground,
    padding: 15,
    borderRadius: 8,
    border: `1px solid #e0e0e0`,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    color: darkGreen,
    fontFamily: 'Helvetica-Bold',
  },
  // Estilos de la tabla
  table: {
    border: `1px solid #e0e0e0`,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: pastelGreen,
    padding: 10,
  },
  headerCell: {
    color: '#fff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottom: `1px solid #e0e0e0`,
  },
  rowOdd: {
    backgroundColor: lightBackground,
  },
  tableCell: {
    fontSize: 10,
  },
  cellIndex: {
    flex: 0.5,
    textAlign: 'center',
  },
  cellName: {
    flex: 3,
    fontFamily: 'Helvetica-Bold',
  },
  cellCount: {
    flex: 1,
    textAlign: 'center',
  },
  // Pie de tabla
  tableFooter: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#eaffdf',
    borderTop: `2px solid ${pastelGreen}`,
  },
  footerLabel: {
    flex: 3.5, // Suma de flex de N° y Nombre
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    color: darkGreen,
    fontSize: 12,
  },
  footerValue: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    color: darkGreen,
    fontSize: 12,
  },
  // Pie de página del documento
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: `1px solid #e0e0e0`,
    paddingTop: 8,
  },
});

const DailyTherapistReportPDF = ({ data, date, logoUrl, companyInfo }) => {
  const therapists = data?.therapists_appointments || [];
  const totalAppointments = data?.total_appointments_count || 0;
  const now = new Date();
  const fechaHora = `${date.format('DD/MM/YYYY')} - ${now.toLocaleTimeString()}`;
  const clinicName = companyInfo?.company_name || defaultClinicName;
  const logo = logoUrl || defaultLogo;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.headerTitles}>
            <Text style={styles.clinicName}>{clinicName}</Text>
            <Text style={styles.reportTitle}>
              Reporte de Atenciones por Terapeuta
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.infoText}>
              Fecha del Reporte: {date.format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.infoText}>Generado: {fechaHora}</Text>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Total de Atenciones en el Día</Text>
          <Text style={styles.summaryValue}>{totalAppointments}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text
              style={[styles.headerCell, { flex: 0.5, textAlign: 'center' }]}
            >
              N°
            </Text>
            <Text style={[styles.headerCell, { flex: 3 }]}>Terapeuta</Text>
            <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>
              Atenciones
            </Text>
          </View>
          {therapists.map((t, idx) => (
            <View
              style={[styles.tableRow, idx % 2 !== 0 ? styles.rowOdd : {}]}
              key={t.id}
            >
              <Text style={[styles.tableCell, styles.cellIndex]}>
                {idx + 1}
              </Text>
              <Text style={[styles.tableCell, styles.cellName]}>
                {`${t.paternal_lastname} ${t.maternal_lastname}, ${t.name}`}
              </Text>
              <Text style={[styles.tableCell, styles.cellCount]}>
                {t.appointments_count}
              </Text>
            </View>
          ))}
          <View style={styles.tableFooter}>
            <Text style={styles.footerLabel}>Total General:</Text>
            <Text style={styles.footerValue}>{totalAppointments}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {clinicName} - Documento generado automáticamente.
        </Text>
      </Page>
    </Document>
  );
};

export default React.memo(DailyTherapistReportPDF);
