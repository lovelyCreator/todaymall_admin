// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    role?: string;
    _id?: string;
    permissions?: string[];
    isActive?: boolean;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    statusCode?: number;
    message?: string;
    data?: {
      admin?: {
        _id?: string;
        email?: string;
        name?: string;
        role?: string;
        permissions?: string[];
        isActive?: boolean;
        createdAt?: string;
        updatedAt?: string;
        lastLogin?: string;
      };
      token?: string;
    };
    timestamp?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    email?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  // Admin Management Types
  type Admin = {
    _id?: string;
    email?: string;
    name?: string;
    role?: string;
    permissions?: string[];
    isActive?: boolean;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    lastLogin?: string;
  };

  type AdminListParams = {
    current?: number;
    pageSize?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
  };

  type AdminListResponse = {
    status?: string;
    statusCode?: number;
    message?: string;
    data?: {
      admins?: Admin[];
      total?: number;
      current?: number;
      pageSize?: number;
    };
    timestamp?: string;
  };

  type AdminResponse = {
    status?: string;
    statusCode?: number;
    message?: string;
    data?: {
      admin?: Admin;
    };
    timestamp?: string;
  };

  type UpdateAdminParams = {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
    permissions?: string[];
    isActive?: boolean;
  };

  type CreateAdminParams = {
    email: string;
    password: string;
    name: string;
    role: string;
    permissions?: string[];
    isActive?: boolean;
  };

  // Category Management Types
  type CategoryName = {
    zh?: string;
    en?: string;
    ko?: string;
  };

  type CategoryMetadata = {
    parentCateId?: string;
    lastFetched?: string;
  };

  type Category = {
    _id?: string;
    platform?: string;
    externalId?: string;
    parentId?: string | null;
    name?: CategoryName;
    level?: number;
    path?: string;
    isLeaf?: boolean;
    isActive?: boolean;
    imageUrl?: string | null;
    metadata?: CategoryMetadata;
    lastSyncedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    children?: Category[];
  };

  type CategoryTreeResult = {
    status?: string;
    statusCode?: number;
    message?: string;
    data?: {
      tree?: Category[];
      platform?: string;
      totalCategories?: number;
    };
    timestamp?: string;
  };

  type CategoryResponse = {
    status?: string;
    statusCode?: number;
    message?: string;
    errorCode?: string;
    data?: {
      category?: Category;
    };
    timestamp?: string;
  };
}
