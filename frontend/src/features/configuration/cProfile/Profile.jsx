import React, { useState, useEffect } from 'react';
import {
  Upload,
  Select,
  Button,
  Input,
  Image,
  message,
  Form,
  ConfigProvider,
  Input as AntdInput,
} from 'antd';
import {
  Envelope,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
} from '@phosphor-icons/react';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './Profile.module.css';
import {
  useSendVerifyCode,
  useUpdateProfile,
  useUploadUserAvatar,
} from './hook/profileHook';
import { useToast } from '../../../services/toastify/ToastContext';
import ModalBase from '../../../components/Modal/BaseModalProfile/BaseModalProfile';
import { useUser } from '../../../context/UserContext';

const { Password } = AntdInput;

const Profile = () => {
  const {
    profile,
    photoUrl,
    refetchProfile,
    refetchPhoto,
    loading: profileLoading,
  } = useUser();

  const [avatar, setAvatar] = useState(
    photoUrl || '/src/assets/Img/MiniLogoReflexo.webp',
  );
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [genero, setGenero] = useState(null);
  const [telefono, setTelefono] = useState('');

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showCurrentPasswordModal, setShowCurrentPasswordModal] =
    useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [currentPasswordLoading, setCurrentPasswordLoading] = useState(false);
  const [newPasswordLoading, setNewPasswordLoading] = useState(false);

  const [emailForm] = Form.useForm();
  const [codeForm] = Form.useForm();
  const [currentPasswordForm] = Form.useForm();
  const [newPasswordForm] = Form.useForm();

  const {
    sendCode,
    verify,
    updateEmail,
    loading: codeLoading,
    error: codeError,
  } = useSendVerifyCode();
  const { updateProfile, isUpdating, validateCurrentPassword, updatePassword } =
    useUpdateProfile();
  const { showToast } = useToast();

  const { uploadAvatar, uploading, error: uploadError } = useUploadUserAvatar();

  useEffect(() => {
    if (profile) {
      setNombre(profile.name || '');
      setApellidoPaterno(profile.paternal_lastname || '');
      setApellidoMaterno(profile.maternal_lastname || '');
      setCorreo(profile.email || '');
      setGenero(profile.sex || null);
      setTelefono(profile.phone || '');
    }
  }, [profile]);

  useEffect(() => {
    if (photoUrl) {
      setAvatar(photoUrl);
    }
  }, [photoUrl]);

  const handleAvatarChange = async ({ file }) => {
    if (file.status !== 'done') return;

    const newFile = file.originFileObj;
    if (!newFile) return;

    const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target.result);
    reader.readAsDataURL(newFile);

    try {
      await uploadAvatar(newFile);
      refetchPhoto();
    } catch (err) {
      console.error('Error capturado en el componente:', err);
    }
  };

  const handleOpenEmailModal = () => {
    setShowEmailModal(true);
    emailForm.resetFields();
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setNewEmail('');
    emailForm.resetFields();
  };

  const handleSubmitNewEmail = async (values) => {
    try {
      setNewEmail(values.email);
      await sendCode(values.email);
      message.success('Código de verificación enviado');
      setShowEmailModal(false);
      setShowCodeModal(true);
      startCountdown();
    } catch (err) {
      message.error('Error al enviar el código. Intenta de nuevo.');
    }
  };

  const handleCloseCodeModal = () => {
    setShowCodeModal(false);
    setCode('');
    setNewEmail('');
    setCountdown(0);
    codeForm.resetFields();
  };

  const handleVerifyCode = async (values) => {
    setVerifyLoading(true);
    try {
      await verify(values.code);
      await updateEmail(newEmail, values.code);
      setCorreo(newEmail);
      setShowCodeModal(false);
    } catch (error) {
      console.error(
        'Error en el flujo de verificación y actualización:',
        error,
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    try {
      await sendCode(newEmail);
      message.success('Código reenviado');
      startCountdown();
    } catch {
      message.error('Error al reenviar el código');
    }
  };

  const handleOpenPasswordModal = () => {
    setShowCurrentPasswordModal(true);
    currentPasswordForm.resetFields();
  };

  const handleCloseCurrentPasswordModal = () => {
    setShowCurrentPasswordModal(false);
    setCurrentPassword('');
    currentPasswordForm.resetFields();
  };

  const handleSubmitCurrentPassword = async (values) => {
    setCurrentPasswordLoading(true);
    try {
      await validateCurrentPassword(values.currentPassword);
      setCurrentPassword(values.currentPassword);
      setShowCurrentPasswordModal(false);
      setShowNewPasswordModal(true);
      message.success('Contraseña actual verificada');
    } catch (error) {
      message.error('Contraseña actual incorrecta');
    } finally {
      setCurrentPasswordLoading(false);
    }
  };

  const handleCloseNewPasswordModal = () => {
    setShowNewPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    newPasswordForm.resetFields();
  };

  const handleSubmitNewPassword = async (values) => {
    setNewPasswordLoading(true);
    try {
      await updatePassword(values.newPassword);
      setShowNewPasswordModal(false);
      message.success('¡Contraseña actualizada exitosamente!');
    } catch (error) {
      message.error('Error al actualizar la contraseña');
    } finally {
      setNewPasswordLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSaveChanges = async () => {
    try {
      const updateData = {
        name: nombre,
        paternal_lastname: apellidoPaterno,
        maternal_lastname: apellidoMaterno,
        sex: genero,
        phone: telefono,
      };

      await updateProfile(updateData);
      message.success('Cambios guardados exitosamente');
      refetchProfile();
    } catch (error) {
      message.error('Error al guardar los cambios');
    }
  };

  const theme = {
    token: {
      colorPrimary: '#4CAF50',
      colorBgContainer: '#1e1e1e',
      colorText: 'white',
      colorTextPlaceholder: '#666',
      colorBorder: '#444',
      colorBgElevated: '#2a2a2a',
      colorError: '#ff4d4f',
    },
    components: {
      Modal: {
        contentBg: 'linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%)',
        headerBg: 'transparent',
        titleColor: 'white',
        colorText: '#b0b0b0',
        borderRadiusLG: 16,
        paddingContentHorizontal: 0,
        paddingMD: 0,
      },
      Button: {
        defaultHoverBg: 'rgba(255, 255, 255, 0.08)',
        defaultHoverColor: 'white',
      },
      Input: {
        colorBgContainer: '#2a2a2a',
        activeBorderColor: '#4CAF50',
        hoverBorderColor: '#4CAF50',
        activeShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)',
      },
      Select: {
        optionSelectedBg: '#333',
        optionActiveBg: '#3a3a3a',
      },
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <div className={styles.body}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>{/* Sidebar content */}</aside>

          <main className={styles.mainContent}>
            <header className={styles.header}>{/* Header content */}</header>

            <section className={styles.container}>
              <div className={styles.card}>
                <h2 className={styles.title}>PERFIL</h2>

                {/* Avatar */}
                <div className={styles.section}>
                  <label className={styles.label}>Avatar:</label>
                  <div className={styles.logoRow}>
                    <div className={styles.logoBlock}>
                      {avatar ? (
                        <Image
                          src={avatar}
                          alt="Avatar del usuario"
                          preview={false}
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #4CAF50',
                            padding: '3px',
                            backgroundColor: '#000',
                          }}
                        />
                      ) : (
                        <div className={styles.noLogo}>
                          No hay avatar disponible
                        </div>
                      )}
                    </div>
                    <div className={styles.logoBlock}>
                      <Upload
                        name="logo"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        accept="image/*"
                        customRequest={({ file, onSuccess }) => {
                          onSuccess('ok');
                        }}
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith('image/');
                          if (!isImage) {
                            message.error(
                              'Solo puedes subir archivos de imagen!',
                            );
                          }
                          const isLt2M = file.size / 1024 / 1024 < 2;
                          if (!isLt2M) {
                            message.error('¡La imagen debe ser menor a 2MB!');
                          }
                          return isImage && isLt2M ? true : Upload.LIST_IGNORE;
                        }}
                        onChange={handleAvatarChange}
                        style={{
                          borderRadius: '50%',
                          border: '2px dashed #4CAF50',
                          width: 97,
                          height: 97,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#1a1a1a', // si estás en modo oscuro
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ color: '#fff', textAlign: 'center' }}>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Subir avatar</div>
                        </div>
                      </Upload>
                    </div>
                  </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.formField}>
                  <label className={styles.label}>Nombre:</label>
                  <Input
                    className={styles.input}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Apellido Paterno:</label>
                  <Input
                    className={styles.input}
                    value={apellidoPaterno}
                    onChange={(e) => setApellidoPaterno(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Apellido Materno:</label>
                  <Input
                    className={styles.input}
                    value={apellidoMaterno}
                    onChange={(e) => setApellidoMaterno(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Género:</label>
                  <Select
                    className={styles.select}
                    value={genero}
                    onChange={setGenero}
                    allowClear
                    options={[
                      { value: 'M', label: 'Masculino' },
                      { value: 'F', label: 'Femenino' },
                    ]}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Correo:</label>
                  <div className={styles.emailContainer}>
                    <Input className={styles.input} value={correo} readOnly />
                    <Button
                      className={styles.cambiarBtn}
                      onClick={handleOpenEmailModal}
                      icon={<Envelope size={16} />}
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Contraseña:</label>
                  <div className={styles.passwordContainer}>
                    <Button
                      className={styles.cambiarBtn}
                      icon={<ShieldCheck size={16} />}
                      onClick={handleOpenPasswordModal}
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>

                <div className={styles.saveButtonContainer}>
                  <Button
                    type="primary"
                    className={styles.saveButton}
                    size="large"
                    onClick={handleSaveChanges}
                    loading={isUpdating}
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>

        <ModalBase
          isOpen={showEmailModal}
          onClose={handleCloseEmailModal}
          onSubmit={handleSubmitNewEmail}
          title="Cambiar correo electrónico"
          description="Para actualizar tu correo electrónico, ingresa tu nuevo correo y te enviaremos un código de verificación."
          type="email"
          loading={codeLoading}
        />
        <ModalBase
          isOpen={showCodeModal}
          onClose={handleCloseCodeModal}
          onSubmit={handleVerifyCode}
          title="Verificar tu identidad"
          type="code"
          email={newEmail}
          countdown={countdown}
          onResend={handleResendCode}
          loading={verifyLoading}
        />
        <ModalBase
          isOpen={showCurrentPasswordModal}
          onClose={handleCloseCurrentPasswordModal}
          onSubmit={handleSubmitCurrentPassword}
          title="Cambiar contraseña"
          description="Para actualizar tu contraseña, primero ingresa tu contraseña actual para verificar tu identidad."
          type="currentPassword"
          loading={currentPasswordLoading}
        />
        <ModalBase
          isOpen={showNewPasswordModal}
          onClose={handleCloseNewPasswordModal}
          onSubmit={handleSubmitNewPassword}
          title="Crear nueva contraseña"
          description="Ingresa tu nueva contraseña y confírmala para completar el proceso."
          type="newPassword"
          loading={newPasswordLoading}
        />
      </div>
    </ConfigProvider>
  );
};

export default Profile;
