import { Modal, Descriptions, Avatar, Button } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  getDepartaments,
  getProvinces,
  getDistricts,
} from '../../../../components/Select/SelectsApi';

const InfoPatient = ({ patient, open, onClose }) => {
  if (!patient) return null;

  // Construir nombre completo
  const fullName =
    patient.full_name ||
    `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim();

  // Avatar: usar foto si hay, si no, icono. Evitar deformación del icono.
  const avatarUrl = patient.photo_url || null;
  const avatarProps = avatarUrl
    ? { src: avatarUrl }
    : { icon: <UserOutlined style={{ fontSize: 38 }} /> };

  // Estado para ubigeo
  const [ubigeo, setUbigeo] = useState({
    departamento: patient.region_name || '-',
    provincia: patient.province_name || '-',
    distrito: patient.district_name || '-',
  });

  useEffect(() => {
    // Si ya vienen los nombres desde el backend, no hacer fetch
    if (patient.region_name && patient.province_name && patient.district_name) {
      setUbigeo({
        departamento: patient.region_name,
        provincia: patient.province_name,
        distrito: patient.district_name,
      });
      return;
    }
    async function fetchUbigeo() {
      if (
        patient.region ||
        patient.region_id ||
        patient.departamento_id ||
        patient.province ||
        patient.province_id ||
        patient.provincia_id ||
        patient.district ||
        patient.district_id ||
        patient.distrito_id
      ) {
        const region_id =
          patient.region || patient.region_id || patient.departamento_id;
        const province_id =
          patient.province || patient.province_id || patient.provincia_id;
        const district_id =
          patient.district || patient.district_id || patient.distrito_id;
        let departamento = '-';
        let provincia = '-';
        let distrito = '-';
        if (region_id) {
          const departamentos = await getDepartaments();
          const found = departamentos.find(
            (d) => String(d.id) === String(region_id),
          );
          if (found) departamento = found.name;
        }
        if (province_id) {
          const provincias = await getProvinces(region_id);
          const found = provincias.find(
            (p) => String(p.id) === String(province_id),
          );
          if (found) provincia = found.name;
        }
        if (district_id) {
          const distritos = await getDistricts(province_id);
          const found = distritos.find(
            (d) => String(d.id) === String(district_id),
          );
          if (found) distrito = found.name;
        }
        setUbigeo({ departamento, provincia, distrito });
      } else {
        setUbigeo({ departamento: '-', provincia: '-', distrito: '-' });
      }
    }
    if (open) fetchUbigeo();
  }, [open, patient]);

  return (
    <Modal
      title={
        <span style={{ fontWeight: 600, fontSize: 20 }}>
          Información del Paciente
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          type="primary"
          style={{ background: '#4caf50', borderColor: '#4caf50' }}
        >
          Cerrar
        </Button>,
      ]}
      width={600}
      centered
      bodyStyle={{ background: '#1e1e1e', color: '#fff', borderRadius: 12 }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 24,
        }}
      >
        <Avatar
          size={80}
          {...avatarProps}
          style={{
            background: '#4caf50',
            color: '#fff',
            objectFit: 'cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
            {fullName}
          </div>
          <div style={{ color: '#aaa', fontSize: 16 }}>
            {patient.document_type?.name || 'Documento'}:{' '}
            {patient.document_number || '-'}
          </div>
        </div>
      </div>
      <Descriptions
        column={1}
        labelStyle={{ color: '#4caf50', fontWeight: 600, width: 180 }}
        contentStyle={{ color: '#fff', fontWeight: 400 }}
        bordered
        size="middle"
        style={{ background: '#232323', borderRadius: 8 }}
      >
        <Descriptions.Item label={<MailOutlined />}>
          {' '}
          {patient.email || 'No registrado'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label={<PhoneOutlined />}>
          {' '}
          {patient.primary_phone ||
            patient.phone ||
            patient.phone1 ||
            'No registrado'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Sexo">
          {' '}
          {patient.sex === 'M'
            ? 'Masculino'
            : patient.sex === 'F'
              ? 'Femenino'
              : '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de nacimiento">
          {' '}
          {patient.birth_date || patient.dateBirth || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label={<HomeOutlined />}>
          {' '}
          {patient.address || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Departamento">
          {' '}
          {ubigeo.departamento}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Provincia">
          {' '}
          {ubigeo.provincia}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Distrito">
          {' '}
          {ubigeo.distrito}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Ocupación">
          {' '}
          {patient.ocupation || patient.occupation || '-'}{' '}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default InfoPatient;
