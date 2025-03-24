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
          <div class="text-caption" style="color: orange">
            {{ currentTime }}
          </div>
        </q-item-section>

        <!-- 登录/登出按钮 -->
        <q-btn
          flat
          v-if="!isAuthenticated"
          label="Login"
          color="primary"
          text-color="white"
          @click="showLogin = true"
        />
        <q-btn
          flat
          v-else
          label="Logout"
          color="negative"
          @click="handleLogout"
        />
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

        <q-item to="/" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>首页</q-item-section>
        </q-item>
        <q-item to="/expense" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="receipt" />
          </q-item-section>
          <q-item-section>记账</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/purpop" @click="drawer = false">
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>Purpose</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/sellp" @click="drawer = false">
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>Selling List</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/hworkp" @click="drawer = false">
          <q-item-section avatar>
            <!-- <q-icon name="thumb_up" /> -->
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>Housework</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/findcal" @click="drawer = false">
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>CheckCal</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- 页面内容 -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- 登录对话框 -->
    <q-dialog v-model="showLogin">
      <q-card class="q-pa-md" style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="email" label="Email" filled />
          <q-input v-model="password" label="Password" filled type="password" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="negative" v-close-popup />
          <q-btn label="Login" color="primary" @click="handleLogin" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { auth } from '../router/firebase'
import { signInWithEmailAndPassword } from '../router/firebase'

const router = useRouter();
const uid=ref("");
const $q = useQuasar();
const drawer = ref(false);
const currentTime = ref(new Date().toLocaleTimeString());
const showLogin = ref(false);
const email = ref("");
const password = ref("");
const isAuthenticated = ref(localStorage.getItem("isAuthenticated") === "true");

// 更新时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString();
};

// 监听 localStorage 变化（跨 Tab 也能同步）
const handleStorageChange = () => {
  isAuthenticated.value = localStorage.getItem("isAuthenticated") === "true";
};

// 生命周期钩子
onMounted(() => {
  setInterval(updateTime, 1000);
  window.addEventListener("storage", handleStorageChange); // 监听 LocalStorage 变化
});
onUnmounted(() => {
  window.removeEventListener("storage", handleStorageChange);
});

// 返回首页
const Home = () => {
  router.push({ path: "/" });
};

// 处理用户登录
async function handleLogin() {
  console.log("login attempt with email:", email.value);
  $q.loading.show(); // 显示加载动画
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // ✅ 存入 localStorage 并更新 Vue 响应式变量
    localStorage.setItem("isAuthenticated", "true");
    isAuthenticated.value = true;

    const userid = userCredential.user.uid;
    console.log("Login successful with UID: ", userid);
    localStorage.setItem("UID",userid);


    // ✅ 关闭登录框，跳转页面
    showLogin.value = false;
    router.push("/hworkp");

    $q.loading.hide();
    $q.notify({
      icon: "done",
      position: "center",
      color: "positive",
      message: `Dear ${email.value}, Login Successfully!!!`,
    });
  } catch (error) {
    $q.loading.hide();
    console.error("Error in onLogin:", error);
    $q.notify({
      color: "negative",
      position: "center",
      message: error.message,
    });
  }
}

// 处理用户登出
const handleLogout = () => {
  localStorage.removeItem("isAuthenticated"); // ❌ 清除 LocalStorage
  isAuthenticated.value = false; // ✅ 让 Vue 监听状态变化
  email.value = ""; // ✅ 清空 email
  password.value = ""; // ✅ 清空密码
  router.push("/"); // 🔄 跳转回首页
  $q.notify({
      icon: "done",
      position: "center",
      color: "negative",
      message: `Log Out Successfully!!!`,
    });
    localStorage.setItem("UID",null);
};

</script>
