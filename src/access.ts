// src/access.ts
import { useAuthStore } from '@/stores/authStore';

export default (initialState: { currentUser?: API.CurrentUser }) => {
  const { currentUser } = initialState ?? {};
  const { user } = useAuthStore.getState();

  // Prefer Zustand store user, fallback to initialState
  const effectiveUser = user 
    ? {
        role: user.role,
        access: user.role === 'superadmin' ? 'admin' : user.role,
        permissions: user.permissions,
      }
    : currentUser;

  // 역할 목록 (백엔드에서 내려오는 role 문자열 기준)
  console.log('current user', { effectiveUser, zustandUser: user, initialStateUser: currentUser });
  // superadmin role from backend or admin access grants full access
  const isSuperAdmin = 
    effectiveUser?.role === 'superadmin' || 
    effectiveUser?.access === 'admin' ||
    effectiveUser?.role === 'admin';
  
  const isPlatformAdmin =
    isSuperAdmin || effectiveUser?.access === 'PLATFORM_ADMIN';
  const isOperator = ['OPERATOR', 'CS', 'LOGISTICS', 'FINANCE'].includes(
    effectiveUser?.access || '',
  );

  // 권한 매핑 (superadmin has access to everything)
  return {
    // 대시보드
    canViewDashboard: true,

    // 상품
    canManageProducts: isSuperAdmin || isPlatformAdmin || effectiveUser?.access === 'OPERATOR',
    canViewProducts: isSuperAdmin || isPlatformAdmin || isOperator,
    canCreateProduct: isSuperAdmin || isPlatformAdmin || effectiveUser?.access === 'OPERATOR',
    canImportTaobao: isSuperAdmin || isPlatformAdmin || effectiveUser?.access === 'OPERATOR',

    // 주문
    canManageOrders:
      isSuperAdmin || isPlatformAdmin || isOperator || effectiveUser?.access === 'CS',

    // 물류
    canManageLogistics: isSuperAdmin || isPlatformAdmin || effectiveUser?.access === 'LOGISTICS',

    // 회원
    canManageMembers: isSuperAdmin || isPlatformAdmin || effectiveUser?.access === 'CS',

    // 정산
    canManageSettlement: isSuperAdmin || isPlatformAdmin || effectiveUser?.access === 'FINANCE',

    // 고객센터
    canManageCS: isSuperAdmin || isPlatformAdmin || effectiveUser?.access === 'CS',

    // 시스템
    isSuperAdmin,
  };
};
