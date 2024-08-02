<template>
  <q-page class="flex justify-center">
    <q-form class="q-pa-md" @submit.prevent="onLogin" >
      <q-input
        v-model="email"
        label="Email"
        type="email"
        filled
        class="q-mb-md"
      />
      <q-input
        v-model="password"
        label="Password"
        type="password"
        filled
        class="q-mb-md"
      />
      <q-btn type="submit" label="Login" color="primary" />
    </q-form>
  </q-page>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRouter } from 'vue-router';
import { useQuasar } from "quasar";
import {auth,signInWithEmailAndPassword} from 'src/router/firebase.js'
const password=ref("");
const email=ref("");
const $q = useQuasar();
const router = useRouter();

async function onLogin() {
  console.log("Login attempt with email:", email.value); // Log the login attempt
  $q.loading.show();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log("Login successful:", user); // Log successful login
    localStorage.setItem('isAuthenticated', 'true'); // 保存认证状态
    router.push({ path: '/Infp' }); // 登录成功后跳转到 Infp 页面
    $q.loading.hide();
    $q.notify({
      icon: "done",
      position: "center",
      color: "positive",
      message: `Dear ${email.value}, Login Successfully!!!`,
    });
  } catch (error) {
    $q.loading.hide();
    console.error("Error in onLogin:", error); // Log error details
    $q.notify({
      color: "negative",
      position: "center",
      message: error.message,
    });
  }
}


</script>
