<template></template>

<script>
export default {
  mounted() {
    this.$nextTick(function () {
      this.getLimitEntities()
    })
  },
  data() {
    return {
      crudId: this.$uid(),
      limitEntities: [],
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qplan.limits',
        permission: 'iplan.limits',
        extraFormFields: 'Iplan.crud-fields.limits',
        create: {
          title: this.$tr('qplan.layout.newLimit'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'rigth'},
            {
              name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
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
          title: this.$tr('qplan.layout.updateLimit'),
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          name: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('ui.form.name')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          entity: {
            value: '',
            type: 'select',
            props: {
              label: `${this.$tr('qplan.layout.form.entity')}*`,
              clearable: false,
              options: this.entitiesOptions,
            }
          },
          attribute: {
            value: '',
            type: 'select',
            props: {
              label: `${this.$tr('qplan.layout.form.attribute')}`,
              options: this.attributeOptions,
              vIf: this.attributeOptions.length,
              clearable: true
            }
          },
          attributeValue: {
            value: '',
            type: 'select',
            props: {
              label: `${this.$tr('qplan.layout.form.attributeValue')}*`,
              options: this.attributeValueOptions,
              vIf: this.attributeValueOptions.length,
            }
          },
          quantity: {
            value: '1',
            type: 'input',
            props: {
              label: `${this.$tr('qplan.layout.form.quantity')}*`,
              type: 'number',
              min: '1',
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
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
    attributeValueOptions() {
      if (!this.crudInfo.attribute) return []
      let selectedEnt = this.$array.findByTag(this.limitEntities, 'entity', this.crudInfo.entity)
      let selectedAttr = this.$array.findByTag(selectedEnt.attributes, 'value', this.crudInfo.attribute)
      return selectedAttr.options
    },
    attributeOptions() {
      if (!this.crudInfo.entity) return []
      let selectedEnt = this.$array.findByTag(this.limitEntities, 'entity', this.crudInfo.entity)
      return selectedEnt.attributes
    },
    entitiesOptions() {
      return this.$array.select(this.limitEntities, {id: 'entity', label: 'name'})
    }
  },
  methods: {
    getLimitEntities() {
      return new Promise((resolve, reject) => {
        //Params
        let requestParams = {
          refresh: true,
          params: {
            filter: {allTranslations: true, configNameByModule: 'config.limitableEntities'}
          }
        }
        //Request
        this.$crud.index('apiRoutes.qsite.configs', requestParams).then(response => {
          if (response.data) {
            //Merge all entities
            let limitEntities = []
            Object.values(response.data).forEach(item => {
              if (item) {
                item.forEach(limitableEntity => {
                  if (limitableEntity && limitableEntity.status) limitEntities.push(limitableEntity)
                })
              }
            })
            //Set entities

            this.limitEntities = limitEntities
          }
          resolve(true)//Resolve
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
          reject(false)//Resolve
        })
      })
    }
  }
}
</script>
