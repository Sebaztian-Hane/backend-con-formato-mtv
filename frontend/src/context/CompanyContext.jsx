import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  getSystemInfo,
  getCompanyLogo,
} from '../features/configuration/cSystem/services/systemServices';
import {
  persistLocalStorage,
  getLocalStorage,
} from '../utils/localStorageUtility';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const refetchCompanyInfo = useCallback(async () => {
    try {
      const data = await getSystemInfo();
      setCompanyInfo(data?.data);
      if (data?.data?.company_name) {
        persistLocalStorage('company_name', data.data.company_name);
      }
    } catch (error) {
      setCompanyInfo(null);
    }
  }, []);

  const refetchCompanyLogo = useCallback(async () => {
    try {
      const logoBlob = await getCompanyLogo();
      const url = URL.createObjectURL(logoBlob);
      setLogoUrl(url);
    } catch (logoError) {
      setLogoUrl(null);
    }
  }, []);

  useEffect(() => {
    const token = getLocalStorage('token');
    if (token) {
      setLoading(true);
      Promise.all([refetchCompanyInfo(), refetchCompanyLogo()]).finally(() => {
        setLoading(false);
      });
    }

    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, []);

  const value = {
    companyInfo,
    logoUrl,
    loading,
    refetchCompanyInfo,
    refetchCompanyLogo,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
