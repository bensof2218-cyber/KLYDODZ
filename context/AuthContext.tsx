import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type UserRole = 'seller_fr' | 'buyer_dz' | 'inspector';
export type SellerSubType = 'individual' | 'garage';
export type BuyerSubType = 'individual' | 'company';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subType?: SellerSubType | BuyerSubType;
  verified: boolean;
  bankVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  userRole: UserRole | null;
  isSeller: boolean;
  isBuyer: boolean;
  isInspector: boolean;
  login: (email: string, _password: string) => Promise<boolean>;
  register: (name: string, email: string, _password: string, role: UserRole, subType?: string) => Promise<boolean>;
  logout: () => void;
  bankVerify: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (v: 'login' | 'register') => void;
  selectedRole: UserRole | null;
  setSelectedRole: (v: UserRole | null) => void;
  selectedSubType: string | null;
  setSelectedSubType: (v: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    let role: UserRole = 'buyer_dz';
    if (email.includes('seller') || email.includes('garage')) role = 'seller_fr';
    else if (email.includes('agent') || email.includes('inspector')) role = 'inspector';

    setUser({
      id: 'demo-' + Date.now(),
      name: email.split('@')[0],
      email,
      role,
      verified: true,
      bankVerified: role === 'seller_fr',
    });
    setShowAuthModal(false);
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, role: UserRole, subType?: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({
      id: 'demo-' + Date.now(),
      name,
      email,
      role,
      subType: subType as SellerSubType | BuyerSubType,
      verified: true,
      bankVerified: role === 'seller_fr',
    });
    setShowAuthModal(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSelectedRole(null);
    setSelectedSubType(null);
  }, []);

  const bankVerify = useCallback(() => {
    setUser((prev) => (prev ? { ...prev, bankVerified: true } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        userRole: user?.role ?? null,
        isSeller: user?.role === 'seller_fr',
        isBuyer: user?.role === 'buyer_dz',
        isInspector: user?.role === 'inspector',
        login,
        register,
        logout,
        bankVerify,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        selectedRole,
        setSelectedRole,
        selectedSubType,
        setSelectedSubType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
