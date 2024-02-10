export default {
  userSubscriptions: {
    permission: 'iplan.plans.ownPlans',
    activated: true,
    path: '/plans/me',
    name: 'qplan.admin.my.plans',
    page: () => import('modules/qplan/_pages/main/myPlan'),
    layout: () => import('layouts/master.vue'),
    title: 'iplan.cms.sidebar.adminMySubscriptions',
    icon: 'fa-light fa-file-invoice-dollar',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  }
}
