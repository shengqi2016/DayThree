<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title @click="Home" style="user-select: none">
          Day Three
        </q-toolbar-title>
        <div v-if="isAuthenticated"> <!-- 仅在用户登录时显示 -->
          <q-btn color="teal" @click="logout">
            <div>LOG OUT</div>
          </q-btn>
        </div>
      </q-toolbar>
      <div>Time: {{ currentTime }}</div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentTime = ref(new Date().toLocaleTimeString());
const isAuthenticated = ref(false); // 用于跟踪用户是否登录

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString();
};

onMounted(() => {
  const interval = setInterval(updateTime, 1000); // 每秒更新一次时间
  onUnmounted(() => {
    clearInterval(interval); // 清除定时器
  });

  // 检查用户是否已登录
  isAuthenticated.value = localStorage.getItem("isAuthenticated") === "true";
});

function Home() {
  router.push({ path: "/" });
}

function logout() {
  localStorage.setItem("isAuthenticated", "false"); // 退出
  isAuthenticated.value = false; // 更新登录状态
  router.push({ path: "/" });
}

defineOptions({
  name: "MainLayout",
});
</script>
