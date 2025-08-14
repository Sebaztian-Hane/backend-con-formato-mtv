import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  getProfile,
  getUserPhoto,
} from '../features/configuration/cProfile/service/profileService';
import {
  persistLocalStorage,
  getLocalStorage,
} from '../utils/localStorageUtility';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const refetchProfile = useCallback(async () => {
    try {
      const profileData = await getProfile();
      setProfile(profileData);
      persistLocalStorage('user_full_name', profileData?.full_name);
      persistLocalStorage('user_name', profileData?.name);
    } catch (error) {
      console.error('Error fetching user profile for context', error);
    }
  }, []);

  const refetchPhoto = useCallback(async () => {
    try {
      const photoDataUrl = await getUserPhoto();
      setPhotoUrl(photoDataUrl);
    } catch (photoError) {
      console.error('Error fetching user photo for context', photoError);
      setPhotoUrl(null);
    }
  }, []);

  useEffect(() => {
    const token = getLocalStorage('token');
    if (token) {
      setLoading(true);
      Promise.all([refetchProfile(), refetchPhoto()]).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  const value = {
    profile,
    userName: profile?.name,
    photoUrl,
    loading,
    refetchProfile,
    refetchPhoto,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
