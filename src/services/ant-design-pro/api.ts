// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/v1/admin/auth/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  const loginData = {
    email: body.email,
    password: body.password,
  };
  
  console.log('🔐 Login service called:', {
    endpoint: '/api/v1/admin/auth/login',
    data: { ...loginData, password: '***' }, // Don't log password
  });
  
  return request<API.LoginResult>('/api/v1/admin/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: loginData,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

/** 获取分类树 GET /api/v1/admin/categories/tree */
export async function getCategoryTree(
  params: {
    platform?: string;
    status?: 'all' | 'active' | 'inactive';
    name?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.CategoryTreeResult>('/api/v1/admin/categories/tree', {
    method: 'GET',
    params: {
      platform: params.platform || '1688',
      status: params.status || 'all',
      ...(params.name ? { name: params.name } : {}),
    },
    ...(options || {}),
  });
}

/** 更新分类 PUT /api/v1/admin/categories/:id */
export async function updateCategory(
  id: string,
  body: {
    isActive?: boolean;
    imageUrl?: string | null;
    name?: {
      zh?: string;
      en?: string;
      ko?: string;
    };
  },
  options?: { [key: string]: any },
) {
  return request<API.CategoryResponse>(`/api/v1/admin/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新分类状态 PUT /api/v1/admin/categories/:id (isActive only) */
export async function updateCategoryStatus(
  id: string,
  isActive: boolean,
  options?: { [key: string]: any },
) {
  return request<API.CategoryResponse>(`/api/v1/admin/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { isActive },
    ...(options || {}),
  });
}

/** 更新分类图片 PUT /api/v1/admin/categories/:id (imageUrl only) */
export async function updateCategoryImage(
  id: string,
  imageUrl: string | null,
  options?: { [key: string]: any },
) {
  return request<API.CategoryResponse>(`/api/v1/admin/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { imageUrl },
    ...(options || {}),
  });
}

/** 更新分类名称 PUT /api/v1/admin/categories/:id (name only) */
export async function updateCategoryName(
  id: string,
  name: {
    zh?: string;
    en?: string;
    ko?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.CategoryResponse>(`/api/v1/admin/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { name },
    ...(options || {}),
  });
}
