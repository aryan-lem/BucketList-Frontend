"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const UserContext = createContext(null);

// Public routes that don't require authentication
const authRoutes = ['/auth/login', '/auth/register'];
const protectedRoutes = ['/dashboard'];

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshTokenValue, setRefreshToken] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication on page load and route changes
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');
      
      // If user has tokens, consider them logged in
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
        
        // If logged in user tries to access auth pages, redirect to dashboard
        if (authRoutes.includes(pathname)) {
          router.push('/dashboard');
        }
      } else {
        // Not logged in
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        
        // If unauthenticated user tries to access protected routes, redirect to login
        if (protectedRoutes.includes(pathname)) {
          router.push('/auth/login');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [pathname, router]);

  const login = (userData, tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setUser(userData);
    
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    
    router.push('/auth/login');
  };

  const refreshUserToken = async () => {
    try {
      if (!refreshTokenValue) return false;
      
      const response = await refreshToken(refreshTokenValue);
      
      if (response.accessToken) {
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      accessToken, 
      refreshTokenValue,
      loading, 
      login, 
      logout,
      refreshUserToken,
      isAuthenticated: !!user && !!accessToken
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);