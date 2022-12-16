<template>
  <el-aside :width="togglePX">
    <div class="toggle_btn" @click="(toggleCollapse=!toggleCollapse)">|||</div>
    <el-menu unique-opened 
     class="el-menu-vertical-demo" 
    background-color="#545c64" 
    text-color="#fff" 
    active-text-color="#409eff"
    :collapse="toggleCollapse"
    :collapse-transition="false"
    :default-active="activePath"
    router
    >
      <!-- 一级菜单 -->
      <el-submenu :index="list.id+''" v-for="list in menuList" :key="list.id">
        <template slot="title">
          <i :class="iconList[list.id]"></i>
          <span>{{list.authName}}</span>
        </template>
              <!-- 二级菜单 -->
        <el-menu-item @click="saveActiveState('/'+item.path)" :index="'/'+item.path" v-for="item in list.children" :key="item.id">
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.authName}}</span>
      </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>
<script>

export default {
  name:'Aside',
  data() {
    return {
      menuList: [],
      iconList:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-custom',
        '101':'el-icon-s-shop',
        '102':'el-icon-tickets',
        '145':'el-icon-s-data'
    },
    toggleCollapse:false,
    activePath:''
      
    };
  },
  created(){
    this.getMenuList();
    this.activePath = sessionStorage.getItem('key');
  },
  methods: {
   async getMenuList() {
    const {data:res} = await this.$http.get('menus');
    this.menuList = res.data;
    if(res.meta.status!==200)return this.$message.error(res.meta.msg);
    },
    saveActiveState(val){
      sessionStorage.setItem('key',val);
      this.activePath = val
    }
  },
  computed: {
    togglePX() {
      return this.toggleCollapse?'65px':'200px';
    },
  
  },

}
</script>

<style lang="less" scoped>
.el-aside{
  background-color: #545c64;
}
.el-menu{
  border-right: 0;
}
.toggle_btn{
  background-color: rgb(112, 112, 112);
  text-align: center;
  line-height: 20px;
  font-size: 10px;
  cursor: pointer;
  letter-spacing: 3px;
}
</style>