import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import React from 'react';
import { AvatarDropdown, AvatarName, SelectLang } from '@/components';
import { NotificationIcon } from '@/components/RightContent/NotificationIcon';
import { QueryProvider } from '@/providers/QueryProvider';
import { useAuthStore } from '@/stores/authStore';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';
import './global.css';

/**
 * Root container wrapper - wraps entire app with QueryProvider
 * This ensures QueryProvider is available even for pages with layout: false
 */
export function rootContainer(container: React.ReactElement) {
  return React.createElement(QueryProvider, null, container);
}

const isDev = process.env.NODE_ENV === 'development';
const isDevOrTest = isDev || process.env.CI;
const loginPath = '/user/login';

// Server URL from environment or default
// @ts-ignore - process.env.SERVER_URL is defined in config
// Remove quotes if present (from define config)
const rawServerUrl = process.env.SERVER_URL || 'http://221.138.36.200:5000';
const SERVER_URL = typeof rawServerUrl === 'string' ? rawServerUrl.replace(/^"|"$/g, '') : 'http://221.138.36.200:5000';

console.log('🔧 Server Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  SERVER_URL: SERVER_URL,
  isDev: isDev,
  'process.env.SERVER_URL (raw)': process.env.SERVER_URL,
  'rawServerUrl': rawServerUrl,
});

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  console.log('🔍 getInitialState called');
  
  // Check if we're on login page - don't try to get user
  const { location } = history;
  const isLoginPage = location.pathname === loginPath;
  
  console.log('📍 Current path:', location.pathname, 'isLoginPage:', isLoginPage);
  
  // Get user from Zustand store (persisted) - only if not on login page
  let currentUser: API.CurrentUser | undefined = undefined;
  
  if (!isLoginPage) {
    try {
      const { user, isAuthenticated } = useAuthStore.getState();
      console.log('👤 Zustand store state:', { hasUser: !!user, isAuthenticated });
      
      // Map Zustand user to API.CurrentUser format for compatibility
      if (user && isAuthenticated) {
        currentUser = {
          name: user.name,
          email: user.email,
          userid: user._id,
          access: user.role === 'superadmin' ? 'admin' : user.role,
          role: user.role,
          _id: user._id,
          permissions: user.permissions,
          isActive: user.isActive,
        };
        console.log('✅ Mapped currentUser:', currentUser);
      }
    } catch (error) {
      console.error('❌ Error getting auth state:', error);
    }
  } else {
    console.log('🔓 Login page - skipping user fetch');
  }

  const fetchUserInfo = async () => {
    try {
      const { user, isAuthenticated } = useAuthStore.getState();
      if (user && isAuthenticated) {
        return {
          name: user.name,
          email: user.email,
          userid: user._id,
          access: user.role === 'superadmin' ? 'admin' : user.role,
          role: user.role,
          _id: user._id,
          permissions: user.permissions,
          isActive: user.isActive,
        };
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
    return undefined;
  };

  const result = {
    fetchUserInfo,
    currentUser,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
  
  console.log('✅ getInitialState returning:', { hasCurrentUser: !!currentUser });
  
  return result;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    actionsRender: () => [
      <NotificationIcon key="NotificationIcon" />,
      <SelectLang key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => (
        <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      ),
    },
    onPageChange: () => {
      const { location } = history;
      // Don't redirect if already on login page
      if (location.pathname === loginPath) {
        return;
      }
      
      const { isAuthenticated } = useAuthStore.getState();
      // 如果没有登录，重定向到 login
      if (!isAuthenticated && !initialState?.currentUser) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    // menuHeaderRender: () => (
    //   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
    //     <img src="/logo.png" alt="logo" style={{ height: 32, objectFit: 'contain' }} />
    //   </div>
    // ),
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      // QueryProvider is now in rootContainer, so we don't need it here
      return (
        <>
          {children}
          {isDevOrTest && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: SERVER_URL,
  ...errorConfig,
  // Merge request interceptors
  requestInterceptors: [
    ...(errorConfig.requestInterceptors || []),
    (config: any) => {
      // Ensure baseURL is set
      if (!config.baseURL) {
        config.baseURL = SERVER_URL;
      }
      const fullUrl = `${config.baseURL || SERVER_URL}${config.url || ''}`;
      console.log('📤 API Request:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL || SERVER_URL,
        fullUrl: fullUrl,
        data: config.data ? { ...config.data, password: config.data.password ? '***' : undefined } : undefined,
        headers: config.headers,
      });
      return config;
    },
  ],
  // Merge response interceptors
  responseInterceptors: [
    ...(errorConfig.responseInterceptors || []),
    (response: any) => {
      const fullUrl = `${response.config?.baseURL || SERVER_URL}${response.config?.url || ''}`;
      console.log('📥 API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        url: response.config?.url,
        baseURL: response.config?.baseURL || SERVER_URL,
        fullUrl: fullUrl,
      });
      return response;
    },
  ],
};
