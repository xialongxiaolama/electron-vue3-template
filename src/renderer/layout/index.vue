<template>
  <div class="w-screen h-screen flex diy-theme">
    <aside v-if="layoutStore.asideDisplay==='left'" class="w-16">
      <Aside></Aside>
    </aside>
    <main class="flex flex-col w-full h-full overflow-hidden">
      <Header v-if="layoutStore.headerDisplay" class="shrink-0"></Header>
      <Main class="w-full h-full">
        <Suspense>
          <template #fallback>
            页面加载中....
          </template>
          <router-view v-slot="{ Component, route }">
            <keep-alive :include="[]">
              <component
              :is="Component"
              :key="route.path"
              />
            </keep-alive>
          </router-view>
        </Suspense>
      </Main>
      <Footer v-if="layoutStore.footerDisplay" class="shrink-0 h-10 leading-10"></Footer>
    </main>
    <aside v-if="layoutStore.asideDisplay==='right'" class="w-16">
      <Aside></Aside>
    </aside>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup name="Layout">
import { Main, Aside, Header, Footer } from './index'
import useLayoutStore from '@renderer/store/app/layout';
import useThemeStore from '@renderer/store/app/theme'
import { Suspense } from 'vue';

const themeStore = useThemeStore()
const layoutStore = useLayoutStore()

</script>

<style lang="scss">
.diy-theme {
  --aside-bg: v-bind('themeStore.asideBg');
  --header-bg: v-bind('themeStore.headerBg');
  --main-bg: v-bind('themeStore.mainBg');
}

</style>
