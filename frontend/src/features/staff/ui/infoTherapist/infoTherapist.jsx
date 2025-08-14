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

const InfoTherapist = ({ therapist, open, onClose }) => {
  if (!therapist) return null;

  // Construir nombre completo
  const fullName =
    therapist.full_name ||
    `${therapist.paternal_lastname || ''} ${therapist.maternal_lastname || ''} ${therapist.name || ''}`.trim();

  // Avatar: usar foto si hay, si no, icono. Evitar deformación del icono.
  const avatarUrl = therapist.photo_url || null;
  const avatarProps = avatarUrl
    ? { src: avatarUrl }
    : { icon: <UserOutlined style={{ fontSize: 38 }} /> };

  // Estado para ubigeo
  const [ubigeo, setUbigeo] = useState({
    departamento: '-',
    provincia: '-',
    distrito: '-',
  });

  useEffect(() => {
    async function fetchUbigeo() {
      if (
        therapist.region ||
        therapist.region_id ||
        therapist.departamento_id ||
        therapist.province ||
        therapist.province_id ||
        therapist.provincia_id ||
        therapist.district ||
        therapist.district_id ||
        therapist.distrito_id
      ) {
        const region_id =
          therapist.region || therapist.region_id || therapist.departamento_id;
        const province_id =
          therapist.province || therapist.province_id || therapist.provincia_id;
        const district_id =
          therapist.district || therapist.district_id || therapist.distrito_id;
        let departamento = '-';
        let provincia = '-';
        let distrito = '-';
        if (region_id) {
          const departamentos = await getDepartaments();
          const safeDepartamentos = Array.isArray(departamentos) ? departamentos : [];
          const found = safeDepartamentos.find(
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
  }, [open, therapist]);

  return (
    <Modal
      title={
        <span style={{ fontWeight: 600, fontSize: 20 }}>
          Información del Terapeuta
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
            {therapist.document_type?.name || 'Documento'}:{' '}
            {therapist.document_number || '-'}
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
          {therapist.email || 'No registrado'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label={<PhoneOutlined />}>
          {' '}
          {therapist.primary_phone ||
            therapist.phone ||
            therapist.phone1 ||
            'No registrado'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Sexo">
          {' '}
          {therapist.sex === 'M'
            ? 'Masculino'
            : therapist.sex === 'F'
              ? 'Femenino'
              : '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de nacimiento">
          {' '}
          {therapist.birth_date || therapist.dateBith || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label={<HomeOutlined />}>
          {' '}
          {therapist.address || '-'}{' '}
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
        <Descriptions.Item label="Referencia personal">
          {' '}
          {therapist.personal_reference || '-'}{' '}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default InfoTherapist;
