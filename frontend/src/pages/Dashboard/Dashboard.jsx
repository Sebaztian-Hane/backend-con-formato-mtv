import Style from './Dashboard.module.css';
import { img } from '../../utils/vars';
import { Avatar, Divider, Spin, ConfigProvider } from 'antd';
import MenuDashboard from './Menu/Menu';
import BtnLogOut from './ButtonLogOut/btnLogOut';
import { useAuth } from '../../routes/AuthContext';
import { useUser } from '../../context/UserContext';
import { useCompany } from '../../context/CompanyContext';
import { useNavigate, useLocation } from 'react-router';

export default function Dashboard() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { profile, photoUrl, loading: userLoading } = useUser();
  const { companyInfo, logoUrl, loading: companyLoading } = useCompany();

  const companyName = companyInfo?.company_name || 'Empresa';
  const fullName = profile?.full_name || 'Usuario';
  const role =
    userRole === 1 ? 'Administrador' : userRole === 2 ? 'Usuario' : 'Invitado';

  return (
    <div className={Style.dashboardContainer}>
      <div className={Style.dashboardHeader}>
        {companyLoading ? (
          <ConfigProvider theme={{ token: { colorPrimary: '#4CAF50' } }}>
            <Spin />
          </ConfigProvider>
        ) : (
          <img
            alt="Logo de reflexo"
            src={logoUrl || img}
            style={{
              width: 'clamp(50px, 8vw, 90px)',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #4CAF50',
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        )}
        <p>{companyName}</p>
      </div>
      <Divider
        style={{
          marginBottom: '15px',
          marginTop: '15px',
          backgroundColor: '#333333',
        }}
      />
      <div className={Style.dashboardUser}>
        {userLoading ? (
          <ConfigProvider theme={{ token: { colorPrimary: '#4CAF50' } }}>
            <Spin />
          </ConfigProvider>
        ) : (
          <>
            <Avatar
              alt="Logo de avatar"
              src={photoUrl || img}
              style={{
                width: 'clamp(35px, 4vw, 45px)',
                height: 'auto',
                aspectRatio: '1 / 1',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div className={Style.dashboardUserName}>
              <div>
                <h1>{fullName}</h1>
              </div>
              <div>
                <p>{role}</p>
              </div>
            </div>
          </>
        )}
      </div>
      <Divider
        style={{
          marginBottom: '5px',
          marginTop: '15px',
          backgroundColor: '#333333',
        }}
      />
      <div className={Style.dashboardMenu}>
        <MenuDashboard />
      </div>
      <div className={Style.dashboardFooter}>
        <Divider style={{ backgroundColor: '#333333' }} />
        <BtnLogOut />
        <p>© 2025 Centro de Reflexoterapia </p>
      </div>
    </div>
  );
}
