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
        entityName: config("main.qplan.entityNames.limit"),
        apiRoute: 'apiRoutes.qplan.limits',
        permission: 'iplan.limits',
        extraFormFields: 'Iplan.crud-fields.limits',
        create: {
          title: this.$tr('iplan.cms.newLimit'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('isite.cms.form.name'), field: 'name', align: 'rigth'},
            {
              name: 'entity', label: this.$tr('iplan.cms.form.entity'), field: 'entity', align: 'left',
              format: val => {
                let entity = this.entitiesOptions.find(item => item.id == val)
                return entity?.label || '-'
              }
            },
            {
              name: 'attribute', label: this.$tr('iplan.cms.form.attribute'), field: 'attribute', align: 'left',
              format: val => {
                let attributes = this.limitEntities.map(item => item.attributes).flat()
                let attr = attributes.find(item => item.value == val)
                return attr?.label || '-'
              }
            },
            {
              name: 'attributeValue', label: this.$tr('iplan.cms.form.attributeValue'), field: 'attributeValue', align: 'left',
              format: (val, row) => {
                let attributes = this.limitEntities.map(item => item.attributes).flat()
                let attrValues = attributes.find(item => item.value == row.attribute)
                let attValue = attrValues.options.find(item => item.value == val)
                return attValue?.label || '-'
              }
            },
            {name: 'quantity', label: this.$tr('isite.cms.form.quantity'), field: 'quantity', align: 'rigth'},
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
          title: this.$tr('iplan.cms.updateLimit'),
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          name: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.name')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          entity: {
            value: '',
            type: 'select',
            props: {
              label: `${this.$tr('iplan.cms.form.entity')}*`,
              clearable: false,
              options: this.entitiesOptions,
            }
          },
          attribute: {
            value: '',
            type: 'select',
            props: {
              label: `${this.$tr('iplan.cms.form.attribute')}`,
              options: this.attributeOptions,
              vIf: this.attributeOptions.length,
              clearable: true
            }
          },
          attributeValue: {
            value: '',
            type: 'select',
            props: {
              label: `${this.$tr('iplan.cms.form.attributeValue')}*`,
              options: this.attributeValueOptions,
              vIf: this.attributeValueOptions.length,
            }
          },
          quantity: {
            value: '1',
            type: 'input',
            props: {
              label: `${this.$tr('iplan.cms.form.quantity')}*`,
              type: 'number',
              min: '1',
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
