<template>
  <div ref="dockm" class="dock-m-a"></div>
  <div ref="dock" class="dock" :class="{ 'dock-hide': dockHide }">
    <div
      class="app"
      :class="{ 'app-actor': !item.min }"
      v-for="(item, i) in apps"
      :key="i"
    >
      <div @click="toggleShowApp(i)">
        <img class="icon" :src="item.icon" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useMouseInElement } from "@vueuse/core";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "toggleShowApp"]);

const dockm = ref();
const dock = ref();
const { isOutside: dockmIsOut } = useMouseInElement(dockm);
const { isOutside: dockIsOut } = useMouseInElement(dock);

const apps = computed(() => props.modelValue);

function toggleShowApp(i) {
  emit("toggleShowApp", i);
}
const dockHide = computed(() => {
  const isHideDock = apps.value.filter((o) => !o.min && o.full).length > 0;
  return isHideDock && dockmIsOut.value && dockIsOut.value;
});
</script>

<style lang="less" scoped>
@import "@/theme/index.less";
.dock-m-a {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 0 auto;
  max-width: 30vw;
  min-height: 10px;
  border-radius: 1rem;
  z-index: 100000;
}
.dock {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
  max-width: 30vw;
  min-height: var(--dock-height);
  border-radius: 0.8rem;
  z-index: 100000;
  display: grid;
  grid-template-columns: repeat(auto-fill, 32px);
  grid-gap: 1rem;
  padding: 0.7rem 1rem;
  animation-duration: 0.6s;
  animation-name: slideshow;
  // border: 1px solid #f6f6f6;
  .bg();
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0px -3px 6px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  .app {
    img {
      width: 30px;
      height: 30px;
      border-radius: 0.3rem;
    }
    &::after {
      display: block;
      height: 5px;
      width: 10px;
      content: " ";
      background: orange;
      border-radius: 3px;
    }
  }
  .app-actor {
    &::after {
      width: 15px;
      background: green;
    }
  }
}
.dock-hide {
  animation-duration: 1s;
  animation-name: slidehide;
  bottom: -70px;
}
@keyframes slidehide {
  from {
    bottom: 10px;
  }

  to {
    bottom: -70px;
  }
}
@keyframes slideshow {
  from {
    bottom: -70px;
  }

  to {
    bottom: 10px;
  }
}
</style>
