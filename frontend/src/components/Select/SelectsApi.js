import { get } from '../../services/api/Axios/MethodsGeneral';

// Cache global para optimizar las llamadas a la API
const apiCache = {
  countries: null,
  regions: null,
  provinces: {},
  districts: {},
  documentTypes: null,
  paymentStatuses: null,
  predeterminedPrices: null,
  diagnoses: null,
};

// Función para limpiar el caché
export const clearApiCache = () => {
  Object.keys(apiCache).forEach((key) => {
    if (typeof apiCache[key] === 'object' && apiCache[key] !== null) {
      if (Array.isArray(apiCache[key])) {
        apiCache[key] = null;
      } else {
        apiCache[key] = {};
      }
    }
  });
};

// Servicios para selects de ubicación
export const getCountries = async () => {
  if (apiCache.countries) {
    return apiCache.countries;
  }

  const response = await get('ubigeo/countries');
  const data = response.data || [];
  apiCache.countries = data;
  return data;
};

export const getDepartaments = async () => {
  if (apiCache.regions) {
    return apiCache.regions;
  }

  const response = await get('ubigeo/regions');
  const data = response.data || [];
  apiCache.regions = data;
  return data;
};

export const getProvinces = async (departamentId) => {
  if (apiCache.provinces[departamentId]) {
    return apiCache.provinces[departamentId];
  }

  const response = await get(`ubigeo/provinces?region_id=${departamentId}`);
  const data = response.data || [];
  apiCache.provinces[departamentId] = data;
  return data;
};

export const getDistricts = async (provinceId) => {
  if (apiCache.districts[provinceId]) {
    return apiCache.districts[provinceId];
  }

  const response = await get(`ubigeo/districts?province_id=${provinceId}`);
  const data = response.data || [];
  apiCache.districts[provinceId] = data;
  return data;
};

// Servicios para selects de documentos
export const getDocumentTypes = async () => {
  if (apiCache.documentTypes) {
    return apiCache.documentTypes;
  }

  const response = await get('document-types'); // Endpoint exacto
  const data =
    response.data?.map((item) => ({
      value: item.id,
      label: item.name,
      description: item.description, // Opcional: para tooltips o info adicional
    })) || [];

  apiCache.documentTypes = data;
  return data;
};

// Servicios para estados de pago
export const getPaymentStatuses = async () => {
  if (apiCache.paymentStatuses) {
    return apiCache.paymentStatuses;
  }

  const response = await get('payment-types'); // Endpoint exacto
  const data =
    response.data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  apiCache.paymentStatuses = data;
  return data;
};

// Servicios para precios predeterminados
export const getPredeterminedPrices = async () => {
  if (apiCache.predeterminedPrices) {
    return apiCache.predeterminedPrices;
  }

  const response = await get('predetermined-prices'); // Endpoint exacto
  const data =
    response.data?.map((item) => ({
      value: item.id,
      label: item.name,
      price: item.price, // Agregamos el precio como propiedad adicional
    })) || [];

  apiCache.predeterminedPrices = data;
  return data;
};

// Servicios para diagnósticos  =====================> FALTA COLOCAR LA API UBICARLO EN LA CARPETA CORRECTA
export const getDiagnoses = async () => {
  if (apiCache.diagnoses) {
    return apiCache.diagnoses;
  }

  const response = await get('diagnosticos');
  const data =
    response.data?.map((item) => ({
      id: item.id || item.codigo,
      name: item.nombre || item.descripcion,
    })) || [];

  apiCache.diagnoses = data;
  return data;
};
