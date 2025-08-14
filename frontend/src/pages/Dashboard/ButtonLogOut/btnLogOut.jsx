import { useState } from 'react';
import Style from './btnLogOut.module.css';
import { useAuth } from '../../../features/auth/hook/authHook';

export default function BtnLogOut() {
  const { logOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await logOut();
      // window.location.reload(); // Eliminado para no recargar la página
    } catch (error) {
      console.error('Error durante el logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogOut}
      className={Style.btnLogOut}
      disabled={loading}
    >
      {loading ? (
        <span className={Style.spinnerContainer}>
          <span className={Style.spinner}></span>
          Cerrando...
        </span>
      ) : (
        'Cerrar sesión'
      )}
    </button>
  );
}
