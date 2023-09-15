<template>
  <div class="soft">
    <div class="tabs">
      <div
        class="tab"
        v-for="item in tabs"
        :key="item"
        :class="{ 'tab-active': active == item }"
        v-text="item"
        @click="active = item"
      ></div>
    </div>

    <div v-if="active == '自定义安装'" class="soure">
      <input type="text" v-model="url" placeholder="输入应用网址" />
      <input type="text" v-model="title" placeholder="输入应用名称" />
      <button class="btn" @click="fetchUrl">获取</button>
    </div>
    <div class="apps">
      <div class="app" v-for="app in apps" :key="app.title">
        <div class="app-info">
          <img :src="app.icon" alt="" />
          <div v-text="app.title"></div>
        </div>
        <button class="btn" @click="toggleInstallApp(app)">
          {{ btnText(app) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDeskStore } from "@/stores/desk";
import { computed, ref, watch } from "vue";
import { findIndexs } from "@/utils/commons";
import { useFetch } from "@vueuse/core";
const { setApps } = useDeskStore();
const { apps: installApps } = storeToRefs(useDeskStore());
const { data: allApps } = useFetch("/data/apps.json").get().json();

const tabs = ["浏览", "已安装", "自定义安装"];
const active = ref("浏览");
const app = ref({});
const title = ref("");
const url = ref("");
const apps = computed(() => {
  return active.value == "浏览"
    ? allApps.value
    : active.value == "已安装"
    ? installApps.value
    : app.value.title
    ? [app.value]
    : [];
});

function btnText(app) {
  return findIndexs(installApps.value, app).length > 0 ? "卸载" : "安装";
}

function toggleInstallApp(app) {
  if (findIndexs(installApps.value, app).length > 0) {
    unstallApp(app);
  } else {
    installApp(app);
  }
  setApps(installApps.value);
}

function unstallApp(app) {
  installApps.value.splice(findIndexs(installApps.value, app)[0], 1);
}
function installApp(app) {
  installApps.value.push(app);
}
watch(url, () => {
  title.value = url.value.split("//")[1].split("/")[0];
});
function fetchUrl() {
  app.value = {
    title: title.value,
    url: url.value,
    icon: url.value + "/favicon.ico",
  };
}
</script>

<style lang="less" scoped>
@import "../theme/var.less";
.soft {
  font-size: 14px;
}
.tabs {
  .bg();
  position: sticky;
  top: 0;
  padding: 0.8rem;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-gap: 1rem;
  justify-content: center;
  align-items: center;
  .tab {
    .bg();

    text-align: center;
    padding: 0.5rem;
    &:hover {
      cursor: pointer;
    }
  }
  .tab-active {
    color: #00f;
    filter: grayscale(50%);
  }
}
.apps {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 1rem;
  justify-content: center;
  overflow: auto;
  .app {
    .bg();
    padding: 1rem;
    border-radius: 0.5rem;
    .app-info {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-gap: 1rem;
    }
    img {
      border-radius: 0.5rem;
      width: 2rem;
      height: 2rem;
      filter: grayscale(50%); //brightness(300%);
    }
    .btn {
      margin-top: 0.5rem;
    }
  }
}
.soure {
  .bg();
  padding: 1rem;
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 60px;
  grid-gap: 1rem;
  input {
    line-height: 2rem;
    padding-inline-start: 1rem;
  }
}
.btn {
  .bg();
  border: none;
  color: #333;
  padding: 0.3rem 0.5rem;
  border-radius: 0.3rem;
  &:hover {
    cursor: pointer;
  }
}
</style>
