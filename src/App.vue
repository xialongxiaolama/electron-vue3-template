<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
const router = useRouter()
const token = localStorage.getItem('token')
if(!token){
  router.push('/login')
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
