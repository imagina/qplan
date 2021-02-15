export default {
  categories: {
    permission: 'iplan.categories.manage',
    activated: true,
    path: '/categories',
    name: 'qplan.admin.categories.index',
    crud: import('../_crud/planCategories'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplan.sidebar.adminCategories',
    icon: 'fas fa-ticket-alt',
    authenticated: true,
    subHeader:{
      refresh: true,
    }
  },
  plans: {
    permission: 'iplan.plans.manage',
    activated: true,
    path: '/plans',
    name: 'qplan.admin.plans.index',
    crud: import('../_crud/plans'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplan.sidebar.adminPlans',
    icon: 'fas fa-ticket-alt',
    authenticated: true,
    subHeader:{
      refresh: true,
    }
  },
  limits: {
    permission: 'iplan.limits.manage',
    activated: true,
    path: '/limits',
    name: 'qplan.admin.limits.index',
    crud: import('../_crud/limits'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplan.sidebar.adminLimits',
    icon: 'fas fa-ticket-alt',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
  limitsCreate: {
    permission: 'iplan.limits.create',
    activated: true,
    path: '/limits/create',
    name: 'qplan.admin.limits.create',
    page: () => import('../_pages/admin/limits/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplan.sidebar.createLimits',
    icon: 'fas fa-ticket-alt',
    authenticated: true,
    subHeader: {
      refresh: true,
      breadcrumb: ['qplan.limits']
    }
  },
  limitsEdit: {
    permission: 'iplan.limits.edit',
    activated: true,
    path: '/limits/:id',
    name: 'qplan.admin.limits.edit',
    page: () => import('../_pages/admin/limits/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplan.sidebar.editLimits',
    icon: 'fas fa-ticket-alt',
    authenticated: true,
    subHeader: {
      refresh: true,
      breadcrumb: ['qplan.limits']
    }
  },
  subscriptions: {
    permission: 'iplan.subscriptions.manage',
    activated: true,
    path: '/subscriptions',
    name: 'qplan.admin.subscriptions.index',
    crud: import('../_crud/subscriptions'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplan.sidebar.adminSubscriptions',
    icon: 'fas fa-ticket-alt',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
  subscriptionLimits: {
    permission: 'iplan.subscriptionlimits.manage',
    activated: true,
    path: '/subscriptionLimits',
    name: 'qplan.admin.subscriptionLimits.index',
    crud: import('../_crud/subscriptionLimits'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qplan.sidebar.adminSubscriptionLimits',
    icon: 'fas fa-ticket-alt',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
}
