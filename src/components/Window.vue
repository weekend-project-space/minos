<template>
  <div
    v-if="fullwarpClass && winPre"
    :class="fullwarpClass"
    :style="fullstyle"
  ></div>
  <div v-if="winPre" class="desk-warp" :style="fullstyle"></div>
  <div
    class="window"
    :class="{ 'window-hide-bar': props.full }"
    v-show="!props.min"
    ref="win"
    :style="style"
  >
    <div class="window-bar">
      <div class="w-bar" ref="winbar">
        <div class="bar-title" v-show="!props.full">
          <!-- <img class="icon" :src="props.icon" alt="" /> -->
          <!-- {{ props.title }} -->
        </div>
        <div v-show="!props.full">{{ props.title }}</div>
      </div>
      <div class="w-btns">
        <span class="w-btn" @click.stop="min">
          <img src="../assets/icon/ios-remove.svg" alt="" />
        </span>
        <span class="w-btn" @click.stop="toggleFull">
          <img src="../assets/icon/ios-square-outline.svg" alt="" />
        </span>
        <span class="w-btn" @click.stop="clickClose">
          <img src="../assets/icon/ios-close.svg" alt="" />
        </span>
      </div>
    </div>
    <div
      class="window-body"
      v-show="!barPressed && !isResize && !loading"
      @click="top"
    >
      <slot>
        <iframe
          class="window-frame"
          :style="'height:' + (height - 38) + 'px'"
          :src="props.url"
          frameborder="0"
        ></iframe>
      </slot>
    </div>
    <div class="window-tran" v-if="barPressed || isResize || loading">
      <img :src="props.icon" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  useResizeObserver,
  useDraggable,
  useMousePressed,
  useMouse,
  useIntervalFn,
} from "@vueuse/core";
import { useDeskStore } from "@/stores/desk";
import { debounce } from "@/utils/commons";

const props = defineProps({
  title: String,
  url: String,
  icon: String,
  time: Number,
  full: { type: Boolean, default: () => false },
  min: { type: Boolean, default: () => false },
});

const emit = defineEmits(["update:min", "update:full", "clickClose"]);

const { autoIncrementZ } = useDeskStore();

const winbar = ref();
const win = ref();
const zindex = ref(0);
const width = ref(window.innerWidth > 1180 ? 1180 : "100vw");
const height = ref(
  window.innerHeight > 760 ? 760 : "calc(100vh - var(--bar-height))"
);

const isResize = ref(false);

let isFull = false;
let tmpWidht = 0;
let tmpHeight = 0;
let tmpX = 0;
let tmpY = 0;
const {
  x,
  y,
  style: tmpstyle,
} = useDraggable(winbar, {
  initialValue: {
    x: (window.innerWidth - width.value) / 2,
    y: (window.innerHeight - height.value) / 2,
  },
  preventDefault: false,
});
const { x: mx, y: my } = useMouse();
const { pressed: winPre } = useMousePressed({ target: win });
const { pressed: barPressed } = useMousePressed({ target: winbar });
const loading = ref(true);
onMounted(() => {
  function top() {
    autoIncrementZ(zindex, { icon: props.icon, title: props.title });
  }
  top();
  if (props.full && !isFull) {
    toFull();
  }
  setTimeout(() => {
    loading.value = false;
  }, 1000);

  const changeResize = debounce((entry) => {
    const { width: w, height: h } = entry.contentRect;
    width.value = w;
    height.value = h;
  }, 100);
  useResizeObserver(win, (entries) => {
    const entry = entries[0];
    if (winPre.value) {
      changeResize(entry);
    }
  });
  const toFull = debounce(() => {
    isFull = true;
    full();
  }, 100);
  const toExiTFull = () => {
    if (isFull) {
      exitFull();
      isFull = false;
    }
  };
  const toLeft = debounce(() => {
    isFull = true;
    logInfo();
    width.value = "50vw";
    height.value = "calc(100vh  - var(--bar-height))";
    x.value = 0;
    y.value = 30;
  }, 100);
  const toRight = debounce(() => {
    isFull = true;
    logInfo();
    width.value = "50vw";
    height.value = "calc(100vh  - var(--bar-height))";
    x.value = window.innerWidth / 2;
    y.value = 30;
  }, 100);
  watch(props, () => {
    if (!props.min) {
      top();
    }
    if (props.full && !isFull) {
      toFull();
    }
  });
  watch(height, () => {
    nextTick(() => {
      if (win.value.clientHeight + 36 > window.innerHeight) {
        setFull(true);
      } else {
        setFull(false);
      }
    });
  });
  watch(winPre, () => {
    top();
    if (winPre.value) {
      const right = x.value + width.value;
      const bottom = y.value + height.value;
      const inR = right > mx.value && mx.value > right - 20;
      const inB = bottom > my.value && my.value > bottom - 20;
      isResize.value = winPre.value && inR && inB;
    } else {
      isResize.value = false;
    }
  });
  watch(barPressed, () => {
    if (barPressed.value) {
      if (isFull) {
        toExiTFull();
      }
    } else {
      if (my.value < 30) {
        toFull();
      } else if (mx.value < 10) {
        toLeft();
      } else if (mx.value > window.innerWidth - 10) {
        toRight();
      }
    }
  });
});
const min = () => {
  emit("update:min", true);
};
const setFull = (b) => {
  emit("update:full", b);
};
const clickClose = () => {
  emit("clickClose");
};
function logInfo() {
  tmpX = x.value;
  tmpY = y.value < 50 ? 50 : y.value;
  tmpWidht = width.value;
  tmpHeight = height.value;
}
let clickToggleFull = false;
const toggleFull = () => {
  clickToggleFull = true;
  if (isFull) {
    exitFull();
  } else {
    full();
  }
  clickToggleFull = false;
  isFull = !isFull;
};
const full = () => {
  logInfo();
  width.value = "100vw";
  height.value = "calc(100vh - var(--bar-height))"; //window.innerHeight - 70;
  x.value = 0;
  y.value = 30;
};
const exitFull = () => {
  if (clickToggleFull) {
    x.value = tmpX;
    y.value = tmpY;
  }
  width.value = tmpWidht;
  height.value = tmpHeight;
};
const style = computed(() => {
  const autoPx = (v) => (isNaN(v.value) ? v.value : v.value + "px");
  return `width:${autoPx(width)};height:${autoPx(height)};${
    tmpstyle.value
  };z-index: ${zindex.value + 1};`;
});
const fullstyle = computed(() => {
  return `z-index: ${zindex.value + 1};`;
});
const fullwarpClass = computed(() => {
  if (my.value < 30) {
    return "full-warp ";
  } else if (mx.value < 10) {
    return "full-left-warp";
  } else if (mx.value > window.innerWidth - 10) {
    return "full-right-warp";
  } else {
    return undefined;
  }
});
</script>
<style lang="less" scoped>
.bg() {
  background-color: var(--bg);
  backdrop-filter: blur(5px);
}
.window {
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: 36px auto;
  position: absolute;
  border-radius: 0.5rem;
  resize: both;
  overflow: hidden;
  .bg();
}
.window-hide-bar {
  grid-template-rows: 20px 1fr;
  .window-bar {
    padding: 0;
    background: transparent;
    backdrop-filter: none;
  }
}
.window-bar {
  display: grid;
  grid-template-columns: 1fr 120px;
  padding: 0.5rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  user-select: none;
  box-sizing: border-box;
  font-size: 14px;
  .bg();
}
.w-bar {
  display: grid;
  grid-template-columns: 120px 1fr;
  > :last-child {
    text-align: center;
  }
}
.w-btns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.w-btn {
  cursor: pointer;
  margin-left: 1rem;
  // background: #ccc;
  border-radius: 50%;
  color: #000;
  width: 1.2rem;
  height: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
  &:hover {
    .bg();
  }
  img {
    width: 1rem;
    height: 1rem;
  }
  &:last-child {
    img {
      margin-top: -2px;
      width: 1.3rem;
      height: 1.3rem;
    }
  }
}
.window-body {
  min-height: calc(100% - 35px);
  min-width: 100%;
}
.window-frame {
  min-width: 100%;
  min-height: 100%;
}
.window-tran {
  min-height: 100%;
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .bg();
  img {
    height: 5rem;
    width: 5rem;
    border-radius: 0.5rem;
  }
}
.desk-warp {
  position: absolute;
  top: 0rem;
  min-height: 100vh;
  width: 100vw;
}
.full-warp {
  position: absolute;
  top: calc(var(--bar-height) + 1rem);
  left: 1rem;
  right: 1rem;
  min-height: calc(100vh - var(--bar-height) - 2rem);
  width: calc(100vw - 2rem);
  border-radius: 0.5rem;
  .bg();
}
.full-left-warp {
  position: absolute;
  top: calc(var(--bar-height) + 1rem);
  left: 1rem;
  min-height: calc(100vh - var(--bar-height) - 2rem);
  width: calc(50vw - 2rem);
  border-radius: 0.5rem;
  .bg();
}
.full-right-warp {
  position: absolute;
  top: calc(var(--bar-height) + 1rem);
  right: 1rem;
  min-height: calc(100vh - var(--bar-height) - 2rem);
  width: calc(50vw - 2rem);
  border-radius: 0.5rem;
  .bg();
}
.bar-title {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}
</style>
