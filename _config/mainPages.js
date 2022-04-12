export default {
  userSubscriptions: {
    permission: 'iplan.plans.ownPlans',
    activated: true,
    path: '/plans/me',
    name: 'qplan.admin.my.plans',
    page: () => import('@imagina/qplan/_pages/main/myPlan'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'iplan.cms.sidebar.adminSubscriptions',
    icon: 'fas fa-window-restore',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  }
}
