<template>
  <div :style="{ 'opacity': opacity, 'background-image': imageUrl }" class="display-picture"/>
</template>

<script>
export default {
  name: 'Display',
  props: {
    preloadImage: Boolean
  },
  data () {
    return {
      preloadImageUrl: undefined,
      imageUrl: undefined,
      opacity: '0',
      preloadDict: {},
      preloadList: [
        '3-status-0.png',
        '3-status-01.png',
        '3-status-01-1.png',
        '3-status-02.png',
        '3-status-03.png',
        '3-status-04.png',
        '3-status-05.png',
        '3-status-06.png',
        '3-status-07.png',
        '3-status-08.png',
        '3-status-09.png',
        '3-status-10.png',
        '3-status-11.png',
        '3-status-12.png',
        '3-status-13.png',
        '3-status-14.png',
        '3-status-15.png',
        '3-status-16.png',
        '3-status-17.png',
        '3-status-18.png'
      ]
    }
  },
  mounted () {
    if (this.preloadImage) {
      this.preloadList.forEach((t) => {
        const src = require('@/assets/picture/' + t)
        this.preloadDict[t] = 'url(' + src + ')'
      })
    }
  },
  watch: {
    filepath () {
      const src = require('@/assets/picture/' + this.filepath)
      this.preloadImageUrl = 'url(' + src + ')'
    }
  },
  methods: {
    preload (picture) {
      if (picture === undefined) {
        return
      }

      const src = require('@/assets/picture/' + picture.filepath)
      this.preloadImageUrl = 'url(' + src + ')'
    },
    showImage (picture) {
      if (picture === undefined) {
        return
      }

      if (this.preloadImage) {
        this.imageUrl = this.preloadDict[picture.filepath]
      } else {
        const src = require('@/assets/picture/' + picture.filepath)
        this.imageUrl = 'url(' + src + ')'
      }

      this.opacity = '1'

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
.display-picture {
  transition: opacity 1.5s linear, background-image 1.5s linear;
}
</style>
