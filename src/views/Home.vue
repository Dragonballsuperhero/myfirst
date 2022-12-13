<template>
  <div class="home-container">
    <Header></Header>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
name:'Home',
components: {Header},
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
</style>