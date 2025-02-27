<template>
    <div class='layout-aside'>
       <div v-for="menuItem in layout[0].children" :key="menuItem.path">
            <router-link :to="menuItem.children[0].name">{{ menuItem.children[0].name }}</router-link>
       </div>
    </div>
</template>

<script setup name='Aside'>
import layout from '@/router/layout'

console.log("router",layout);
    
</script>

<style lang='scss' scoped>
.layout-aside{
    background-color: var(--aside-bg);
}
</style>