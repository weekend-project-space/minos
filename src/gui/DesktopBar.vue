<template>
  <div class="bar">
    <div class="bar-title">
      <img v-if="bar.icon" class="icon" :src="bar.icon" alt="" />
      {{ bar.title ? bar.title : "minos" }}
    </div>
    <div>
      <div class="icons" v-if="bar.title">
        <span class="icon" @click="emit('clickClose', bar)" title="退出">
          <img src="../assets/icon/ios-log-out.svg" alt="" />
        </span>
      </div>
    </div>

    <div class="bar-action">
      <div class="icons">
        <span class="icon">
          <img src="../assets/icon/ios-battery-full.svg" alt="" title="电量" />
        </span>
        <span class="icon">
          <img src="../assets/icon/ios-wifi.svg" alt="" title="wifi" />
        </span>
        <span class="icon">
          <img src="../assets/icon/ios-search.svg" alt="" title="搜索" />
        </span>
        <span class="icon">
          <img src="../assets/icon/ios-switch.svg" alt="" title="设置" />
        </span>
      </div>
      <div>
        {{ time }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNow, useDateFormat } from "@vueuse/core";
defineProps({
  bar: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["clickClose", "clickMin"]);

const time = useDateFormat(useNow(), "MM-DD HH:mm");
</script>

<style lang="less" scoped>
@import "@/theme/var.less";
.bar {
  position: absolute;
  right: 0;
  left: 0;
  .bg();
  min-height: var(--bar-height);
  display: grid;
  grid-template-columns: 160px 1fr 200px;
  padding: 0 1rem;
  line-height: var(--bar-height);
  font-size: 13px;
  z-index: 100000;
  // background-color: rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.6);
  color: #333;
  .bar-title {
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.3rem;
      filter: grayscale(100%); //brightness(300%);
    }
  }
  .center {
    text-align: center;
  }
  .icons {
    display: grid;
    grid-template-columns: repeat(auto-fill, 1rem);
    grid-gap: 1rem;
    height: 100%;
  }
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 1rem;
      height: 1rem;
    }
  }
}
.bar-action {
  display: grid;
  grid-template-columns: 1fr auto;
}
</style>
