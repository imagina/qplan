<template></template>

<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
      app: config('app')
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qplan.entityNames.subscription"),
        apiRoute: 'apiRoutes.qplan.subscriptions',
        permission: 'iplan.subscriptions',
        extraFormFields: 'Iplan.crud-fields.subscriptions',
        create: {
          title: this.$tr('iplan.cms.newSubscription'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('isite.cms.form.name'), field: 'name', align: 'left'},
            {name: 'entityName', label: this.$tr('iplan.cms.form.entityName'), field: 'entityName', align: 'left'},
            {
              name: 'start_date', label: this.$tr('iplan.cms.form.startDate'), field: 'startDate', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'end_date', label: this.$tr('iplan.cms.form.endDate'), field: 'endDate', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
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
              ...(this.app.mode == 'iadmin' ? {} : {
                user: this.$store.state.quserAuth.userId,
                status : 1
              })
            },
          },
          showAs: this.app.mode == 'ipanel' ? 'grid' : 'table'
        },
        update: {
          title: this.$tr('iplan.cms.updateSubscription'),
          to: 'qplan.admin.subscriptions.edit',
        },
        delete: true,
        formLeft: {
          entity: {value: 'Modules\\User\\Entities\\Sentinel\\User'},
          entityId: {
            value: null,
            type: 'crud',
            props: {
              crudData: import('modules/quser/_crud/users'),
              config: {
                options: {
                  label: 'fullName', value: 'id'
                }
              },
              crudType: 'select',
              crudProps: {
                label: this.$tr('isite.cms.label.user'),
                clearable: false,
              },
            }
          },
          planId: {
            value: null,
            type: 'crud',
            props: {
              crudData: import('../_crud/plans'),
              config: {
                options: {
                  label: 'name', value: 'id'
                }
              },
              crudType: 'select',
              crudProps: {
                label: this.$tr('iplan.cms.form.plan'),
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
