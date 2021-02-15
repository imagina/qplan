const moduleName = 'iplan';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  categories: `${urlBase}/categories`,
  plans: `${urlBase}/plans`,
  limits: `${urlBase}/limits`,
  limitEntities: `${urlBase}/limits/entities`,
  subscriptions: `${urlBase}/subscriptions`,
  subscriptionLimits: `${urlBase}/subscription-limits`,
}
