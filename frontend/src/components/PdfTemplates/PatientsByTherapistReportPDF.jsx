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
  // Bloque por terapeuta
  therapistBlock: {
    marginBottom: 20,
    breakInside: 'avoid', // Evita que el bloque se divida entre páginas
  },
  therapistName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: darkGreen,
    backgroundColor: '#eaffdf',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
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
  cellPatientId: {
    flex: 1,
    textAlign: 'left',
  },
  cellPatientName: {
    flex: 3,
  },
  cellAppointments: {
    flex: 1,
    textAlign: 'center',
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

const PatientsByTherapistReportPDF = ({ data, date, logoUrl, companyInfo }) => {
  const therapists = data || [];
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
              Reporte de Pacientes por Terapeuta
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.infoText}>
              Fecha del Reporte: {date.format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.infoText}>Generado: {fechaHora}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {therapists.map((therapist, idx) => (
          <View key={idx} style={styles.therapistBlock}>
            <Text style={styles.therapistName}>{therapist.therapist}</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.cellPatientId]}>
                  ID Paciente
                </Text>
                <Text style={[styles.headerCell, styles.cellPatientName]}>
                  Nombre del Paciente
                </Text>
                <Text style={[styles.headerCell, styles.cellAppointments]}>
                  N° Citas
                </Text>
              </View>
              {therapist.patients.map((p, i) => (
                <View
                  style={[styles.tableRow, i % 2 !== 0 ? styles.rowOdd : {}]}
                  key={p.patient_id}
                >
                  <Text style={[styles.tableCell, styles.cellPatientId]}>
                    {p.patient_id}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellPatientName]}>
                    {p.patient}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellAppointments]}>
                    {p.appointments}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          {clinicName} - Documento generado automáticamente.
        </Text>
      </Page>
    </Document>
  );
};

export default React.memo(PatientsByTherapistReportPDF);
