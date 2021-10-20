<template>
  <div class="main">
<!--    <div class="stage-background">-->
      <div class="left-part">
        <chatting-window/>
      </div>
      <div class="center-part">
        <main-stage/>
      </div>
      <div class="right-part">
        <roleplay-log-window/>
      </div>
<!--    </div>-->
  </div>
</template>
<script>
import ChattingWindow from '@/views/ChattingWindow'
import MainStage from '@/views/MainStage'
import RoleplayLogWindow from '@/views/RoleplayLogWindow'

export default {
  components: {
    ChattingWindow,
    MainStage,
    RoleplayLogWindow
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
  background-image: url("../assets/宿舍3.png");
  display: flex;

  padding: @padding-size 0;
}

//.stage-background {
//  width: 100%;
//  height: 100%;
//  display: flex;
//}

.left-part {
  width: 32%;
  height: 100%;
}

.center-part {
  width: 50%;
  height: 100%;
  //background: rgba(0, 0, 0, 0.2);
}

.right-part {
  width: 10%;
  height: 100%;
  //background: rgba(0, 0, 0, 0.3);
}
</style>
