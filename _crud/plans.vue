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
          apiRoute: 'apiRoutes.qplan.plans',
          permission: 'iplan.plans',
          extraFormFields: 'crud-fields.Iplan.plans',
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
            requestParams: {include: 'category'}
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
            description: {
              value: '',
              type: 'html',
              props: {
                label: `${this.$tr('ui.form.description')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
          },
          formRight: {
            frequencyId: {
              value: '1',
              type: 'select',
              props: {
                label: `${this.$tr('qplan.layout.form.frequency')}*`,
                options: [
                  {label: this.$tr('ui.label.enabled'), value: '1'},
                  {label: this.$tr('ui.label.disabled'), value: '0'}
                ],
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            categoryId: {
              value: '0',
              type: 'treeSelect',
              loadOptions: {
                apiRoute: 'apiRoutes.qplan.categories',
                select: {label: 'title', id: 'id'}
              },
              props: {
                label: this.$tr('ui.form.category'),
                clearable: false,
                options: [
                  {label: this.$tr('ui.label.disabled'), id: '0'},
                ],
              }
            },
            limits: {
              value: [],
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.qplan.limits',
                select: {label: 'name', id: 'id'},
              },
              props: {
                label: this.$tr('qplan.layout.form.limit'),
                multiple: true,
                clearable: true,
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
