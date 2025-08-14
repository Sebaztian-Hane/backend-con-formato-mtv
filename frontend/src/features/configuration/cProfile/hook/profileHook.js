import { useState, useEffect, useCallback } from 'react';
import {
  createPatient,
  verifyCode,
  updateProfileEmail,
  getProfile,
  updateAllProfile,
  validatePassword,
  changePassword,
  getUserPhoto,
  uploadProfilePhoto,
} from '../service/profileService';
import { useToast } from '../../../../services/toastify/ToastContext';
import { persistLocalStorage } from '../../../../utils/localStorageUtility';
import { formatToastMessage } from '../../../../utils/messageFormatter';

// Cache para almacenar datos temporalmente
const profileCache = {
  data: null,
  lastFetch: 0,
  ttl: 300000, // 5 minutos en ms
};

export const useSendVerifyCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const sendCode = useCallback(
    async (email) => {
      setLoading(true);
      setError(null);
      try {
        const data = { type_email: '2', new_email: email };
        const response = await createPatient(data);
        showToast('verificacionDosPasos');
        return response;
      } catch (err) {
        setError(err);
        showToast(
          'intentoFallido',
          formatToastMessage(err.response?.data?.message),
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  const verify = useCallback(
    async (code) => {
      setLoading(true);
      setError(null);
      try {
        const response = await verifyCode(code);

        if (response.valid === false) {
          const err = new Error(
            response.message || 'El código ingresado no coincide.',
          );
          err.response = { data: { message: response.message } };
          throw err;
        }

        showToast('codigoVerificado');
        return response;
      } catch (err) {
        setError(err);
        showToast(
          'codigoIncorrecto',
          formatToastMessage(err.response?.data?.message || err.message),
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  const updateEmail = useCallback(
    async (email, code) => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateProfileEmail(email, code);
        showToast('exito', 'Correo electrónico actualizado con éxito');
        return response;
      } catch (err) {
        setError(err);
        showToast(
          'error',
          formatToastMessage(
            err.response?.data?.message,
            'Error al actualizar el correo',
          ),
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  return { sendCode, verify, updateEmail, loading, error };
};

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchProfile = useCallback(
    async (force = false) => {
      // Usar caché si está disponible y no está expirado
      const now = Date.now();
      if (
        !force &&
        profileCache.data &&
        now - profileCache.lastFetch < profileCache.ttl
      ) {
        setProfile(profileCache.data.profile);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [profileData, photoData] = await Promise.allSettled([
          getProfile(),
        ]);

        const profileResult =
          profileData.status === 'fulfilled' ? profileData.value : null;

        // Actualizar caché
        profileCache.data = {
          profile: profileResult,
        };
        profileCache.lastFetch = now;

        setProfile(profileResult);
        persistLocalStorage('user_full_name', profileResult?.full_name);
      } catch (error) {
        setError(error);
        showToast('error', 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};

export const useUpdateProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const { showToast } = useToast();

  const updateProfile = useCallback(
    async (data) => {
      try {
        setIsUpdating(true);
        setUpdateError(null);
        const updatedProfile = await updateAllProfile(data);
        profileCache.lastFetch = 0;
        showToast('configuracionGuardada');
        return updatedProfile;
      } catch (error) {
        setUpdateError(error);
        showToast(
          'error',
          formatToastMessage(
            error.response?.data?.message,
            'Error al actualizar el perfil',
          ),
        );
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [showToast],
  );

  const validateCurrentPassword = useCallback(
    async (currentPassword) => {
      try {
        const response = await validatePassword({
          current_password: currentPassword,
        });
        showToast('exito', 'Contraseña verificada correctamente');
        return response;
      } catch (error) {
        showToast('contraseñaIncorrecta');
        throw error;
      }
    },
    [showToast],
  );

  const updatePassword = useCallback(
    async (newPassword) => {
      try {
        const response = await changePassword({ password: newPassword });
        showToast('contraseñaCambiada');
        return response;
      } catch (error) {
        showToast(
          'error',
          formatToastMessage(
            error.response?.data?.message,
            'Error al cambiar la contraseña',
          ),
        );
        throw error;
      }
    },
    [showToast],
  );

  return {
    updateProfile,
    validateCurrentPassword,
    updatePassword,
    isUpdating,
    error: updateError,
  };
};

//HOOK PARA CONSEGUIR LA IMAGEN DEL PERFIL
export const useUserPhoto = () => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getUserPhoto(controller.signal)
      .then(setPhotoUrl)
      .catch(() => setPhotoUrl(null))
      .finally(() => setLoading(false));
  }, []);

  return { photoUrl, loading };
};

//HOOK PARA ACTUALIZAR LA IMAGEN DEL PERFIL
export const useUploadUserAvatar = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const uploadAvatar = async (file) => {
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await uploadProfilePhoto(file);
      setSuccess(true);
      showToast(
        'imageUploadSuccess',
        response.message || 'Avatar actualizado correctamente',
      );
    } catch (error) {
      setError(error);
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'Error al subir el avatar',
        ),
      );
    } finally {
      setUploading(false);
    }
  };

  return { uploadAvatar, uploading, error, success };
};
