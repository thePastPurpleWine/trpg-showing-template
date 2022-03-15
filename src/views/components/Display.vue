<template>
  <div :style="{ opacity: opacity, 'background-image': backgroundImage }" class="display-div"/>
</template>

<script>
export default {
  name: 'Display',
  data () {
    return {
      opacity: '0',
      backgroundImage: 'unset'
    }
  },
  methods: {
    showImage (picture) {
      console.log('showImage')
      if (!picture || !picture.filepath) {
        return
      }

      console.log('showImage start')
      const src = require('@/assets/picture/' + picture.filepath)
      const img = new Image()
      img.src = src
      img.onload = () => {
        this.opacity = '1'
        this.backgroundImage = 'url(' + src + ')'
      }

      if (!picture.waiting) {
        setTimeout(() => {
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
