<template>
  <div>
    <img id="image" class="picture" :src="imageSrc" alt="">
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
      imageVisible: false
    }
  },
  computed: {
    element () {
      return document.getElementById('image')
    },
    elementStyle () {
      return this.element.style
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
      this.elementStyle.opacity = '1'
    },
    fadeOut () {
      this.elementStyle.opacity = '0'
      this.imageVisible = false
    }
  }
}
</script>

<style scoped>
.display {
  display: flex;
}
.picture {
  opacity: 0;
  max-width: 100%;
  max-height: 100%;
  margin: auto ;

  transition: opacity 1.5s linear;
}
</style>
