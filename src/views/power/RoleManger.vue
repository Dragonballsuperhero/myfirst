<template>
  <div>
    <el-row :class="['border_bottom',i1===0?'border_top':'','vcenter']" v-for="item1,i1 in roles.children" :key="item1.id">
       <!-- 第一层 -->
      <el-col :span="6">
          <el-tag closable @close="romoveTag(roles,item1.id)">{{item1.authName}}</el-tag>
          <i class="el-icon-caret-right"></i>
        </el-col>
        <el-col :span="18">
        <!-- 第二层 -->
        <el-row :class="[i2===0?'':'border_top','vcenter']" v-for="item2,i2 in item1.children" :key="item2.id">
          <el-col :span="6">
            <el-tag type="success" closable @close="romoveTag(roles,item2.id)">{{item2.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <!-- 第三层 -->
          <el-col :span="18">
            <el-row v-for="item3 in item2.children" :key="item3.id">
                <el-col :span="24">
            <el-tag type="warning" closable @close="romoveTag(roles,item3.id)">{{item3.authName}}</el-tag>
                </el-col>
            </el-row>
          </el-col>
        </el-row>
        </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name:'RoleManger',
  data() {
    return {
      treeDialogVisible: false,
    };
  },
  props:{
    roles:{
      type:Object,
      default:{}
    }
  },
  methods: {
  async romoveTag(roles,rightsId) {
    const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).catch(err=>err);
      if(result==='cancel'){
        this.$message({
            type: 'info',
            message: '已取消删除'
          });
      }else{
        const {data:res} = await this.$http.delete(`roles/${roles.id}/rights/${rightsId}`);
        this.notification(res,'删除权限失败','删除权限成功',200);
       roles.children = res.data;    
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
  font-size: 15px;
}
.border_top{
  border-top: 1px solid rgba(128, 128, 128, 0.5);
}
.border_bottom{
  border-bottom: 1px solid rgba(128, 128, 128, 0.5);
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>