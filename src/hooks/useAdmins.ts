import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  createAdmin,
  deleteAdmin,
  getAdminById,
  getAdmins,
  updateAdmin,
} from '@/services/ant-design-pro/api';
import type { API } from '@/services/ant-design-pro/typings';

/**
 * Get admins list query hook
 */
export const useAdmins = (params?: API.AdminListParams) => {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: async () => {
      console.log('📋 Fetching admins list:', params);
      const response = await getAdmins(params);
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Get single admin by ID query hook
 */
export const useAdmin = (id: string | undefined) => {
  return useQuery({
    queryKey: ['admin', id],
    queryFn: async () => {
      if (!id) throw new Error('Admin ID is required');
      console.log('📋 Fetching admin by ID:', id);
      const response = await getAdminById(id);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Create admin mutation hook
 */
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: API.CreateAdminParams) => {
      console.log('➕ Creating admin:', { ...data, password: '***' });
      return createAdmin(data);
    },
    onSuccess: (response) => {
      console.log('✅ Admin created successfully:', response);
      // Invalidate and refetch admins list
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      message.success(response.message || '관리자가 추가되었습니다');
    },
    onError: (error: any) => {
      console.error('❌ Create admin error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '관리자 추가에 실패했습니다';
      message.error(errorMessage);
    },
  });
};

/**
 * Update admin mutation hook
 */
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: API.UpdateAdminParams;
    }) => {
      console.log('✏️ Updating admin:', { 
        id, 
        data: { ...data, password: data.password ? '***' : undefined },
        note: 'Auth token will be automatically added by request interceptor',
      });
      
      // Verify token is available before making request
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No auth token found! Please login again.');
        throw new Error('No authentication token found. Please login again.');
      }
      
      return updateAdmin(id, data);
    },
    onSuccess: (response, variables) => {
      console.log('✅ Admin updated successfully:', response);
      // Invalidate and refetch admins list and specific admin
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin', variables.id] });
      message.success(response.message || '관리자 정보가 수정되었습니다');
    },
    onError: (error: any) => {
      console.error('❌ Update admin error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '관리자 수정에 실패했습니다';
      message.error(errorMessage);
    },
  });
};

/**
 * Delete admin mutation hook
 */
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting admin:', id);
      return deleteAdmin(id);
    },
    onSuccess: (response) => {
      console.log('✅ Admin deleted successfully:', response);
      // Invalidate and refetch admins list
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      message.success(response.message || '관리자가 삭제되었습니다');
    },
    onError: (error: any) => {
      console.error('❌ Delete admin error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '관리자 삭제에 실패했습니다';
      message.error(errorMessage);
    },
  });
};

