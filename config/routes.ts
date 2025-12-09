// ============================================
// Routes Configuration
// Case 1: Simple pages (default)
// Case 2: Detailed pages (commented out)
// ============================================

// config/routes.ts
export default [
  // 로그인 관련 (layout false)
  {
    path: '/user',
    layout: false,
    routes: [
      { name: 'login', path: '/user/login', component: './user/login' },
    ],
  },

  // ===== 메인 대시보드 =====
  {
    path: '/home',
    name: 'home',
    icon: 'home',
    component: './Home',
    access: 'canViewDashboard',
  },

  // ===== 상품 관리 =====
  {
    path: '/products',
    name: 'products',
    icon: 'shopping',
    access: 'canManageProducts',
    routes: [
      { path: '/products', redirect: '/products/list' },
      {
        name: 'list',
        path: '/products/list',
        component: './products/List',
        access: 'canViewProducts',
      },
      {
        name: 'add',
        path: '/products/add',
        component: './products/Add',
        access: 'canCreateProduct',
      },
      {
        name: 'categories',
        path: '/products/category',
        component: './products/CategoryManagement',
        access: 'canManageProducts',
      },
      {
        name: 'import-taobao',
        path: '/products/import-taobao',
        component: './products/ImportTaobao',
        access: 'canImportTaobao',
      },
      {
        hideInMenu: true,
        path: '/products/edit/:id',
        component: './products/Edit',
      },
    ],
  },

  // ===== 주문 관리 =====
  {
    path: '/orders',
    name: 'orders',
    icon: 'profile',
    access: 'canManageOrders',
    routes: [
      { path: '/orders', redirect: '/orders/user' },
      {
        name: 'user',
        path: '/orders/user',
        component: './orders/UserOrders',
      },
      {
        name: 'business',
        path: '/orders/business',
        component: './orders/BusinessOrders',
      },
      {
        name: 'vvic',
        path: '/orders/vvic-highpass',
        component: './orders/VVICHighPassOrders',
      },
      {
        name: 'rocket',
        path: '/orders/rocket',
        component: './orders/RocketOrders',
      },
      {
        hideInMenu: true,
        path: '/orders/detail/:orderNo',
        component: './orders/OrderDetail',
      },
      {
        hideInMenu: true,
        path: '/orders/all',
        component: './orders/All',
      },
      {
        name: 'pending-payment',
        path: '/orders/pending-payment',
        component: './orders/PendingPayment',
      },
      {
        name: 'pending-address',
        path: '/orders/pending-address',
        component: './orders/PendingAddress',
      },
      {
        name: 'in-china-warehouse',
        path: '/orders/in-china-warehouse',
        component: './orders/InChinaWarehouse',
      },
      // Case 1: 간단한 페이지들
      // {
      //   name: 'in-korea-delivery',
      //   path: '/orders/in-korea-delivery',
      //   component: './orders/InKoreaDeliverySimple',
      // },
      // {
      //   name: 'completed',
      //   path: '/orders/completed',
      //   component: './orders/CompletedSimple',
      // },
      // {
      //   name: 'no-data',
      //   path: '/orders/no-data',
      //   component: './orders/NoDataSimple',
      // },
      // {
      //   name: 'questions',
      //   path: '/orders/questions',
      //   component: './orders/OrderQuestionsSimple',
      // },
      // {
      //   name: 'inventory-questions',
      //   path: '/orders/inventory-questions',
      //   component: './orders/InventoryQuestionsSimple',
      // },
      // Case 2: 상세한 페이지들 (필요시 주석 해제)
      {
        name: 'in-korea-delivery',
        path: '/orders/in-korea-delivery-detailed',
        component: './orders/InKoreaDelivery',
      },
      {
        name: 'completed',
        path: '/orders/completed-detailed',
        component: './orders/Completed',
      },
      {
        name: 'no-data',
        path: '/orders/no-data-detailed',
        component: './orders/NoData',
      },
      {
        name: 'questions',
        path: '/orders/questions-detailed',
        component: './orders/OrderQuestions',
      },
      {
        name: 'inventory-questions',
        path: '/orders/inventory-questions-detailed',
        component: './orders/InventoryQuestions',
      },
    ],
  },

  // ===== 물류/배송 관리 =====
  {
    path: '/logistics',
    name: 'logistics',
    icon: 'car',
    access: 'canManageLogistics',
    routes: [
      // Case 1: 간단한 페이지들
      {
        name: 'batch-tracking',
        path: '/logistics/batch-tracking',
        component: './logistics/BatchTrackingSimple',
      },
      {
        name: 'forwarders',
        path: '/logistics/forwarders',
        component: './logistics/ForwardersSimple',
      },
      {
        name: 'rack',
        path: '/logistics/rack',
        component: './logistics/RackManagementSimple',
      },
      // Case 2: 상세한 페이지들 (필요시 주석 해제)
      // {
      //   name: '운송장 일괄등록',
      //   path: '/logistics/batch-tracking',
      //   component: './logistics/BatchTracking',
      // },
      // {
      //   name: '배대지 관리',
      //   path: '/logistics/forwarders',
      //   component: './logistics/Forwarders',
      // },
      // {
      //   name: '랙 관리',
      //   path: '/logistics/rack',
      //   component: './logistics/RackManagement',
      // },
    ],
  },

  // ===== 회원 관리 =====
  {
    path: '/members',
    name: 'members',
    icon: 'team',
    access: 'canManageMembers',
    routes: [
      { name: 'list', path: '/members/list', component: './members/List' },
      {
        name: 'general',
        path: '/members/general',
        component: './members/GeneralMembers',
      },
      {
        name: 'business',
        path: '/members/business',
        component: './members/BusinessMembers',
      },
      // Case 1: 간단한 포인트/쿠폰 페이지
      // {
      //   name: 'points',
      //   path: '/members/points',
      //   component: './members/PointsSimple',
      // },
      // {
      //   name: 'coupons',
      //   path: '/members/coupons',
      //   component: './members/CouponsSimple',
      // },
      // {
      //   name: 'depositApplication',
      //   path: '/members/deposit-application',
      //   component: './members/DepositApplication',
      // },
      // {
      //   name: 'depositUsage',
      //   path: '/members/deposit-usage',
      //   component: './members/DepositUsage',
      // },
      // {
      //   name: 'bankbookVerification',
      //   path: '/members/bankbook-verification',
      //   component: './members/BankbookVerification',
      // },
      // {
      //   name: 'forexDepositApplication',
      //   path: '/members/forex-deposit-application',
      //   component: './members/ForexDepositApplication',
      // },
      // {
      //   name: 'forexDepositUsage',
      //   path: '/members/forex-deposit-usage',
      //   component: './members/ForexDepositUsage',
      // },
      // {
      //   name: 'forexDepositPayment',
      //   path: '/members/forex-deposit-payment',
      //   component: './members/ForexDepositPayment',
      // },
      // Case 2: 상세한 포인트/쿠폰 페이지 (필요시 주석 해제)
      {
        name: 'points',
        path: '/members/points-detailed',
        component: './members/Points',
      },
      {
        name: 'coupons',
        path: '/members/coupons-detailed',
        component: './members/Coupons',
      },
      {
        name: 'depositApplication',
        path: '/members/deposit-application-detailed',
        component: './members/DepositApplicationDetailed',
      },
      {
        name: 'depositUsage',
        path: '/members/deposit-usage-detailed',
        component: './members/DepositUsageDetailed',
      },
      {
        name: 'bankbookVerification',
        path: '/members/bankbook-verification-detailed',
        component: './members/BankbookVerificationDetailed',
      },
      {
        name: 'forexDepositApplication',
        path: '/members/forex-deposit-application-detailed',
        component: './members/ForexDepositApplicationDetailed',
      },
      {
        name: 'forexDepositUsage',
        path: '/members/forex-deposit-usage-detailed',
        component: './members/ForexDepositUsageDetailed',
      },
      {
        name: 'forexDepositPayment',
        path: '/members/forex-deposit-payment-detailed',
        component: './members/ForexDepositPaymentDetailed',
      },
    ],
  },

  // ===== 정산 관리 =====
  {
    path: '/settlement',
    name: 'settlement',
    icon: 'accountBook',
    access: 'canManageSettlement',
    routes: [
      // Case 1: 간단한 통합 정산 관리
      {
        name: 'management',
        path: '/settlement/management',
        component: './settlement/Management',
      },
      // Case 2: 상세한 정산 페이지들 (필요시 주석 해제)
      // {
      //   name: '판매자 정산',
      //   path: '/settlement/sellers',
      //   component: './settlement/Sellers',
      // },
      // {
      //   name: '플랫폼 수수료',
      //   path: '/settlement/platform',
      //   component: './settlement/Platform',
      // },
    ],
  },

  // ===== 게시판 관리 =====
  {
    path: '/cs',
    name: 'cs',
    icon: 'customerService',
    access: 'canManageCS',
    routes: [
      // Case 1: 간단한 페이지들
      {
        name: 'inquiries',
        path: '/cs/inquiries',
        component: './cs/InquiriesSimple',
      },
      { name: 'notices', path: '/cs/notices', component: './cs/Notices' },
      { name: 'faq', path: '/cs/faq', component: './cs/FAQ' },
      {
        name: 'help',
        path: '/cs/help',
        component: './cs/HelpCenterSimple',
      },
      {
        name: 'banners',
        path: '/cs/banners',
        component: './system/BannersSimple',
      },
      {
        name: 'looking-for-owner',
        path: '/cs/looking-for-owner',
        component: './cs/LookingForOwner',
      },
      // Case 2: 상세한 페이지들 (필요시 주석 해제)
      // { name: '1:1 문의 (상세)', path: '/cs/inquiries-detailed', component: './cs/Inquiries' },
      // { name: '헬프센터 (상세)', path: '/cs/help-detailed', component: './cs/HelpCenter' },
    ],
  },

  // ===== 시스템 관리 (최고관리자만) =====
  {
    path: '/system',
    name: 'system',
    icon: 'setting',
    access: 'isSuperAdmin',
    routes: [
      // Case 1: 간단한 페이지들
      {
        name: 'admins',
        path: '/system/admins',
        component: './system/AdminsSimple',
      },
      {
        name: 'roles',
        path: '/system/roles',
        component: './system/RolesSimple',
      },
      {
        name: 'rates',
        path: '/system/rates',
        component: './system/RatesSimple',
      },
      // Case 1에서는 광고/게시글 관리 숨김
      // Case 2: 상세한 페이지들 (필요시 주석 해제)
      // {
      //   name: '관리자 계정 (상세)',
      //   path: '/system/admins-detailed',
      //   component: './system/Administrators',
      // },
      // {
      //   name: '권한 관리 (상세)',
      //   path: '/system/roles-detailed',
      //   component: './system/Roles',
      // },
      // {
      //   name: '환율/관세 설정 (상세)',
      //   path: '/system/rates-detailed',
      //   component: './system/Rates',
      // },
      // {
      //   name: '배너/이벤트 (상세)',
      //   path: '/system/banners-detailed',
      //   component: './system/Banners',
      // },
      // {
      //   name: '광고 관리',
      //   path: '/system/advertise',
      //   component: './system/AdvertiseManagement',
      // },
      // {
      //   name: '게시글 관리',
      //   path: '/system/articles',
      //   component: './system/ArticleManagement',
      // },
    ],
  },

  // Test route (temporary)
  {
    path: '/test-menu',
    component: './test-menu-i18n',
    layout: false,
  },

  // 루트 리다이렉트 & 404
  { path: '/', redirect: '/home' },
  { path: '*', layout: false, component: './404' },
];
