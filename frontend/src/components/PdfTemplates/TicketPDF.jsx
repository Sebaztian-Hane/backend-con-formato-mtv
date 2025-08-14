import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 18,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#111',
    backgroundColor: '#fff',
  },
  center: {
    textAlign: 'center',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1.2,
  },
  labelBold: {
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1.1,
  },
  line: {
    marginVertical: 10,
    borderBottomWidth: 1.2,
    borderBottomColor: '#000',
    width: '100%',
    alignSelf: 'center',
  },
  lineDouble: {
    marginVertical: 10,
    borderBottomWidth: 2.2,
    borderBottomColor: '#000',
    width: '100%',
    alignSelf: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    marginVertical: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    flex: 1,
    padding: 4,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: '#000',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 1.1,
  },
  tableCell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
    fontSize: 13,
    letterSpacing: 1.1,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  totalBlock: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 8,
    textAlign: 'center',
  },
  total: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  small: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
    letterSpacing: 1.1,
    fontWeight: 'bold',
  },
  spaceBlock: {
    height: 12,
  },
  spaceBlockBig: {
    height: 22,
  },
  contact: {
    fontSize: 11,
    color: '#222',
    marginBottom: 2,
    letterSpacing: 1.1,
  },
  footer: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 10,
    color: '#888',
    letterSpacing: 1.1,
  },
  field: {
    fontWeight: 'bold',
  },
  headerLine: {
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 1.1,
  },
  headerLineBold: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});

const getFontSize = (text, base = 13, min = 9, maxLen = 28) => {
  if (!text) return base;
  if (text.length > maxLen) return min;
  return base;
};

const TicketPDF = ({
  company = {
    name: 'REFLEXOPERU',
    address: 'Calle Las Golondrinas N° 153 - Urb. Los Nogales',
    phone: '01-503-8416',
    email: 'reflexoperu@reflexoperu.com',
    city: 'LIMA - PERU',
    exonerated: 'EXONERADO DE TRIBUTOS',
    di: 'D.I. 626-D.I.23211',
  },
  ticket = {
    number: 1,
    date: '2025-06-23',
    patient: 'PACIENTE',
    service: 'Consulta',
    unit: 1,
    amount: 'S/ 0.00',
    paymentType: 'EFECTIVO',
  },
}) => (
  <Document>
    <Page size="A6" style={styles.page} wrap={false}>
      <View style={styles.center} wrap={false}>
        <Text style={styles.bold}>{company.name}</Text>
        <Text style={styles.headerLine}>{company.address}</Text>
        <Text style={styles.headerLine}>Tel: {company.phone}</Text>
        <Text style={styles.headerLine}>{company.email}</Text>
        <View style={styles.spaceBlock} />
        <Text style={styles.headerLine}>{company.city}</Text>
        <Text style={styles.headerLine}>{company.exonerated}</Text>
        <Text style={styles.headerLine}>{company.di}</Text>
        <View style={styles.spaceBlock} />
        <Text style={styles.headerLineBold}>TICKET N° {ticket.number}</Text>
        <Text style={styles.headerLineBold}>
          Fecha: <Text style={styles.field}>{ticket.date}</Text>
        </Text>
        <Text style={styles.headerLineBold}>
          Paciente: <Text style={styles.field}>{ticket.patient}</Text>
        </Text>
        <Text style={styles.headerLineBold}>
          Tipo de Pago: <Text style={styles.field}>{ticket.paymentType}</Text>
        </Text>
      </View>
      <View style={styles.lineDouble} wrap={false} />
      <View style={styles.table} wrap={false}>
        <View style={styles.tableRow} wrap={false}>
          <Text style={styles.tableCellHeader}>SERVICIO</Text>
          <Text style={styles.tableCellHeader}>UNIDAD</Text>
          <Text style={[styles.tableCellHeader, styles.lastCell]}>
            S/ IMPORTE
          </Text>
        </View>
        <View style={styles.tableRow} wrap={false}>
          <Text style={styles.tableCell}>{ticket.service}</Text>
          <Text style={styles.tableCell}>{ticket.unit}</Text>
          <Text style={[styles.tableCell, styles.lastCell]}>
            {ticket.amount}
          </Text>
        </View>
      </View>
      <View style={styles.lineDouble} wrap={false} />
      <View style={styles.totalBlock} wrap={false}>
        <Text style={styles.total}>TOTAL: {ticket.amount}</Text>
      </View>
      <Text style={styles.small}>Gracias por su preferencia</Text>
      <Text style={styles.small}>Presentarse 30 minutos antes de la cita</Text>
    </Page>
  </Document>
);

export default TicketPDF;
