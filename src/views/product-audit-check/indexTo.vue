<template>
  <ProductEdit :mode="mode" />
</template>

<script>
  import { EDIT_TYPE } from '@/data/enums/common'
  import CheckAuditMixin from '@/views/new-components/EditType/CheckAudit'
  import ProductEditWidthMixin from '@/views/product-edit/product-edit-with-mixin'

  export default {
    name: 'product-audit-edit',
    components: { ProductEdit: ProductEditWidthMixin(CheckAuditMixin) },
    computed: {
      mode () {
        return this.$route.query.modify === '1' ? EDIT_TYPE.AUDITING_MODIFY_AUDIT : EDIT_TYPE.CHECK_AUDIT
      }
    }
  }
</script>
