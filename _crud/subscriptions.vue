<template></template>

<script>
  export default {
    data() {
      return {
        crudId: this.$uid(),
      }
    },
    computed: {
      crudData() {
        return {
          crudId: this.crudId,
          apiRoute: 'apiRoutes.qplan.subscriptions',
          permission: 'iplan.subscriptions',
          extraFormFields: 'Iplan.crud-fields.subscriptions',
          create: {
            title: this.$tr('qplan.layout.newSubscription'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'left'},
              {name: 'entityName', label: this.$tr('qplan.layout.form.entityName'), field: 'entityName', align: 'left'},
              {
                name: 'start_date', label: this.$tr('qplan.layout.form.startDate'), field: 'startDate', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {
                name: 'end_date', label: this.$tr('qplan.layout.form.endDate'), field: 'endDate', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
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
            title: this.$tr('qplan.layout.updateSubscription'),
            to: 'qplan.admin.subscriptions.edit',
          },
          delete: true,
          formLeft: {
            entity: {value: 'Modules\\User\\Entities\\Sentinel\\User'},
            entityId:{
              value: '',
              type: 'crud',
              props: {
                crudData: import('@imagina/quser/_crud/users'),
                config:{
                  options:{
                    label: 'fullName', value: 'id'
                  }
                },
                crudType: 'select',
                crudProps:{
                  label: this.$tr('ui.label.user'),
                  clearable: false,
                },
              }
            },
            planId:{
              value: '',
              type: 'crud',
              props: {
                crudData: import('../_crud/plans'),
                config:{
                  options:{
                    label: 'name', value: 'id'
                  }
                },
                crudType: 'select',
                crudProps:{
                  label: this.$tr('qplan.layout.form.plan'),
                  clearable: false,
                },
              }
            },
          },
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      },
    },
  }
</script>
