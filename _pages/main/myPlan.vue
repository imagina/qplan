<template>
  <div id="mySubscriptionsPage">
    <!--content-->
    <div id="content" class="relative-position">
      <!--pages actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions :title="$tr($route.meta.title)" @refresh="getData(true)"/>
      </div>
      <!--Other Plans-->
      <div id="otherPlans" class="box box-auto-height" v-if="plans.length">
        <div class="row q-col-gutter-md">
          <div v-for="(plan, keyPlan) in plansData" :key="keyPlan" class="col-12 col-md-4">
            <div class="plan-card">
              <!--Name-->
              <div class="plan-card__name">{{ plan.name }}</div>
              <!--Description-->
              <div class="plan-card__description" v-html="plan.description"/>
              <q-separator inset/>
              <!--Bottom content-->
              <div class="plan-card__bottom row justify-between items-center">
                <div>
                  <!--Price-->
                  <div class="plan-card__price"><b>{{ plan.priceFormat }}</b></div>
                  <!--Time-->
                  <div class="plan-card__price text-caption">{{ plan.frequency }}</div>
                </div>
                <!--Activate-->
                <div>
                  <!--Current message-->
                  <div v-if="plan.current" class="plan-card__label-current bg-green text-white q-pa-sm">
                    ¡{{ $tr('isite.cms.label.currentPlan') }}!
                  </div>
                  <!--btn actions-->
                  <q-btn v-else :label="$tr('isite.cms.label.select')" rounded color="green"
                         unelevated outline no-caps size="12px" @click="buySubscription(plan)"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Empty plans-->
      <div v-else-if="!loading" class="box row items-center justify-center">
        <not-result/>
      </div>
      <!--inner loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      subscription: null,
      plans: []
    }
  },
  computed: {
    plansData() {
      let plans = this.$clone(this.plans)
      let subscription = this.$clone(this.subscription)

      //Map plans
      plans = plans.map(plan => {
        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.product?.price || 0,
          priceFormat: plan.priceFormat,
          frequency: plan.frequency
        }
      })

      //Order by price
      plans.sort(function (a, b) {
        if (a.price > b.price) return 1
        if (a.price < b.price) return -1
        return 0;
      });

      //set current plan at first
      if (subscription && subscription.planId) {
        this.$clone(plans).forEach((plan, index) => {
          if (parseInt(plan.id) == parseInt(subscription.planId)) {
            plans.unshift({...plans.splice(index, 1)[0], current: true})
          }
        })
      }

      //Response
      return plans
    }
  },
  methods: {
    init() {
      this.getData()
    },
    //Get data
    async getData(refresh = false) {
      this.loading = true
      await Promise.all([
        this.getSubscription(refresh),
        this.getPlans(refresh)
      ])
      this.loading = false
    },
    //Get data
    getSubscription(refresh = false) {
      return new Promise((resolve, reject) => {
        //get user id
        let userId = this.$store.state.quserAuth.userId
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            filter: {
              field: 'entity_id',
              entity: "Modules\\User\\Entities\\Sentinel\\User"
            }
          }
        }
        //Request
        this.$crud.show('apiRoutes.qplan.subscriptions', userId, requestParams).then(response => {
          this.subscription = response.data
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            resolve(error)
          })
        })
      })
    },
    //Get data
    getPlans(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {include: 'product'}
        }
        //Request
        this.$crud.index('apiRoutes.qplan.plans', requestParams).then(response => {
          this.plans = response.data
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            resolve(error)
          })
        })
      })
    },
    //Create subcription
    buySubscription(plan) {
      return new Promise(resolve => {
        this.loading = true
        //Request data
        let requestData = {planId: plan.id}
        //Request
        this.$crud.create('apiRoutes.qplan.buy', requestData).then(response => {
          this.$alert.info({message: `${this.$tr('isite.cms.message.recordCreated')}`})
          this.getData(true)
          //Rediret to
          if (response.data && response.data.redirectTo) {
            this.$helper.openExternalURL(response.data.redirectTo, true)
          }
          this.loading = false
          resolve(response.data)
        }).catch(error => {
          this.$alert.error({message: `${this.$tr('isite.cms.message.recordNoCreated')}`})
          this.loading = false
          resolve(error)
        })
      })
    }
  }
}
</script>
<style lang="scss">
#mySubscriptionsPage {
  .plan-card {
    border: 2px solid $info;
    border-radius: $custom-radius;
    overflow: hidden;
    color: $blue-grey;

    &__name {
      background-color: $info;
      padding: 15px;
      font-size: 20px;
      color: white;
      font-weight: bold;
    }

    &__description {
      padding: 14px 10px;
      line-height: 1;

      p {
        margin: 0;
      }
    }

    &__bottom {
      line-height: 1;
      padding: 10px;
    }

    &__label-current {
      border-radius: $custom-radius;
    }
  }
}
</style>
