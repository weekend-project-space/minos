<template>
  <div class="desk" :style="style">
    <Bar :bar="bar" @click-close="onClose" @click-min="onMin" />
    <Apps v-model="deskApps" @lanuch-app="lanuchApp" />
    <Dock v-model="apps" @toggle-show-app="toggleShowApp" />
    <Window
      v-for="item in apps"
      :key="item.url"
      :title="item.title"
      :time="item.time"
      :url="item.url"
      :icon="item.icon"
      :meta="item.meta"
      v-model:min="item.min"
      v-model:full="item.full"
      @click-close="onClose(item)"
    >
      <component v-if="item.app" :is="item.app"></component>
      <template v-else-if="item.html">
        <div v-html="item.html"></div>
      </template>
    </Window>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useFetch, useUrlSearchParams } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { findIndexs } from "@/utils/commons";

import { useDeskStore } from "@/stores/desk";
import Window from "@/components/Window.vue";
import Bar from "./DesktopBar.vue";
import Apps from "./DesktopApps.vue";
import Dock from "./DesktopDock.vue";

const { bar, clearBar, setApps } = useDeskStore();
const { apps: deskApps } = storeToRefs(useDeskStore());
const apps = ref([]);
const backgroundImage = ref("/bg.jpg");
function lanuchApp(a) {
  if (apps.value.length > 5) {
    alert("最多打开6个app");
    return;
  }
  const appIndexs = findIndexs(apps.value, a);
  if (appIndexs.length < 1) {
    apps.value.push(
      Object.assign(
        {
          min: false,
          time: 0,
        },
        a
      )
    );
  } else {
    toggleShowApp(appIndexs[0], false);
  }
}

function toggleShowApp(i, min) {
  apps.value[i].min = min != undefined ? min : !apps.value[i].min;
  apps.value[i].time = new Date().getTime();
}
function onClose(a) {
  apps.value.splice(findIndexs(apps.value, a)[0], 1);
  clearBar();
}
const style = computed(() => {
  return `background-image:url(${backgroundImage.value})`;
});
onMounted(() => {
  async function loadData(fetch) {
    const deskStr = localStorage.getItem("desk");
    if (deskStr) {
      const d = JSON.parse(deskStr);
      setApps(d.apps);
      backgroundImage.value = d.bg;
    }
    if (fetch || !deskStr) {
      const { data } = await useFetch(params.s ? params.s : "/data/desk.json")
        .get()
        .json();
      setApps(data.value.apps);
      backgroundImage.value = data.value.bg;
      localStorage.setItem("desk", JSON.stringify(data.value));
    }
  }
  const params = useUrlSearchParams("history");
  watch(params, () => loadData(true));
  if (params.s) {
    loadData(true);
  } else {
    loadData();
  }
});
</script>

<style lang="less" scoped>
.desk {
  background-image: url("/bg.jpg");
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}
</style>
