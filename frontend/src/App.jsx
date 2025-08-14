import Dashboard from './pages/Dashboard/Dashboard';
import { AuthProvider } from './routes/AuthContext';
import { UserProvider } from './context/UserContext';
import { CompanyProvider } from './context/CompanyContext';
import Router from './routes/Router';
import { ToastProvider } from './services/toastify/ToastContext';

function App() {
  return (
    <ToastProvider>
      <CompanyProvider>
        <UserProvider>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </UserProvider>
      </CompanyProvider>
    </ToastProvider>
  );
}

export default App;
