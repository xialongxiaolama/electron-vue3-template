<template>
    <div>
        <div v-for="(item,index) in keysArr" :key="item.key" class="flex justify-between px-2">
            <span>{{ item.description }}</span>
            <InputText :ref="`inputText${index}`" type="text" :placeholder="item.key" @change=""/>
        </div>
    </div>
</template>

<script setup name='Setting'>
// const { proxy } = getCurrentInstance()
// const router = useRouter()
// const route = useRoute()
const keysArr = ref([]);
ipcRenderer.invoke('get-all-shortcuts').then(res=>{
    console.log("res",res);
    keysArr.value = res
})
onUnmounted(()=>{
    console.log("销毁");
})
</script>

<style lang='scss' scoped>
    
</style>