<template>
  <div>
    <role-image></role-image>
    <role-dialog/>
  </div>
</template>

<script>
import RoleImage from '@/views/RoleImage'
import RoleDialog from '@/views/RoleDialog'
export default {
  name: 'MainStage',
  components: {
    RoleImage,
    RoleDialog
  }
}
</script>

<style scoped>

</style>
