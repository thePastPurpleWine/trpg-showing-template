<template>
  <div id="role" class="main-role">
    <img :src="imageSrc" alt="">
  </div>
</template>

<script>
export default {
  name: 'RoleImage',
  props: {
    roleImageSrc: String
  },
  data () {
    return {
      imageSrc: ''
    }
  },
  watch: {
    roleImageSrc (roleImageSrc) {
      if (roleImageSrc) {
        const src = roleImageSrc
        const img = new Image()
        img.onload = () => {
          this.$emit('loaded')
          this.imageSrc = src
        }
        img.src = src
      } else {
        this.imageSrc = ''
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
