<template>
  <!-- 面包屑导航 -->
   <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }"><slot name="homePage"></slot></el-breadcrumb-item>
    <el-breadcrumb-item><a href="#"><slot name="context1"></slot></a></el-breadcrumb-item>
    <el-breadcrumb-item><slot name="context2"></slot></el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name:'Nav'
}
</script>

<style>

</style>