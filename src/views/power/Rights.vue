<template>
  <div>
    <Nav>
        <template #homePage>首页</template>
        <template #context1>权限管理</template>
        <template #context2>权限列表</template>
      </Nav>
      <el-card>
        <el-table :data="rightList" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
              <template slot-scope="scope">
              <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
              <el-tag type="success" v-else-if="scope.row.level==='1'">标签二</el-tag>
              <el-tag type="warning" v-else>标签三</el-tag>
            </template>
            </el-table-column>
        </el-table>
      </el-card>
  </div>
</template>

<script>
import Nav from '@/components/Nav/Nav.vue'
export default {
  name:'Rights',
  components:{Nav},
  data() {
    return {
      rightList : [],
    };
  },
  created(){
    this.getRightList();
  },
  methods: {
    //获取权限列表
   async getRightList() {
      const {data:res} = await this.$http.get('rights/list');
        this.notification(res,'请求用户权限列表失败','请求用户权限列表成功',200);
        this.rightList = res.data;
    },
  },
}
</script>

<style lang="less" scoped>

</style>