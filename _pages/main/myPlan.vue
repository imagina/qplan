<template>
  <div id="mySubscriptionsPage">
    <!--content-->
    <div id="content" class="relative-position">
      <!--pages actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions :title="$tr($route.meta.title)" @refresh="getData(true)" />
      </div>
      <!--Other Plans-->
      <div id="otherPlans" class="box box-auto-height" v-if="subscription">
        <div class="row q-col-gutter-md">
          <div v-for="(subscription, keyPlan) in [subscription]" :key="keyPlan" class="col-12 col-md-4">
            <div class="plan-card">
              <!--Name-->
              <div class="plan-card__name">{{ subscription.plan.name }}</div>
              <!--Description-->
              <div class="plan-card__description" v-html="subscription.plan.description" />
              <q-separator inset />
              <!--Bottom content-->
              <div class="plan-card__bottom row justify-between items-center">
                <div class="full-width">
                  <!--Price-->
                  <div class="plan-card__price" v-if="false"><b>{{ subscription.plan.priceFormat }}</b></div>
                  <!--Time-->
                  <div class="plan-card__price text-caption text-center">{{ subscription.plan.frequency }}</div>
                  <!--Status-->
                  <div class="plan-card__price text-caption row justify-between full-width">
                    <div>{{$tr('isite.cms.form.status')}}:</div>
                    <div>{{ subscription.statusName}}</div>
                  </div>
                  <!--Start Date-->
                  <div class="plan-card__price text-caption row justify-between full-width">
                    <div>{{$tr('isite.cms.form.startDate')}}:</div>
                    <div>{{ $trd(subscription.startDate) }}</div>
                  </div>
                  <!-- end Date-->
                  <div class="plan-card__price text-caption row justify-between full-width">
                    <div>{{$tr('isite.cms.form.endDate')}}:</div>
                    <div>{{ $trd(subscription.endDate) }}</div>
                  </div>
                </div>
                <!--Activate-->
                <div v-if="false">
                  <!--Current message-->
                  <div v-if="plan.current" class="plan-card__label-current bg-green text-white q-pa-sm">
                    ¡{{ $tr('isite.cms.label.currentPlan') }}!
                  </div>
                  <!--btn actions-->
                  <q-btn v-else :label="$tr('isite.cms.label.select')" rounded color="green"
                         unelevated outline no-caps size="12px" @click="buySubscription(plan)" />
                </div>
              </div>
              <!-- Cancel -->
              <div v-if="subscription.urlToCancel" @click="cancelSubscription(subscription.plan)"
                   class="text-center text-red-6 q-py-sm tw-cursor-pointer">
                <q-separator inset />
                {{ $tr('iplan.cms.cancelSubscription') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Empty plans-->
      <div v-else-if="!loading" class="box row items-center justify-center">
        <not-result />
      </div>
      <!--inner loading-->
      <inner-loading :visible="loading" />
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  data() {
    return {
      loading: false,
      subscription: null,
      plans: []
    };
  },
  computed: {
    plansData() {
      let plans = this.$clone(this.plans);
      let subscription = this.$clone(this.subscription);

      //Map plans
      plans = plans.map(plan => {
        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.product?.price || 0,
          priceFormat: plan.priceFormat,
          frequency: plan.frequency
        };
      });

      //Order by price
      plans.sort(function(a, b) {
        if (a.price > b.price) return 1;
        if (a.price < b.price) return -1;
        return 0;
      });

      //set current plan at first
      if (subscription && subscription.planId) {
        this.$clone(plans).forEach((plan, index) => {
          if (parseInt(plan.id) == parseInt(subscription.planId)) {
            plans.unshift({
              ...plans.splice(index, 1)[0],
              current: true,
              urlToCancel: subscription.urlToCancel ?? null
            });
          }
        });
      }

      //Response
      return plans;
    }
  },
  methods: {
    init() {
      this.getData();
    },
    //Get data
    async getData(refresh = false) {
      this.loading = true;
      await Promise.all([
        this.getSubscription(refresh)
        //this.getPlans(refresh)
      ]);
      this.loading = false;
    },
    //Get data
    getSubscription(refresh = false) {
      return new Promise((resolve, reject) => {
        //get user id
        let userId = this.$store.state.quserAuth.userId;
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            include: 'plan',
            filter: {
              field: 'entity_id',
              entity: 'Modules\\User\\Entities\\Sentinel\\User'
            }
          }
        };
        //Request
        this.$crud.show('apiRoutes.qplan.subscriptions', userId, requestParams).then(response => {
          this.subscription = response.data;
          resolve(response.data);
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            resolve(error);
          });
        });
      });
    },
    //Get data
    getPlans(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: { include: 'product' }
        };
        //Request
        this.$crud.index('apiRoutes.qplan.plans', requestParams).then(response => {
          this.plans = response.data;
          resolve(response.data);
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            resolve(error);
          });
        });
      });
    },
    //Create subcription
    buySubscription(plan) {
      this.$alert.warning({
        mode: 'modal',
        title: this.$tr('iplan.cms.buyPlan') + plan.name,
        message: plan.description,
        actions: [
          { label: this.$tr('isite.cms.label.cancel'), color: 'grey' },
          {
            label: this.$tr('isite.cms.label.yes'),
            color: 'green',
            handler: () => {
              this.loading = true;
              //Request data
              let requestData = { planId: plan.id };
              //Request
              this.$crud.create('apiRoutes.qplan.buy', requestData).then(response => {
                this.$alert.info({ message: `${this.$tr('isite.cms.message.recordCreated')}` });
                this.getData(true);
                //Rediret to
                if (response.data && response.data.redirectTo) {
                  this.$helper.openExternalURL(response.data.redirectTo, true);
                }
                this.loading = false;
              }).catch(error => {
                this.$alert.error({ message: `${this.$tr('isite.cms.message.recordNoCreated')}` });
                this.loading = false;
              });
            }
          }
        ]
      });
    },
    //Cancel suscription
    //Create subcription
    cancelSubscription(plan) {
      this.$alert.error({
        mode: 'modal',
        title: this.$tr('iplan.cms.cancelSubscription'),
        message: `<span class="text-bold text-blue-grey">${plan.name}</span><br>${plan.description}`,
        actions: [
          { label: this.$tr('isite.cms.label.cancel'), color: 'grey' },
          {
            label: this.$tr('isite.cms.label.yes'),
            color: 'green',
            handler: () => {
              this.loading = true;
              //Request
              this.$crud.post(this.subscription.urlToCancel).then(response => {
                this.loading = false;
              }).catch(error => {
                this.loading = false;
              });
            }
          }
        ]
      });
    }
  }
};
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
