import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import api from '@/api/axios';
import type { User, TokenResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'ADMIN' | 'MEMBER') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (accessToken && storedUser && accessToken !== 'undefined' && accessToken !== 'null') {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        
        // Sync user role and details from backend
        api.get<User>('/api/auth/me')
          .then(response => {
            const freshUser = response.data;
            localStorage.setItem('user', JSON.stringify(freshUser));
            setUser(freshUser);
          })
          .catch(err => {
            console.error('Failed to sync user profile:', err);
          });
      } catch {
        localStorage.clear();
      }
    } else if (accessToken === 'undefined' || accessToken === 'null') {
      localStorage.clear();
    }
    setIsLoading(false);
  }, []);

  const handleAuthResponse = useCallback((data: TokenResponse) => {
    const { accessToken, refreshToken, id, name, email, role } = data;
    const userData: User = {
      id,
      name,
      email,
      role: role as 'ADMIN' | 'MEMBER',
    };

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post<TokenResponse>('/api/auth/login', {
        email,
        password,
      });
      handleAuthResponse(response.data);
    },
    [handleAuthResponse]
  );

  const register = useCallback(
    async (name: string, email: string, password: string, role: 'ADMIN' | 'MEMBER' = 'MEMBER') => {
      const response = await api.post<TokenResponse>('/api/auth/register', {
        name,
        email,
        password,
        role,
      });
      handleAuthResponse(response.data);
    },
    [handleAuthResponse]
  );

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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
