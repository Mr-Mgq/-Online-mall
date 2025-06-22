<!-- src/App.vue -->
<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
body {
  margin: 0;
  font-family: 'Helvetica Neue', sans-serif;
  background-color: #f9f9f9;
}

a {
  text-decoration: none;
  color: #3498db;
}
</style>
