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
          entityName: config("main.qplan.entityNames.planCategory"),
          apiRoute: 'apiRoutes.qplan.categories',
          permission: 'iplan.categories',
          extraFormFields: 'Iplan.crud-fields.categories',
          create: {
            title: this.$tr('iplan.cms.newCategory'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},
              {name: 'slug', label: this.$tr('isite.cms.form.slug'), field: 'slug', align: 'left'},
              {
                name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status'
              },
              {
                name: 'parent', label: this.$tr('isite.cms.form.parent'), field: 'parent', align: 'left',
                format: val => val ? (val.title ? val.title : '-') : '-'
              },
              {
                name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
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
                  label: this.$tr('isite.cms.form.parent'),
                  clearable: true
                }
              },
            }
          },
          update: {
            title: this.$tr('iplan.cms.updateCategory'),
            requestParams: {include: 'parent'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            title: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('isite.cms.form.title')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              }
            },
            slug: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('isite.cms.form.slug')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              }
            },
            description: {
              value: '',
              type: 'html',
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
            parentId: {
              value: null,
              type: 'treeSelect',
              loadOptions: {
                apiRoute: 'apiRoutes.qplan.categories',
                select: {label: 'title', id: 'id'}
              },
              props: {
                label: this.$tr('isite.cms.form.parent'),
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
