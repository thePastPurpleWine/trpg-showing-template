<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      locale: zhCN
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
#app{
  width: 100%;
  min-height: 100%;
  background-color: #F4F7FA;
}
</style>
