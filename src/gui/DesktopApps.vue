<template>
  <div class="apps">
    <div
      class="app"
      v-for="app in deskApp"
      :key="app.title"
      @dblclick="emit('lanuchApp', app)"
      @touchstart="emit('lanuchApp', app)"
    >
      <img class="icon" :src="app.icon" alt="" />
      <div class="app-name">{{ app.title }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const porps = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "lanuchApp"]);

const deskApp = computed(() => porps.modelValue);
</script>

<style lang="less" scoped>
@import "@/theme/index.less";
.apps {
  padding: calc(var(--bar-height) + 1rem) 1rem calc(var(--dock-height) + 1rem);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: calc(100vh - var(--dock-height) - var(--bar-height));
  width: 0;
  .app {
    height: 6rem;
    width: 6rem;
    font-size: 14px;
    text-align: center;
    img {
      margin-bottom: 0.5rem;
      border-radius: 0.3rem;
    }
  }
}
</style>
