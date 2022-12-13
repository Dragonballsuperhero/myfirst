<template>
  <el-container>
  <el-header>
    <div>
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" size="medium" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <Aside></Aside>
    <Main></Main>
  </el-container>
  </el-container>
</template>

<script>
import  Aside from '@/components/Aside.vue';
import  Main from '@/components/Main.vue';
export default {
  components:{Aside,Main},
  name:'Header',
  methods: {
  logout() {
    // 清除token
    sessionStorage.clear();
    // 跳转登录页
    this.$router.push('/login');
  },
},
}
</script>

<style lang="less" scoped>
.el-container{
  height: 100%;
}
.el-header{
  background-color: rgb(11, 43, 40);
  padding-right: 0;
  font-size: 20px;
  color:white;
  display: flex;
  align-content: center;
 >div{
  flex: 1;
  line-height: 60px;
 }
 .el-button{
  height: 70%;
  margin-top: 10px;
 }
  }

</style>