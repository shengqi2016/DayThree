<template>
  <q-layout view="lHh Lpr lFf">
    <!-- 顶部导航栏 -->
    <q-header elevated>
      <q-toolbar>
        <!-- 汉堡菜单按钮 -->
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />

        <!-- 点击标题返回首页 -->
        <q-toolbar-title
          @click="Home"
          style="user-select: none; cursor: pointer"
        >
          Day Three
        </q-toolbar-title>

        <!-- 当前时间，放在右侧 -->
        <q-item-section side>
          <div class="text-caption" style="color: orange">{{ currentTime }}</div>
        </q-item-section>
      </q-toolbar>
    </q-header>

    <!-- 侧边栏 Drawer -->
    <q-drawer v-model="drawer" show-if-above side="left" bordered>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon name="bolt" />
          </q-item-section>
          <q-item-section>
            <q-item-label header>Quick Actions</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/" @click="drawer = false">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/Infp" @click="drawer = false">
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>Info Page</q-item-section>
        </q-item>

        <!-- <q-item clickable v-ripple to="/settings" @click="drawer = false">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item> -->
      </q-list>
    </q-drawer>

    <!-- 页面内容 -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const drawer = ref(false); // 控制侧边栏开关
const currentTime = ref(new Date().toLocaleTimeString());

// 更新时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString();
};

// 每秒更新时间
onMounted(() => {
  const interval = setInterval(updateTime, 1000);
  onUnmounted(() => {
    clearInterval(interval);
  });
});

// 返回首页
function Home() {
  router.push({ path: "/" });
}

defineOptions({
  name: "MainLayout",
});
</script>
