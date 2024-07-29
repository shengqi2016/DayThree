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
import { ref } from "vue";
import { useQuasar } from "quasar";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsA57gTRgBUoF2qvHPKC3CKmNjgIsDcw0",
  authDomain: "bmi-program.firebaseapp.com",
  projectId: "bmi-program",
  storageBucket: "bmi-program.appspot.com",
  messagingSenderId: "316951727213",
  appId: "1:316951727213:web:b884d0605b6f1ac4624364",
  measurementId: "G-JJF5XKLC2K"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const password=ref("");
const email=ref("");
const $q = useQuasar();



async function onLogin() {
  console.log("Login attempt with email:", email.value); // Log the login attempt
  $q.loading.show();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log("Login successful:", user); // Log successful login
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
