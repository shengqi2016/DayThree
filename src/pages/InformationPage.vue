<template>
  <div>
    <h1>{{ title }}</h1>
    <p v-if="showMessage">{{ message }}</p>
    <button @click="toggleMessage">Toggle Message</button>
  </div>
</template>

<script setup>
</script>

