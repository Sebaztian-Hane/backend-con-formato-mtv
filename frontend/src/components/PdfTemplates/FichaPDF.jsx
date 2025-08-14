import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';

// Función para calcular el elemento base chino
const calculateChineseElement = (birthDate) => {
  if (!birthDate) return 'No especificado';
  let year = dayjs(birthDate).year();
  const month = dayjs(birthDate).month() + 1;
  const day = dayjs(birthDate).date();
  if ((month === 1 && day >= 1) || (month === 2 && day <= 15)) {
    year -= 1;
  }
  const lastTwoDigits = year % 100;
  let suma = lastTwoDigits
    .toString()
    .split('')
    .reduce((acc, curr) => acc + parseInt(curr), 0);
  while (suma >= 10) {
    suma = suma
      .toString()
      .split('')
      .reduce((acc, curr) => acc + parseInt(curr), 0);
  }
  const result = 10 - suma;
  return result;
};

const styles = StyleSheet.create({
  page: {
    width: 260, // Un poco más amplio
    height: 750, // Más largo, tipo A4 angosto
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 18,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 2,
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  field: {
    fontSize: 11,
    marginBottom: 2,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    marginVertical: 6,
    width: '100%',
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 120,
    marginLeft: 4,
    marginRight: 4,
    height: 12,
    display: 'inline-block',
  },
  fieldUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 60,
    marginLeft: 4,
    marginRight: 4,
    height: 14,
    display: 'inline-block',
  },
  block: {
    minHeight: 18,
    marginBottom: 6,
    paddingTop: 1,
    paddingBottom: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  blockBig: {
    minHeight: 24,
    marginBottom: 8,
    paddingTop: 1,
    paddingBottom: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  blockSmall: {
    minHeight: 10,
    marginBottom: 4,
    paddingTop: 1,
    paddingBottom: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  blockText: {
    minHeight: 10,
    marginBottom: 1,
    textAlign: 'left',
  },
  firma: {
    marginTop: 16,
    fontSize: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  firmaLinea: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 120,
    marginLeft: 4,
    marginRight: 4,
    height: 14,
    display: 'inline-block',
  },
  shortUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 30,
    marginLeft: 2,
    marginRight: 2,
    height: 12,
    display: 'inline-block',
  },
  tinyUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 18,
    marginLeft: 2,
    marginRight: 2,
    height: 12,
    display: 'inline-block',
  },
  nameLabel: {
    fontWeight: 'bold',
    fontSize: 8,
  },
  nameUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 160,
    marginLeft: 4,
    marginRight: 16,
    height: 12,
    display: 'inline-block',
  },
  codeLabel: {
    fontWeight: 'bold',
    fontSize: 8,
  },
  codeUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 60,
    marginLeft: 4,
    marginRight: 4,
    height: 12,
    display: 'inline-block',
  },
});

const FichaPDF = ({ cita, paciente, visitas, historia = {} }) => {
  // Formato de fecha
  const formatDate = (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '');

  // Helper para subrayado si vacío
  const renderField = (value, underlineStyle = styles.underline) =>
    value ? (
      <Text style={styles.field}>{value}</Text>
    ) : (
      <View style={underlineStyle} />
    );

  return (
    <Document>
      <Page size={{ width: 260, height: 800 }} style={styles.page}>
        {/* Cabecera */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.nameLabel}>NOMBRE:</Text>
          <View style={styles.nameUnderline} />
          <Text style={[styles.codeLabel, { marginLeft: 4 }]}>COD:</Text>
          <View style={styles.codeUnderline} />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.label}>
            Fecha:{' '}
            <Text style={styles.field}>
              {formatDate(cita.appointment_date)}
            </Text>
          </Text>
          <Text style={[styles.field, { marginLeft: 6 }]}>
            ({cita.ticket_number ? cita.ticket_number : 'S/N'})
          </Text>
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.label}>
            N° VISITAS:{' '}
            <Text style={styles.field}>
              {visitas > 0 ? visitas : 'Aún no tiene cita'}
            </Text>
          </Text>
        </View>
        {renderField(
          `${paciente.paternal_lastname || ''} ${paciente.maternal_lastname || ''} ${paciente.name || ''}`.trim(),
          styles.underline,
        )}
        <View style={styles.line} />
        {/* DNI y Hora en la misma línea */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.label}>DNI:</Text>
          {renderField(paciente.document_number, styles.fieldUnderline)}
          <Text style={[styles.label, { marginLeft: 12 }]}>H:</Text>
          {renderField(cita.appointment_hour, styles.fieldUnderline)}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.label}>Ocupación:</Text>
          {renderField(paciente.ocupation, styles.fieldUnderline)}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.label}>VISITA PRIMERA:</Text>
          {renderField(formatDate(cita.initial_date), styles.fieldUnderline)}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.label}>ULTIMA:</Text>
          {renderField('', styles.fieldUnderline)}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.label}>NAC:</Text>
          {renderField(formatDate(paciente.birth_date), styles.fieldUnderline)}
          <Text style={[styles.label, { marginLeft: 4 }]}>/ Base:</Text>
          {paciente.birth_date ? (
            <Text style={styles.field}>
              {calculateChineseElement(paciente.birth_date)}
            </Text>
          ) : (
            <View style={styles.fieldUnderline} />
          )}
        </View>
        <View style={styles.line} />
        {/* Diagnóstico */}
        <Text style={styles.sectionTitle}>DIAGNOSTICO MEDICO</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          {renderField(cita.diagnosis, styles.blockText)}
        </View>
        {/* Medicamentos */}
        <Text style={styles.sectionTitle}>MEDICAMENTOS</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          {renderField(cita.medications, styles.blockText)}
        </View>
        {/* Operaciones */}
        <Text style={styles.sectionTitle}>OPERACIONES</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          {renderField(cita.surgeries, styles.blockText)}
        </View>
        {/* Dolencias */}
        <Text style={styles.sectionTitle}>DOLENCIAS</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          {renderField(cita.ailments, styles.blockText)}
        </View>
        {/* PI, PA, T, Diagnóstico Reflexológico */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.label}>P.I:</Text>
          {renderField(historia.weight, styles.fieldUnderline)}
          <Text style={styles.label}> KG /</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.label}>P.A:</Text>
          <View style={styles.shortUnderline} />
          <View style={styles.shortUnderline} />
          <Text style={styles.label}> KG /</Text>
          <Text style={[styles.label, { marginLeft: 4 }]}>
            {dayjs().format('DD/MM/YYYY')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.label}>T:</Text>
          <View style={styles.tinyUnderline} />
          <View style={styles.tinyUnderline} />
          <Text style={styles.label}> 0.0</Text>
        </View>
        <Text style={styles.sectionTitle}>DIAGNOSTICOS REFLEXOLOGICO</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          {renderField(cita.reflexology_diagnostics, styles.blockText)}
        </View>
        {/* Firma del terapeuta */}
        <View style={styles.firma}>
          <Text style={{ fontSize: 9 }}>Firma del terapeuta:</Text>
          <View style={styles.firmaLinea} />
        </View>
      </Page>
    </Document>
  );
};

export default FichaPDF;
