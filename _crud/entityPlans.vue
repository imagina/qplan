<template></template>

<script>
  export default {
    data() {
      return {
        crudId: this.$uid(),
        planModules: [],
      }
    },
    computed: {
      crudData() {
        return {
          crudId: this.crudId,
          entityName: config("main.qplan.entityNames.entityPlan"),
          apiRoute: 'apiRoutes.qplan.entityPlans',
          permission: 'iplan.entityplans',
          extraFormFields: 'Iplan.crud-fields.entityPlans',
          create: {
            title: this.$tr('iplan.cms.newEntityPlan'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'module', label: this.$tr('iplan.cms.form.module'), field: 'module'},
              {name: 'entityName', label: this.$tr('iplan.cms.form.entity'), field: 'entityName'},
              {
                name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status'
              },
              {
                name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
            ],
            requestParams: {
              filter: {
                order: {
                  field: 'created_at',
                  way: 'desc',
                },
              },
            },
          },
          update: {
            title: this.$tr('iplan.cms.updateEntityPlan'),
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            module: {
              value: '',
              type: 'select',
              props: {
                label: `${this.$tr('iplan.cms.form.module')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                options: this.moduleOptions,
              }
            },
            entity: {
              value: '',
              type: 'select',
              props: {
                label: `${this.$tr('iplan.cms.form.entity')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                options: this.entityOptions,
                vIf: this.entityOptions.length,
              }
            },
            status: {
              value: '1',
              type: 'select',
              props: {
                label: `${this.$tr('isite.cms.form.status')}*`,
                options: [
                  {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                  {label: this.$tr('isite.cms.label.disabled'), value: '0'}
                ],
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              }
            },
          },
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      },
      moduleOptions(){
        return this.$array.select(this.planModules,{id: 'value',label: 'label'})
      },
      entityOptions(){
        if(!this.crudInfo.module) return []
        let selectedModule = this.$array.findByTag(this.planModules,'value',this.crudInfo.module)
        return this.$array.select(selectedModule.entities, {id: 'entity',label: 'name'})
      }
    },
    mounted(){
      this.getPlanEntities()
    },
    methods: {
      getPlanEntities(){
        return new Promise((resolve, reject) => {
          let configName = 'apiRoutes.qplan.planModules'
          //Params
          let params = {
            refresh: true,
            params: {
              filter: {allTranslations: true}
            }
          }
          //Request
          this.$crud.index(configName, params).then(response => {
            this.planModules = response.data
            resolve(true)//Resolve
          }).catch(error => {
            this.$apiResponse.handleError(error, () => {
              this.$alert.error({message: this.$tr('isite.cms.message.errorRequest'), pos: 'bottom'})
              reject(false)//Resolve
            })
          })
        })
      }
    }
  }
</script>
