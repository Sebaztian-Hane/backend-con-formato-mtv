import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../features/auth/ui/login';
import View from '../pages/View';
import Prueba from '../pages/prueba';
import Patients from '../features/patients/ui/patients';
import Appointments from '../features/appointments/ui/appointments';
import Staff from '../features/staff/ui/staff';
import Home from '../features/home/ui/home';
import FirstSession from '../features/auth/ui/FirstSession/FirstSession';
import ChangesPassword from '../features/auth/ui/ChangesPassword/ChangesPassword';
import ReportGenerator from '../features/reports/ui/reports';
import Dashboard from '../features/statistic/ui/Dashboard';
import NewPatient from '../features/patients/ui/RegisterPatient/NewPatient';
import NewAppointment from '../features/appointments/ui/RegisterAppointment/NewAppointment';
import NewTherapist from '../features/staff/ui/RegisterTherapist/NewTherapist';
import Calendar from '../features/calendar/ui/Calendar';
import System from '../features/configuration/cSystem/System';
import Payments from '../features/configuration/cPayments/Payments';
import User from '../features/configuration/cUsers/Users';
import Profile from '../features/configuration/cProfile/Profile';
import Error404 from '../pages/Error/Error404';
import ProtectedRoute from './ProtectedRoute';
import Error500 from '../pages/Error/Error';
import AppointmentsComplete from '../features/appointmentsComplete/ui/appointmentsComplete';
import Historia from '../features/history/ui/PatientHistory';

const router = createBrowserRouter([
  {
    path: '*',
    element: <Error404 />,
  },
  {
    path: '/error500',
    element: <Error500 />,
  },
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/contraseñaolvidada',
    element: <h1>Contraseña olvidada</h1>,
  },
  {
    path: '/primerInicio',
    element: <FirstSession />,
  },
  {
    path: '/cambiarContraseña',
    element: <ChangesPassword />,
  },
  {
    path: '/Inicio',
    element: <ProtectedRoute allowedRoles={[1, 2]} />,
    children: [
      {
        path: '',
        element: <View />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'pacientes',
            element: <Patients />, // Listado principal
          },
          {
            path: 'pacientes/historia/:id', // Ruta independiente
            element: <Historia />,
          },
          {
            path: 'pacientes/registrar',
            element: <NewPatient />,
          },
          {
            path: 'citas',
            element: <Appointments />,
          },
          {
            path: 'calendar',
            element: <Calendar />,
          },
          {
            path: 'citas/registrar',
            element: <NewAppointment />,
          },
          {
            path: 'reportes',
            element: <ReportGenerator />,
          },
          {
            path: 'citasCompletas',
            element: <AppointmentsComplete />,
          },
          {
            path: 'estadisticas',
            element: <Dashboard />,
          },
          {
            path: 'terapeutas',
            element: <Staff />,
            children: [
              {
                path: 'editar/:id',
                element: <Prueba />,
              },
            ],
          },
          {
            path: 'terapeutas/registrar',
            element: <NewTherapist />,
          },
          {
            path: 'configPagos',
            element: <ProtectedRoute allowedRoles={[1]} />,
            children: [{ index: true, element: <Payments /> }],
          },
          {
            path: 'configPerfil',
            element: <Profile />,
          },
          {
            path: 'configSistema',
            element: <ProtectedRoute allowedRoles={[1]} />,
            children: [{ index: true, element: <System /> }],
          },
          {
            path: 'configUser',
            element: <ProtectedRoute allowedRoles={[1]} />,
            children: [{ index: true, element: <User /> }],
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
