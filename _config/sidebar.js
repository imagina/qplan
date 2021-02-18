const pages = config('pages') // Get Pages from config

//E-commerce
export default [
  {
    title: 'qplan.sidebar.adminGroup',
    icon: 'fas fa-money-check-alt',
    children: [
      pages.qplan.subscriptions,
      pages.qplan.plans,
      pages.qplan.entityPlans,
      pages.qplan.limits,
      pages.qplan.categories,
    ]
  }
]
