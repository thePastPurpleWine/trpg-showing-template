<template>
  <div class="main-stage">
    <role-image></role-image>
    <role-dialog :is-system="Math.random() > 0.5" name="谢拉" content="故事的起因，是宿舍中的谢拉被人杀害，死因、其他线索以及公园湖边的案发地点一概被警察封锁了"/>
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

<style scoped lang="less">
.main-stage {
  padding-top: 240px;
  width: 100%;
  height: 100%;
}
</style>
