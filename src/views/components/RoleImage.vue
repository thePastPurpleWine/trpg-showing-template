<template>
  <div id="role" class="main-role">
    <img :src="roleImageSrc" alt="" @load="loaded">
  </div>
</template>

<script>
export default {
  name: 'RoleImage',
  props: {
    role: String,
    nextRole: String
  },
  data () {
    return {
      element: undefined,
      roleImageSrc: '',
      nextRoleSrc: '',
      preloadRoleDict: {}
    }
  },
  mounted () {
    this.element = document.getElementById('role')
    // this.preload()
  },
  watch: {
    role (val) {
      if (val) {
        const role = val.split('-')[0]
        const image = role + '-' + val.split('-')[1] + '.png'

        this.roleImageSrc = require('@/assets/role/' + role + '/' + image)
      } else {
        this.roleImageSrc = ''
      }
    },
    nextRole (val) {
      if (val) {
        const role = val.split('-')[0]
        const image = role + '-' + val.split('-')[1] + '.png'

        this.nextRoleSrc = require('@/assets/role/' + role + '/' + image)
      } else {
        this.nextRoleSrc = ''
      }
    }
  },
  methods: {
    loaded () {
      this.$emit('loaded')
    },
    preload () {
      const roleList = ['aj', 'dj', 'hy', 'tz', 'xx']
      for (const role of roleList) {
        for (const i in 9) {
          this.preloadRoleDict[role + '-' + i] = require('@/assets/role/' + role + '/' + role + '-' + i + '.png')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
