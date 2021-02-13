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
          apiRoute: 'apiRoutes.qplan.subscriptions',
          permission: 'iplan.subscriptions',
          extraFormFields: 'crud-fields.Iplan.subscriptions',
          create: {
            title: this.$tr('qplan.layout.newSubscription'),
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
            title: this.$tr('qplan.layout.updateSubscription'),
            requestParams: {include: 'category'}
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
            categoryName: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props: {
                label: `${this.$tr('qplan.layout.form.category')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            frequency: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props: {
                label: `${this.$tr('qplan.layout.form.frequency')}*`,
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
      }
    }
  }
</script>
