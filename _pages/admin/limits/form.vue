<template>
  <div id="pageId" class="q-layout-page layout-padding">
    <div class="relative-position q-mb-lg backend-page">
      <div class="box" v-if="success">
        <div class="col-12">
          <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
        </div>
        <!--Form-->
        <q-form autocorrect="off" autocomplete="off" ref="formContent" class="full-width q-my-sm" v-if="locale.success"
                @submit="itemId?updateItem():createItem()" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input outlined dense v-model="locale.formTemplate.name"
                       :label="`${$tr('ui.form.name')}`"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
            </div>
            <div class="col-12 col-sm-6">
              <dynamic-field :field="dynamicFields.entity" v-model="locale.formTemplate.entity" @input="selectAttrs" />
            </div>
            <div class="col-12 col-sm-6">
              <q-select outlined dense v-model="locale.formTemplate.attribute"
                       :label="`${$tr('qplan.layout.form.attribute')}`"
                       emit-value map-options
                       :options="selectedEntityAttrs" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input outlined dense v-model="locale.formTemplate.attributeValue"
                       :label="`${$tr('qplan.layout.form.attributeValue')}`" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input outlined dense v-model="locale.formTemplate.quantity"
                       :label="`${$tr('ui.form.quantity')}`"
                       type="number"
                       min="1"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
            </div>
          </div>
          <q-page-sticky
                  position="bottom-right"
                  :offset="[18, 18]">
            <!--Update button-->
            <q-btn v-if="$route.params.id" color="positive" :loading="loading"
                   icon="fas fa-edit" :label="$tr('ui.label.update')" type="submit"/>
            <!--Save button-->
            <q-btn v-else color="positive" :loading="loading" icon="fas fa-edit"
                   :label="$tr('ui.label.create')" type="submit"/>
          </q-page-sticky>
        </q-form>
      </div>
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'limitForm',
    watch: {
      $route(to, from) {
        this.initForm()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.initForm()
      })
    },
    data() {
      return {
        locale: {},
        loading: false,
        success: false,
        itemId: false,
        entities: [],
        selectedEntityAttrs: [],
      }
    },
    props:{
      id:{
        default: null
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            name: '',
            entity: '',
            quantity: '1',
            attribute: '',
            attributeValue: '',
          },
        }
      },
      dynamicFields(){
        return {
          entity:{
            value: '',
            type: 'select',
            loadOptions: {
              apiRoute: 'apiRoutes.qplan.limitEntities',
              select: {label: 'name', id: 'entity'}
            },
            props: {
              label: this.$tr('qplan.layout.form.entity'),
              clearable: false,
            }
          }
        }
      }
    },
    methods: {
      async initForm() {
        this.loading = true
        this.success = false
        this.locale = this.$clone(this.dataLocale)
        this.itemId = this.id !==null?this.id:this.$route.params.id
        if (this.locale.success) this.$refs.localeComponent.vReset()
        await this.getEntities()
        await this.getData()
        setTimeout(()=> {this.selectAttrs()},500)
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qplan.limits'
            //Params
            let params = {
              refresh: true,
              params: {
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.show(configName, itemId, params).then(response => {
              this.orderDataItemToLocale(response.data)
              resolve(true)//Resolve
            }).catch(error => {
              this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
              console.error(error)
              this.loading = false
              reject(false)//Resolve
            })
          } else {
            resolve(true)//Resolve
          }
        })
      },
      getEntities(){
        return new Promise((resolve, reject) => {
            let configName = 'apiRoutes.qplan.limitEntities'
            //Params
            let params = {
              refresh: true,
              params: {
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.index(configName, params).then(response => {
              this.entities = response.data
              resolve(true)//Resolve
            }).catch(error => {
              this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
              reject(false)//Resolve
            })
        })
      },
      selectAttrs(){
        if(this.locale.formTemplate.entity != ''){
          let selectedEnt = this.$array.findByTag(this.entities,'entity',this.locale.formTemplate.entity)
          this.selectedEntityAttrs = selectedEnt.attributes
        }
      },
      orderDataItemToLocale(data) {
        let orderData = this.$clone(data)
        this.locale.form = this.$clone(orderData)
      },
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qplan.limits'
          this.$crud.update(configName, this.itemId, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            //this.initForm()
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
      async createItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qplan.limits'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')}`})
            this.$router.push({name: 'qplan.admin.limits.index'})
            //this.initForm()
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
      getDataForm() {
        let response = this.locale.form
        for (var item in response) {
          let valueItem = response[item]
          if (valueItem == null || valueItem == undefined)
            delete response[item]
        }
        //response.selectable = JSON.stringify(response.selectable)
        return response
      },
    }
  }
</script>

<style scoped>

</style>
