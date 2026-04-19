import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  isAdminLoggedIn: false,
  adminLogin: async () => false,
  adminLogout: () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const adminLogin = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    // Demo: accept admin@klydo.com / klydo2026
    if (email === 'admin@klydo.com' && password === 'klydo2026') {
      setAdmin({
        id: 'admin-1',
        name: 'Administrateur',
        email: 'admin@klydo.com',
        role: 'admin',
      });
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAdminLoggedIn: !!admin,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
