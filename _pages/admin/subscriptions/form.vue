<template>
  <div
      id="pageId"
      class="q-layout-page layout-padding">
    <div class=" q-mb-lg backend-page">
      <div class="row q-col-gutter-md" v-if="success">
        <div class="col-12">
            <q-form autocorrect="off" autocomplete="off" ref="formContent" class="box"
                    @submit="updateItem"
                    @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))">
              <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-7">
                        <dynamic-field :field="dynamicFields.name" v-model="subscriptionData.name" />
                        <dynamic-field :field="dynamicFields.description" v-model="subscriptionData.description" />
                        <dynamic-field :field="dynamicFields.categoryName" v-model="subscriptionData.categoryName" />
                  </div>
                  <div class="col-12 col-md-5">
                        <dynamic-field :field="dynamicFields.startDate" v-model="subscriptionData.startDate" />
                        <dynamic-field :field="dynamicFields.endDate" v-model="subscriptionData.endDate" />
                  </div>
                  <div class="col-12 text-right">
                    <q-btn type="submit" :label="$tr('isite.cms.label.save')" color="green" icon="fa-light fa-save" />
                  </div>
              </div>
            </q-form>
        </div>
        <div class="col-12 relative-position">
          <div class="box">
            <div class="row gutter-y-sm">
              <div class="col-md-12 q-mt-md">
                  <crud v-if="subscriptionId" :crud-data="import('../../../_crud/subscriptionLimits')" :custom-data="{read: {requestParams: {filter: {subscription: subscriptionId} } } }" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>

<script>
import { eventBus } from 'src/plugins/utils'

export default {
  name: "subscriptionsForm",
  data(){
    return{
      subscriptionData: {
        name: '',
        categoryName: '',
        description: '',
        startDate: '',
        endDate: '',
        limits: [],
      },
      subscriptionId: null,
      success: false,
      loading: false,
    }
  },
  computed: {
    dynamicFields() {
      return {
        plan: {
          value: '',
          type: 'crud',
          props: {
            config:{
              options:{
                label: 'name', value: 'id'
              }
            },
            crudType: 'select',
            crudData: import('../../../_crud/plans'),
            clearable: true,
            crudProps:{
              label: this.$tr('iplan.cms.form.plan'),
            }
          }
        },
        name:{
          value: '',
          type: 'input',
          props: {
            readonly: true,
            label: `${this.$tr('isite.cms.form.name')}*`,
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
          }
        },
        categoryName:{
          value: '',
          type: 'input',
          props: {
            readonly: true,
            label: `${this.$tr('iplan.cms.form.category')}*`,
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
          }
        },
        description: {
          value: '',
          type: 'input',
          props: {
            type: 'textarea',
            readonly: true,
            label: `${this.$tr('isite.cms.form.description')}*`,
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
          }
        },
        startDate:{
          value: '',
          type: 'date',
          props: {
            label: `${this.$tr('iplan.cms.form.startDate')}*`,
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
          }
        },
        endDate:{
          value: '',
          type: 'date',
          props: {
            label: `${this.$tr('iplan.cms.form.endDate')}*`,
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
          }
        },
      }
    },
  },
  mounted(){
    eventBus.on('page.data.refresh', () => this.init())//Listen refresh event
    this.init()
  },
  methods:{
    async init(){
      this.loading = true
      this.success = false
      this.locale = this.$clone(this.dataLocale)//Add fields
      this.subscriptionId = this.$route.params.id || null
      await this.getData()
      this.success = true
      this.loading = false
    },
    async getData(){
      return new Promise((resolve, reject) => {
        const subscriptionId = this.$clone(this.subscriptionId)
        if (subscriptionId) {
          let configName = 'apiRoutes.qplan.subscriptions'
          //Params
          let params = {
            refresh: true,
            params: {
              filter: {allTranslations: true},
              include: 'limits'
            }
          }
          //Request
          this.$crud.show(configName, subscriptionId, params).then(response => {
            this.subscriptionData = this.$clone(response.data)
            resolve(true)//Resolve
          }).catch(error => {
            this.$apiResponse.handleError(error, () => {
              this.$alert.error({message: this.$tr('isite.cms.message.errorRequest'), pos: 'bottom'})
              reject(false)//Resolve
            })
          })
        }else{
          resolve(true)
        }
      })
    },
    updateItem(){
      return new Promise((resolve, reject) => {
        const subscriptionId = this.$clone(this.subscriptionId)
        if (subscriptionId) {
          this.loading = true
          let configName = 'apiRoutes.qplan.subscriptions'
          //Request
          this.$crud.update(configName, subscriptionId, this.subscriptionData).then(response => {
            this.$alert.success({message: `${this.$tr('isite.cms.message.recordUpdated')}`})
            this.loading = false
            this.init()
            resolve(true)//Resolve
          }).catch(error => {
            this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated'), pos: 'bottom'})
            this.loading = false
            reject(false)//Resolve
          })
        }else{
          resolve(true)
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
