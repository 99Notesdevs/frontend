import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type AuthModalType = 'login' | 'register';

export function useAuthModal() {
  const { openAuthModal, closeAuthModal } = useAuth();

  const showLogin = useCallback(() => {
    openAuthModal('login');
  }, [openAuthModal]);

  const showRegister = useCallback(() => {
    openAuthModal('register');
  }, [openAuthModal]);

  return {
    showLogin,
    showRegister,
    closeAuthModal,
  };
}
