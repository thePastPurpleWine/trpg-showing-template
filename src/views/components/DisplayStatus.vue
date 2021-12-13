<template>
  <div>
    <div :style="{ 'opacity': imageA.opacity }" class="display-div">
      <img class="display-image" :src="imageA.imageUrl" alt="" @load="preloaded('imageA')">
    </div>
    <div :style="{ 'opacity': imageB.opacity }" class="display-div">
      <img class="display-image" :src="imageB.imageUrl" alt="" @load="preloaded('imageB')">
    </div>
  </div>
</template>

<script>
export default {
  name: 'DisplayStatus',
  data () {
    return {
      isImageA: true,
      imageA: {
        imageUrl: undefined,
        opacity: '0',
        loaded: false
      },
      imageB: {
        imageUrl: undefined,
        opacity: '0',
        loaded: false
      }
    }
  },
  computed: {
    nowImage () {
      if (this.imageB.opacity === '0') {
        return 'imageA'
      } else {
        return 'imageB'
      }
    },
    nextImage () {
      if (this.imageA.opacity !== '0') {
        return 'imageB'
      } else {
        return 'imageA'
      }
    }
  },
  methods: {
    preloaded () {
      if (this.nowImage === this.nextImage) {
        this[this.nextImage].loaded = true
        this[this.nextImage].opacity = '1'
        console.log('preloaded', this[this.nextImage])
      } else {
        const nowImage = this.nowImage
        const nextImage = this.nextImage
        this[nowImage].loaded = false
        this[nowImage].opacity = '0'
        this[nextImage].loaded = true
        this[nextImage].opacity = '1'
        console.log('preloaded', this[nowImage], this[nextImage])
      }
    },
    preload (picture) {
      const src = require('@/assets/picture/' + picture.filepath)
      this[this.nextImage].imageUrl = src
    },
    showImage (picture) {
      if (picture === undefined) {
        return
      }

      this.preload(picture)

      if (!picture.waiting) {
        setTimeout(() => {
          this.hideImage()
        }, picture.duration)
      }
    },
    hideImage () {
      this[this.nowImage].opacity = '0'
    }
  }
}
</script>

<style scoped>
.display-div {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: opacity 1.5s linear, background-image 1.5s linear;
}

.display-image {
  width: 100%;
  height: 100%;
}
</style>
