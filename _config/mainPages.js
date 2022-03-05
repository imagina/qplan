export default {
  userSubscriptions: {
    permission: 'iplan.plans.manage',
    activated: true,
    path: '/plans',
    name: 'qplan.admin.plans.index',
    page: () => import('@imagina/qplan/_pages/main/myPlan'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'iplan.cms.sidebar.adminUserSubscriptions',
    icon: 'fas fa-window-restore',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  }
}
