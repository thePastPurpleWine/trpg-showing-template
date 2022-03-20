<template>
  <div>
    <audio id="dialogVoice"></audio>
<!--    角色图片-->
    <role-image class="role-image" :role="role" @loaded="roleImageReady = true"/>
    <div class="dialog-block">
<!--    KP（系统）与其他角色的对话框样式不同-->
      <img class="dialog-image" v-show="!isKP" :src="dialogNormal" alt="" @load="dialogImageReady = true">
      <img class="dialog-image" v-show="isKP" :src="dialogSystem" alt="" @load="dialogImageReady = true">

      <div class="dialog-content-block" v-if="isKP" v-show="roleImageReady && dialogImageReady">
<!--        roll点时的样式差分-->
        <div class="content-normal content-kp content-roll" v-if="isRoll">
          <span>{{ currentContent }}</span>
          <span id="diceSuffixText" :style="{ 'opacity': diceResultOpacity, 'color': '#dd0000' }">{{ diceSuffix }}</span>
        </div>

        <div class="content-normal content-kp" v-else>
          <span :style="{ 'color': roleConfig.color }">{{ currentContent }}</span>
        </div>
      </div>

      <div class="dialog-content-block" v-else v-show="roleImageReady && dialogImageReady">
        <div class="name">
          <span v-show="!isKP">{{ name }}</span>
        </div>
        <div class="content-normal">
          <span :style="{ 'color': roleConfig.color }">{{ currentContent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
