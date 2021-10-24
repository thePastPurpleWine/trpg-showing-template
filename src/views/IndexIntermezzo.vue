<template>
  <div class="main">
<!--    <div class="stage-background">-->
      <div class="left-part">
        <chatting-window/>
      </div>
<!--      <div class="right-part">-->
<!--        <roleplay-log-window/>-->
<!--      </div>-->
  </div>
</template>
<script>
import ChattingWindow from '@/views/ChattingWindow'

export default {
  name: 'IndexIntermezzo',
  components: {
    ChattingWindow
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
@padding-size: 20px;

.main {
  width: 1920px;
  height: 1080px;
  background-image: url("../assets/间奏背景.png");
  display: flex;

  padding: @padding-size 0;
}

//.stage-background {
//  width: 100%;
//  height: 100%;
//  display: flex;
//}

.left-part {
  margin-left: 400px;
  width: 32%;
  height: 95%;
}

.center-part {
  width: 1200px;
  height: 100%;
  //background: rgba(0, 0, 0, 0.2);
}

.right-part {
  width: 10%;
  height: 100%;
  //background: white;
}
</style>
