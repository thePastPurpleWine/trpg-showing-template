<template>
  <div class="main">
    <div class="left-part">
      <chatting-window/>
    </div>
    <div class="center-part">
      <main-stage/>
    </div>
    <div class="right-part">
      <roleplay-log-window/>
    </div>
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
  background-color: #e8e8e8;
  display: flex;

  padding: @padding-size;
}

.left-part {
  width: 30%;
  height: 100%;
}

.center-part {
  width: 40%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}

.right-part {
  width: 30%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
</style>
