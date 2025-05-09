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
          title: this.$tr('iplan.cms.newPlan'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('isite.cms.form.name'), field: 'name', align: 'rigth'},
            {
              name: 'category', label: this.$tr('isite.cms.form.category'), field: 'category', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
            },
            {
              name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status', align: 'left'
            },
            {
              name: 'price', label: this.$tr('isite.cms.label.price'), field: 'price', align: 'left',
              format: val => val ? this.$trc(val) : '0'
            },
            {
              name: 'isRecurring', label: this.$tr('iplan.cms.form.isRecurring'), field: 'isRecurring', align: 'left',
              format: val => this.$tr(`iplan.cms.${val ? 'recurring' : 'oneTime'}`)
            },
            {
              name: 'limits', label: this.$trp('iplan.cms.form.limit'), field: 'limits',
              align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.map(item => {
                return item.name
              }).join(', ') : ''
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {
            include: 'category,limits',
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
                label: this.$tr('isite.cms.form.category'),
                clearable: true
              }
            },
          }
        },
        update: {
          title: this.$tr('iplan.cms.updatePlan'),
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
              label: `${this.$tr('isite.cms.form.name')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          description: {
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },

        },
        formRight: {
          status: {
            value: '1',
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.status'),
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                {label: this.$tr('isite.cms.label.disabled'), value: '0'},
              ]
            }
          },
          trial: {
            value: 0,
            type: 'input',
            help: {
              description: this.$tr('iplan.cms.helpFieldTrial')
            },
            props: {
              label: `${this.$tr('isite.cms.label.trial')}*`,
              type: 'number',
              rules: [
                val => val.length || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          isRecurring: {
            value: '0',
            type: 'select',
            props: {
              label: this.$tr('iplan.cms.form.isRecurring'),
              options: [
                {label: this.$tr('iplan.cms.oneTime'), value: '0'},
                {label: this.$tr('iplan.cms.recurring'), value: '1'},
              ]
            }
          },
          price: {
            value: 0,
            type: 'input',
            props: {
              type: 'number',
              label: this.$tr('isite.cms.label.price')
            }
          },
          sortOrder: {
            value: null,
            type: 'input',
            props: {
              label: this.$tr('isite.cms.label.order'),
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
              label: `${this.$tr('iplan.cms.form.frequency')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
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
                label: `${this.$tr('isite.cms.form.category')}*`,
                clearable: false,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
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
                label: `${this.$tr('iplan.cms.form.limit')}`,
                multiple: true,
                useChips: true,
                //rules: [val => val.length || this.$tr('isite.cms.message.fieldRequired')]
              }
            }
          },
          internal: {
            value: '0',
            type: 'checkbox',
            props: {
              label: this.$tr('isite.cms.label.internal'),
              trueValue: '1',
              falseValue: '0',
            }
          },
          mediasSingle: {
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.form.image'),
              zone: 'mainimage',
              entity: "Modules\\Iplan\\Entities\\Plan",
              entityId: null
            }
          }
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    },
    crudInfoId() {
      return this.crudInfo ? (this.crudInfo.id ? this.crudInfo.id : 0) : 0
    }
  },
  methods: {}
}
</script>
