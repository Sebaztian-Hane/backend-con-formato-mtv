import { Modal } from 'antd';
import { useEffect } from 'react';
// components/Modal/EditModal.jsx

const EditModal = ({
  title,
  open,
  onCancel,
  onOk,
  children,
  width = '80%',
  okText = 'Guardar',
  cancelText = 'Cancelar',
  loading = false,
  destroyOnClose = true,
}) => {
  // Manejar eventos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!open) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        onOk();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOk, onCancel]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={width}
      okText={okText}
      cancelText={cancelText}
      destroyOnClose={destroyOnClose}
      okButtonProps={{ loading }}
    >
      {children}
    </Modal>
  );
};

export default EditModal;
