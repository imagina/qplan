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
          apiRoute: 'apiRoutes.qplan.categories',
          permission: 'iplan.categories',
          extraFormFields: 'crud-fields.Iplan.categories',
          create: {
            title: this.$tr('qplan.layout.newCategory'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'title', label: this.$tr('ui.form.title'), field: 'title', align: 'rigth'},
              {name: 'slug', label: this.$tr('ui.form.slug'), field: 'slug', align: 'left'},
              {
                name: 'status', label: this.$tr('ui.form.status'), field: 'status'
              },
              {
                name: 'parent', label: this.$tr('ui.form.parent'), field: 'parent', align: 'left',
                format: val => val ? (val.title ? val.title : '-') : '-'
              },
              {
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {
              include: 'parent',
              filter: {
                order: {
                  field: 'created_at',
                  way: 'desc',
                },
              },
            },
            filters : {
              parentId: {
                value: null,
                type: 'treeSelect',
                loadOptions: {
                  apiRoute: 'apiRoutes.qplan.categories',
                  select: {label: 'title', id: 'id'},
                },
                props: {
                  label: this.$tr('ui.form.parent'),
                  clearable: true
                }
              },
            }
          },
          update: {
            title: this.$tr('qplan.layout.updateCategory'),
            requestParams: {include: 'parent'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            title: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.title')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            slug: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.slug')}*`,
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
            status: {
              value: '1',
              type: 'select',
              props: {
                label: `${this.$tr('ui.form.status')}*`,
                options: [
                  {label: this.$tr('ui.label.enabled'), value: '1'},
                  {label: this.$tr('ui.label.disabled'), value: '0'}
                ],
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            parentId: {
              value: '0',
              type: 'treeSelect',
              loadOptions: {
                apiRoute: 'apiRoutes.qplan.categories',
                select: {label: 'title', id: 'id'}
              },
              props: {
                label: this.$tr('ui.form.parent'),
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
