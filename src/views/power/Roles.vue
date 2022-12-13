<template>
  <div>
    <!-- 导航区域 -->
    <Nav>
      <template #homePage>首页</template>
      <template #context1>权限管理</template>
      <template #context2>角色列表</template>
    </Nav>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色按钮 -->
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="rolesList" border stripe>
            <!-- 下拉键 -->
            <el-table-column label="#" type="expand">
              <template slot-scope="scope">
                  <!-- 下拉内容在RoleManger组件 -->
              <RoleManger :roles="scope.row"></RoleManger>
              </template>
            </el-table-column>
            <!-- 索引键 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作">
              <!-- 操作按钮 -->
              <template scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRolesById(scope.row.id)">编辑</el-button>
                <el-button type="danger"  size="mini"  icon="el-icon-delete" @click="removeRoleInfo(scope.row.id)">删除</el-button>
                <el-button type="warning" size="mini" icon="el-icon-setting" @click="getTreeRightList(scope.row)">分配角色</el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
        title="添加角色" :visible.sync="addDialogVisible" width="45%"
        @close="addCloseDialog">
        <!-- 表单 -->
        <el-form status-icon :model="addRolesForm" :rules="rolesRules" ref="addFormRef" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
      </el-form-item>
      </el-form>
      <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
</el-dialog>

<!-- 编辑角色对话框 -->
<el-dialog
        title="添加角色" :visible.sync="editDialogVisible" width="45%"
        @close="editCloseDialog">
        <!-- 表单 -->
        <el-form status-icon :model="editRolesForm" :rules="rolesRules" ref="editFormRef" label-width="100px">
      <el-form-item  label="角色名称" prop="roleName">
          <el-input disabled v-model="editRolesForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
      </el-form-item>
      </el-form>
      <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoles">确 定</el-button>
  </span>
</el-dialog>
<!-- 树形权限结构 -->
<el-dialog
        title="分配权限" :visible.sync="treeDialogVisible" width="45%"
        @close="resetArr">
        <!-- 树形控件 -->
        <el-tree ref="treeRef" :data="treeRightList" :props="treeRightField" show-checkbox 
        node-key="id" default-expand-all :default-checked-keys="check_key"></el-tree>
      <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
    <el-button @click="treeDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="getCurrentId">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import Nav from '@/components/Nav/Nav.vue'
import RoleManger from '@/views/power/RoleManger.vue'
export default {
  name:'Roles',
  components:{Nav,RoleManger},
  data() {
    return {
      rolesList: [],//所有的角色列表
      addDialogVisible:false,//控制添加角色对话框是否显示
      editDialogVisible:false,//控制编辑角色对话框是否显示
      treeDialogVisible: false,//控制树形权限结构对话框是否显示
      addRolesForm:{   //添加表单进行双向绑定
        roleName:'',
        roleDesc:''
      },
      check_key:[],//默认选中的复选框
      editRolesForm:{},//编辑表单的数据
      treeRightList:[],//树形控件绑定的列表
      treeRightField:{ //树形控件绑定的属性
        children:'children',
        label:'authName'
      },
      roleId:'',//当前角色的id
      rolesRules:{ //添加角色表单的验证规则
        roleName:[
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc:[
        { required: true, message: '角色描述', trigger: 'blur' },
        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],   
      }
    };
  },
  
  created(){
    this.getRolesList();
  },
  methods: {
    // 获取所有的角色
   async getRolesList() {
      const {data:res} = await this.$http.get('roles');
      this.notification(res,'请求角色列表失败','请求角色列表成功',200);
      this.rolesList = res.data;
    },
    // 当对话框关闭后清空表单的所有数据
    addCloseDialog(){
      this.$refs.addFormRef.resetFields();
    },
    editCloseDialog(){
      this.$refs.editFormRef.resetFields();
    },
    // 发起请求添加角色
    addRoles(){
      //预验证
      this.$refs.addFormRef.validate(async vali=>{
        if(!vali)return;
        const {data:res} = await this.$http.post('roles',this.addRolesForm)
        this.notification(res,'创建角色失败','创建角色成功',201);
        this.getRolesList();
        this.addDialogVisible = false;
      });
    },
    //根据用户的id拿到对应的数据
   async editRolesById(id){
     const {data:res} = await this.$http.get('roles/'+id);
      // 获取到数据存入editRolesForm
     this.editRolesForm =  res.data;
     this.editDialogVisible = true;
    },
    //编辑角色
    editRoles(){
      this.$refs.editFormRef.validate(async vali=>{
        if(!vali)return;
        const {data:res} = await this.$http.put('roles/'+this.editRolesForm.roleId,
        {roleName:this.editRolesForm.roleName,roleDesc:this.editRolesForm.roleDesc});
        this.notification(res,'编辑角色失败','编辑角色成功',200);
        this.getRolesList();
        this.editDialogVisible = false;
        console.log(res);
      });
    },
      // 删除用户信息
 async removeRoleInfo(id){
   const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).catch(err=>err);
        // 用户点击取消按钮返回的是cancel
        // 用户点击确认按钮返回的是confirm
      if(result==='cancel'){
        this.$message({
            type: 'info',
            message: '已取消删除'
          });
      }else{
        //确认删除
        const {data:res} =  await this.$http.delete('roles/'+id);
        this.notification(res,'删除角色失败','删除角色成功',200);
        this.getRolesList();
      }
    },
    // 当对话框关闭时，会清空check_key这个数组
    resetArr(){
      this.check_key = [];
    },
    // 定义一个递归函数拿到角色的所有三级权限
    getRoleThreeRights(node,arr){
      //判断此节点是否有children属性
      if(!node.children){
        return arr.push(node.id);
      };
      
      node.children.forEach(item => {
        this.getRoleThreeRights(item,arr);
      });

    },
    //获取tree权限列表
   async getTreeRightList(roles){
      this.treeDialogVisible = true;
      const {data:res} = await this.$http.get('rights/tree');
      this.treeRightList =  res.data;
      //调用递归函数拿到所有的三级权限
      this.getRoleThreeRights(roles,this.check_key);
      this.roleId = roles.id;
    },
    // 获取被选中的节点和半节点
   async getCurrentId(){
      const keys =[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const key = keys.join(',');
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{'rids':key});
      this.notification(res,'权限更新失败','权限更新成功',200);
      this.getRolesList();
      this.treeDialogVisible = false;
    }
  },
}
</script>

<style>

</style>