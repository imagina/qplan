const pages = config('pages') // Get Pages from config

//E-commerce
export default [
  {
    title: 'qplan.sidebar.adminGroup',
    icon: 'fas fa-ticket-alt',
    children: [
      pages.qplan.categories,
      pages.qplan.plans,
      pages.qplan.limits,
      pages.qplan.subscriptions,
      pages.qplan.subscriptionLimits,
    ]
  }
]
