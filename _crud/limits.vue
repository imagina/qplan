<template></template>

<script>
  export default {
    data() {
      return {
        crudId: this.$uid()
      }
    },
    computed: {
      crudData() {
        return {
          crudId: this.crudId,
          apiRoute: 'apiRoutes.qplan.limits',
          permission: 'iplan.plans',
          extraFormFields: 'crud-fields.Iplan.limits',
          create: {
            title: this.$tr('qplan.layout.newLimit'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'rigth'},
              {
                name: 'plan', label: this.$tr('qlan.layout.form.plan'), field: 'plan', align: 'left',
                format: val => val ? (val.name ? val.name : '-') : '-'
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
            filters : {
              plan: {
                value: null,
                type: 'treeSelect',
                loadOptions: {
                  apiRoute: 'apiRoutes.qplan.plans',
                  select: {label: 'name', id: 'id'},
                },
                props: {
                  label: this.$tr('qplan.layout.form.plan'),
                  clearable: true
                }
              },
            }
          },
          update: {
            title: this.$tr('qplan.layout.updateLimit'),
            requestParams: {include: 'plan'}
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
          },
          formRight: {
            quantity: {
              value: '1',
              type: 'input',
              isTranslatable: false,
              props: {
                label: `${this.$tr('qplan.layout.form.quantity')}*`,
                type: 'number',
                min: '1',
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            planId: {
              value: '0',
              type: 'treeSelect',
              loadOptions: {
                apiRoute: 'apiRoutes.qplan.plans',
                select: {label: 'name', id: 'id'}
              },
              props: {
                label: this.$tr('qplan.layout.form.plan'),
                clearable: false,
                options: [
                  {label: this.$tr('ui.label.disabled'), id: '0'},
                ],
              }
            },
          },
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    }
  }
</script>
