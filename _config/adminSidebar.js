const pages = config('pages') // Get Pages from config

//E-commerce
export default [
  {
    title: 'iplan.cms.sidebar.adminGroup',
    icon: 'fas fa-window-restore',
    children: [
      pages.qplan.plans,
      pages.qplan.limits,
      pages.qplan.categories,
      pages.qplan.entityPlans,
      pages.qplan.subscriptions,
      pages.mainqplan.userSubscriptions
    ]
  }
]
