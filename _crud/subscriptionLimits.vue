<template></template>

<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
      limitEntities: [],
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qplan.entityNames.subscriptionLimit"),
        apiRoute: 'apiRoutes.qplan.subscriptionLimits',
        permission: 'iplan.subscriptionlimits',
        extraFormFields: 'Iplan.crud-fields.subscriptionLimits',
        create: false,
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('isite.cms.form.name'), field: 'name', align: 'left'},
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
            },
          },
        },
        update: {
          title: this.$tr('iplan.cms.updateSubscriptionLimit'),
        },
        formLeft: {
          id: {value: ''},
          name: {
            value: '',
            type: 'input',
            props: {
              readonly: true,
              label: `${this.$tr('isite.cms.form.name')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          quantity: {
            value: '1',
            type: 'input',
            props: {
              label: `${this.$tr('iplan.cms.form.quantity')}*`,
              type: 'number',
              min: '1',
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          quantityUsed: {
            value: '0',
            type: 'input',
            props: {
              label: `${this.$tr('iplan.cms.form.quantityUsed')}*`,
              type: 'number',
              min: '0',
              rules: [
                val => val >= 0 || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          entity: {
            value: '',
          },
          attribute: {
            value: '',
          },
          attributeValue: {
            value: '',
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
