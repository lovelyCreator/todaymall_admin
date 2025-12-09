import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { history } from '@umijs/max';
import { login as loginApi, currentUser as getCurrentUserApi } from '@/services/ant-design-pro/api';
import { useAuthStore, type AdminUser } from '@/stores/authStore';
import type { API } from '@/services/ant-design-pro/typings';

/**
 * Login mutation hook
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log('🚀 Login mutation called:', { email: credentials.email });
      const response = await loginApi({
        email: credentials.email,
        password: credentials.password,
      });
      return response;
    },
    onSuccess: (data) => {
      console.log('✅ Login mutation success:', data);
      
      if (data.status === 'success' && data.data?.token && data.data?.admin) {
        const admin = data.data.admin;
        
        // Map admin data to AdminUser format
        const user: AdminUser = {
          _id: admin._id || '',
          email: admin.email || '',
          name: admin.name || '',
          role: admin.role || '',
          permissions: admin.permissions || [],
          isActive: admin.isActive ?? true,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
          lastLogin: admin.lastLogin,
        };

        // Set auth state in Zustand store
        setAuth(data.data.token, user);
        
        // Invalidate and refetch user queries
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        
        message.success(data.message || '로그인 성공!');
        
        // Redirect
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      } else {
        message.error(data.message || '로그인 실패');
      }
    },
    onError: (error: any) => {
      console.error('❌ Login mutation error:', error);
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        '로그인 실패. 콘솔에서 자세한 내용을 확인하세요.';
      message.error(errorMessage);
    },
  });
};

/**
 * Get current user query hook
 */
export const useCurrentUser = () => {
  const { token, user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('No token available');
      }
      
      console.log('📋 Fetching current user...');
      const response = await getCurrentUserApi({
        skipErrorHandler: true,
      });
      return response.data;
    },
    enabled: !!token && isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Logout mutation hook
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // Call logout API if needed
      // await outLogin();
      return true;
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      const { search, pathname } = window.location;
      const urlParams = new URL(window.location.href).searchParams;
      const searchParams = new URLSearchParams({
        redirect: pathname + search,
      });
      const redirect = urlParams.get('redirect');
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: searchParams.toString(),
        });
      }
    },
  });
};












