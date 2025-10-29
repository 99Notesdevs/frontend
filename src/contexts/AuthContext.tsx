"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type AuthModalType = 'login' | 'register' | null;

type AuthContextType = {
  isAuthModalOpen: boolean;
  authModalType: AuthModalType;
  openAuthModal: (type: AuthModalType) => void;
  closeAuthModal: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<AuthModalType>(null);

  const openAuthModal = (type: AuthModalType) => {
    setAuthModalType(type);
    setIsAuthModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalType(null);
    document.body.style.overflow = 'unset'; // Re-enable scrolling
  };

  return (
    <AuthContext.Provider value={{ isAuthModalOpen, authModalType, openAuthModal, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
