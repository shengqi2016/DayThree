<template>
  <q-page class="flex justify-center">
    <div class="column items-center q-pa-md">
      <!-- 登录表单 -->
      <q-form class="q-pa-md" @submit.prevent="onLogin" style="max-width: 300px; width: 100%;">
        <q-input v-model="email" label="Email" type="email" filled class="q-mb-md" />
        <q-input v-model="password" label="Password" type="password" filled class="q-mb-md" />
        <q-btn type="submit" label="Login" color="primary" class="full-width" />
      </q-form>

      <!-- 任务展示区 -->
      <q-card class="q-mt-md" style="max-width: 300px; width: 100%;">
        <q-card-section>
          <div class="text-h6">任务列表</div>
        </q-card-section>

        <q-card-section v-if="tasks.length">
          <q-list bordered separator>
            <q-item v-for="(task, index) in tasks" :key="index">
              <q-item-section>
                <q-item-label>{{ task.name }}</q-item-label>
                <q-item-label caption>{{ task.date }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section v-else>
          <div class="text-center text-grey">暂无任务</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { auth, signInWithEmailAndPassword } from "src/router/firebase.js";

const router = useRouter();
const $q = useQuasar();
const password = ref("");
const email = ref("");

// 任务列表（示例数据）
const tasks = ref([
  { name: "扫地", date: "2025-02-21" },
  { name: "洗衣服", date: "2025-02-22" },
  { name: "买菜", date: "2025-02-23" }
]);

async function onLogin() {
  console.log("Login attempt with email:", email.value);
  $q.loading.show();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log("Login successful:", user);
    localStorage.setItem("isAuthenticated", "true");
    router.push({ path: "/Infp" });
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
</script>
