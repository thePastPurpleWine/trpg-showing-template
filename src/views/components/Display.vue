<template>
  <div :style="{ opacity: opacity, 'background-image': backgroundImage }" class="display-div"/>
</template>

<script>
export default {
  name: 'Display',
  data () {
    return {
      opacity: '0',
      backgroundImage: 'unset',
      timeoutId: undefined,
      picture: {
        filepath: String,
        waiting: Boolean,
        duration: Number
      }
    }
  },
  methods: {
    showImage (picture) {
      if (!picture || !picture.filepath) {
        return
      }

      clearTimeout(this.timeoutId)
      this.timeoutId = undefined

      const src = require('@/assets/picture/' + picture.filepath)
      const img = new Image()
      img.src = src
      img.onload = () => {
        this.opacity = '1'
        this.backgroundImage = 'url(' + src + ')'
      }

      // 等待标记代表不主动消失
      if (!picture.waiting) {
        this.timeoutId = setTimeout(() => {
          this.hideImage()
        }, picture.duration)
      }
    },
    hideImage () {
      this.opacity = '0'
    }
  }
}
</script>

<style scoped>
.display-div {
  position: absolute;
  /*width: 100%;*/
  /*height: 100%;*/
  transition: opacity 1.5s linear, background-image 1.5s linear;
}
</style>
