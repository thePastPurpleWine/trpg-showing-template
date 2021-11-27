<template>
  <div id="role" class="main-role">
    <img :src="roleImageSrc" alt="" @load="loaded">
  </div>
</template>

<script>
export default {
  name: 'RoleImage',
  props: {
    role: String
  },
  data () {
    return {
      element: undefined,
      roleImageSrc: ''
    }
  },
  computed: {
    elementStyle () {
      return this.element.style
    }
  },
  mounted () {
    this.element = document.getElementById('role')
    this.preload()
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
          new Image().src = require('@/assets/role/' + role + '/' + role + '-' + i + '.png')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
