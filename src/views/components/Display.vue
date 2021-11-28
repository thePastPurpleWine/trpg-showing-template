<template>
  <div>
    <img :style="{ 'opacity': opacity }" class="display-picture" :src="imageSrc" alt="">
  </div>
</template>

<script>
export default {
  name: 'Display',
  props: {
    filepath: String,
    waiting: Boolean,
    duration: Number,
    trigger: Boolean
  },
  data () {
    return {
      imageSrc: undefined,
      imageVisible: false,
      opacity: '0'
    }
  },
  watch: {
    trigger () {
      if (!this.imageVisible) {
        this.imageSrc = require('@/assets/picture/' + this.filepath)
        this.fadeIn()
        if (!this.waiting) {
          setTimeout(() => {
            this.fadeOut()
          }, this.duration)
        }
      } else {
        if (this.waiting) {
          this.fadeOut()
        }
      }
    }
  },
  methods: {
    fadeIn () {
      this.imageVisible = true
      this.opacity = '1'
    },
    fadeOut () {
      this.opacity = '0'
      this.imageVisible = false
    }
  }
}
</script>

<style scoped>
.display-picture {
  opacity: 0;
  max-width: 100%;
  max-height: 100%;
  margin: auto ;

  transition: opacity 1.5s linear;
}
</style>
