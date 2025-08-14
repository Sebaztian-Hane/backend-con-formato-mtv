import { useEffect, useState, useCallback, useRef } from 'react';
import {
  getSystemInfo,
  getCompanyLogo,
  updateSystemaInfo,
  updateCompanyLogo,
} from '../services/systemServices';
import { persistLocalStorage } from '../../../../utils/localStorageUtility';
import { useToast } from '../../../../services/toastify/ToastContext';
import { formatToastMessage } from '../../../../utils/messageFormatter';

//CONSIGUE EL LOGO
export const useSystemHook = () => {
  const [logoUrl, setLogoUrl] = useState(null); // URL para mostrar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchLogo = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const blob = await getCompanyLogo(controller.signal);

      const url = URL.createObjectURL(blob);
      setLogoUrl(url);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogo();
    return () => {
      abortControllerRef.current?.abort();
      if (logoUrl) URL.revokeObjectURL(logoUrl); //  Limpieza
    };
  }, [fetchLogo]);

  return {
    logoUrl,
    loading,
    error,
    refetch: fetchLogo,
  };
};

//ACTUALIZA EL LOGO
export const useUploadCompanyLogo = () => {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { showToast } = useToast();

  const uploadLogo = async (file) => {
    setUploadingLogo(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const response = await updateCompanyLogo(file);
      setUploadSuccess(true);
      showToast(
        'imageUploadSuccess',
        response.message || 'Logo actualizado correctamente',
      );
    } catch (err) {
      setUploadError(err);
      showToast(
        'error',
        formatToastMessage(
          err.response?.data?.message,
          'Error al subir el logo',
        ),
      );
    } finally {
      setUploadingLogo(false);
    }
  };

  return { uploadLogo, uploadingLogo, uploadError, uploadSuccess };
};

//CONSIGUE LOS DATOS DE LA EMPRESA
export const useCompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  const fetchCompanyInfo = async () => {
    setLoadingInfo(true);
    setErrorInfo(null);

    try {
      const data = await getSystemInfo();
      setCompanyInfo(data?.data); // <- Asegura que tomas la propiedad `data`

      //  Guardamos también en localStorage
      if (data?.data?.company_name) {
        persistLocalStorage('company_name', data.data.company_name);
      }
    } catch (err) {
      setErrorInfo(err);
    } finally {
      setLoadingInfo(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  return {
    companyInfo,
    loadingInfo,
    errorInfo,
    refetchCompanyInfo: fetchCompanyInfo,
  };
};

//ACTUALIZA LOS DATOS DE LA EMPRESA
export const useUpdateCompanyInfo = () => {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { showToast } = useToast();

  const updateCompany = async (newData) => {
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      await updateSystemaInfo(newData);
      setUpdateSuccess(true);
      showToast('datoGuardado');
      if (newData?.company_name) {
        persistLocalStorage('company_name', newData.company_name);
      }
    } catch (error) {
      setUpdateError(error);
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'Error al actualizar la información',
        ),
      );
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateCompany,
    updating,
    updateError,
    updateSuccess,
  };
};
