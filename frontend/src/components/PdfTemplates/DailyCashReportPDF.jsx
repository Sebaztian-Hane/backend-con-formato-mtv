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

// Paleta de colores pastel original
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
  // Sección de Resumen
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: lightBackground,
    padding: 15,
    borderRadius: 8,
    border: `1px solid #e0e0e0`,
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#555',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
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
    padding: 10,
    borderBottom: `1px solid #e0e0e0`,
  },
  rowOdd: {
    backgroundColor: lightBackground,
  },
  tableCell: {
    fontSize: 10,
  },
  cellMethod: {
    flex: 2,
    fontFamily: 'Helvetica-Bold',
  },
  cellCount: {
    flex: 1,
    textAlign: 'center',
  },
  cellAmount: {
    flex: 1,
    textAlign: 'right',
  },
  // Pie de tabla
  tableFooter: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#eaffdf',
    borderTop: `2px solid ${pastelGreen}`,
  },
  footerLabel: {
    flex: 3,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    color: darkGreen,
    fontSize: 12,
  },
  footerValue: {
    flex: 1,
    textAlign: 'right',
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

const DailyCashReportPDF = ({
  data,
  date,
  logoUrl,
  companyInfo,
  isEdited = false,
}) => {
  const rows = Object.values(data || {});
  const now = new Date();
  const fechaHora = `${date.format('DD/MM/YYYY')} - ${now.toLocaleTimeString()}`;
  const totalGeneral = rows.reduce((acc, row) => acc + (row.total || 0), 0);
  const totalCitas = rows.reduce(
    (acc, row) => acc + (row.countAppointment || 0),
    0,
  );
  const promedioPorCita =
    totalCitas > 0 ? (totalGeneral / totalCitas).toFixed(2) : 0;

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
              Reporte de Caja Diaria
              {isEdited && (
                <Text style={{ fontSize: 10, color: '#ff6b35', marginLeft: 8 }}>
                  (Datos Simulados)
                </Text>
              )}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.infoText}>
              Fecha del Reporte: {date.format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.infoText}>Generado: {fechaHora}</Text>
            {isEdited && (
              <Text style={{ fontSize: 8, color: '#ff6b35', marginTop: 2 }}>
                * Datos modificados para simulación
              </Text>
            )}
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de Citas</Text>
            <Text style={styles.summaryValue}>{totalCitas}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Promedio por Cita</Text>
            <Text style={styles.summaryValue}>S/ {promedioPorCita}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Ingreso Total</Text>
            <Text style={styles.summaryValue}>
              S/ {totalGeneral.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 2 }]}>Método de Pago</Text>
            <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>
              Citas
            </Text>
            <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>
              Monto
            </Text>
            <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>
              Total
            </Text>
          </View>
          {rows.map((row, idx) => (
            <View
              style={[styles.tableRow, idx % 2 !== 0 ? styles.rowOdd : {}]}
              key={row.name}
            >
              <Text style={[styles.tableCell, styles.cellMethod]}>
                {row.name}
              </Text>
              <Text style={[styles.tableCell, styles.cellCount]}>
                {row.countAppointment}
              </Text>
              <Text style={[styles.tableCell, styles.cellAmount]}>
                S/ {row.payment.toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, styles.cellAmount]}>
                S/ {row.total.toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.tableFooter}>
            <Text style={styles.footerLabel}>Total General:</Text>
            <Text style={styles.footerValue}>S/ {totalGeneral.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {clinicName} - Documento generado automáticamente.
          {isEdited && (
            <Text style={{ color: '#ff6b35' }}>
              {' '}
              Datos modificados para simulación.
            </Text>
          )}
        </Text>
      </Page>
    </Document>
  );
};

export default React.memo(DailyCashReportPDF);
