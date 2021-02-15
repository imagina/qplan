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
          apiRoute: 'apiRoutes.qplan.subscriptionLimits',
          permission: 'iplan.subscriptionLimits',
          extraFormFields: 'crud-fields.Iplan.subscriptionLimits',
          create: {
            title: this.$tr('qplan.layout.newsubscriptionLimit'),
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
            title: this.$tr('qplan.layout.updatesubscriptionLimit'),
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
            quantity: {
              value: '',
              type: 'input',
              isTranslatable: false,
              props: {
                type: 'number',
                min: '1',
                label: `${this.$tr('qplan.layout.form.quantity')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            quantityUsed:{
              value: 0,
            }
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
