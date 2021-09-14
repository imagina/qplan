<template></template>

<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
      products: [],
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qplan.entityNames.plan"),
        apiRoute: 'apiRoutes.qplan.plans',
        permission: 'iplan.plans',
        extraFormFields: 'Iplan.crud-fields.plans',
        create: {
          title: this.$tr('qplan.layout.newPlan'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'rigth'},
            {
              name: 'category', label: this.$tr('ui.form.category'), field: 'category', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
            },
            {
              name: 'product', label: this.$tr('ui.label.product'), field: 'product', align: 'left',
              format: val => val ? (val.name ? val.name : '-') : '-'
            },
            {
              name: 'price', label: this.$tr('ui.label.price'), field: 'product', align: 'left',
              format: val => val ? (val.price ? this.$trc(val.price) : '-') : '-'
            },
            {
              name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
          ],
          requestParams: {
            include: 'category',
            filter: {
              order: {
                field: 'created_at',
                way: 'desc',
              },
            },
          },
          filters: {
            category: {
              value: null,
              type: 'treeSelect',
              loadOptions: {
                apiRoute: 'apiRoutes.qplan.categories',
                select: {label: 'title', id: 'id'},
              },
              props: {
                label: this.$tr('ui.form.category'),
                clearable: true
              }
            },
          }
        },
        update: {
          title: this.$tr('qplan.layout.updatePlan'),
          requestParams: {include: 'category,limits,product'}
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          name: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.name')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          description: {
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.description')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
        },
        formRight: {
          status: {
            value: '1',
            type: 'select',
            props: {
              label: this.$tr('ui.form.status'),
              options: [
                {label: this.$tr('ui.label.enabled'), value: '1'},
                {label: this.$tr('ui.label.disabled'), value: '0'},
              ]
            }
          },
          sortOrder: {
            value: null,
            type: 'input',
            props: {
              label: this.$tr('ui.label.order'),
              type: 'number'
            }
          },
          frequencyId: {
            value: '',
            type: 'select',
            loadOptions: {
              apiRoute: 'apiRoutes.qplan.frequencies',
              select: {label: 'title', id: 'id'},
            },
            props: {
              label: `${this.$tr('qplan.layout.form.frequency')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          categoryId: {
            value: null,
            type: 'crud',
            props: {
              crudData: import('../_crud/planCategories'),
              crudType: 'select',
              crudProps: {
                label: `${this.$tr('ui.form.category')}*`,
                clearable: false,
                options: [
                  {label: this.$tr('ui.label.disabled'), id: '0'},
                ],
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              },
            }
          },
          limits: {
            value: [],
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('../_crud/limits'),
              config: {
                options: {
                  label: 'name', value: 'id'
                }
              },
              crudProps: {
                label: `${this.$tr('qplan.layout.form.limit')}*`,
                multiple: true,
                useChips: true,
                rules: [val => val.length || this.$tr('ui.message.fieldRequired')]
              }
            }
          },
          productId: {
            value: '',
            type: 'select',
            props: {
              vIf: this.productOptions.length > 0,
              label: this.$tr('ui.label.product'),
              clearable: true,
              options: this.productOptions
            }
          },
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    },
    crudInfoId() {
      return this.crudInfo ? (this.crudInfo.id ? this.crudInfo.id : 0) : 0
    },
    productOptions() {
      return this.$array.select(this.products, {id: 'id', label: 'name'})
    }
  },
  watch: {
    'crudInfoId'() {
      this.getProductOptions()
    }
  },
  methods: {
    getProductOptions() {
      return new Promise((resolve, reject) => {
        //Params
        let requestParams = {
          refresh: true,
          params: {
            filter: {
              allTranslations: true,
              entityId: this.crudInfo.id
            }
          }
        }
        //Request
        this.$crud.index('apiRoutes.qcommerce.products', requestParams).then(response => {
          this.products = response.data
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
