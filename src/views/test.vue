<template>
  <div></div>
</template>

<script>
import StoryPlay from '@/assets/play/6-story.json'
export default {
  name: 'test',
  data () {
    return {
      chapterStart: StoryPlay,
      formatList: []
    }
  },
  mounted () {
    this.formatList = this.chapterStart.map((data, index) => {
      data.index = index
      return data
    })
    console.log(JSON.stringify(this.formatList))
  },
  methods: {
    guid () {
      return 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
  }
}
</script>

<style scoped>

</style>
