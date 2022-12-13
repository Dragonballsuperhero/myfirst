<template>
  <div>
     <!-- 用户导航区域 -->
      <Nav>
        <template #homePage>首页</template>
        <template #context1>用户管理</template>
        <template #context2>用户列表</template>
      </Nav>
<!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
          <el-col :span="8">
            <!-- 搜索框 -->
            <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getUserList">
              <!-- 搜索按钮 -->
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
          <el-col :span="6"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" style="width: 100%" stripe border>
      <el-table-column type=index label="#" width="180"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态">
        <!-- 状态按钮 -->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state"
          @change="getnewStatus(scope.row)">
        </el-switch>
        </template>
      </el-table-column>
      <!-- 操作区域 -->
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
        <!-- 编辑按钮 -->
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUserInfo(scope.row.id)"></el-button>
        <!-- 删除按钮 -->
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserInfo(scope.row.id)"></el-button>
        <!-- 文字提示 -->
        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
          <!-- 分配角色 -->
          <el-button type="warning" size="mini" icon="el-icon-setting" @click="getRoles(scope.row)"></el-button>
        </el-tooltip>
      </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      @close="closeDialog"
      :visible.sync="dialogVisible" width="60%">
      <!-- 表单 -->
    <el-form status-icon :model="addUserForm" :rules="userRules" ref="formRef" label-width="100px">
      <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
      </el-form-item>
  </el-form>
      <!-- 取消和确认按钮 -->
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑用户信息对话框 -->
<el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible" width="30%"
        @close="closeEditDialog">
        <!-- 表单 -->
      <el-form status-icon ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="80px">
        <el-form-item prop="username" label="姓名">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
       </el-form-item>
       <el-form-item prop="email" label="邮箱">
            <el-input v-model="editForm.email"></el-input>
       </el-form-item>
       <el-form-item prop="mobile"  label="电话">
            <el-input v-model="editForm.mobile"></el-input>
       </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editComplate">确 定</el-button>
        </span>
      </el-dialog>
  </el-card>
  <!-- 分配角色对话框 -->
  <el-dialog
  title="分配角色"
  :visible.sync="roleDialogVisible"
  width="30%">
  <p><span>用户名:&nbsp;</span>{{userInfo.username}}</p>
  <p><span>角色:&nbsp;</span>{{userInfo.role_name}}</p>
  <!-- 选项框 -->
  <p>
    <el-select v-model="roleId" placeholder="请选择">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </p>
  <!-- 按钮 -->
  <span slot="footer">
    <el-button @click="roleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifyRole">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import Nav from '@/components/Nav/Nav.vue'
export default {
  name:'Users',
  components:{Nav},
  data() {
     // 自定义校验规则
    var checkEmail = (rule, value, cb)=>{
        // 验证邮箱
        var regemail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if(regemail.test(value)){
         return cb();
        }  
        cb(new Error('格式有误'));  
      };
    var checkMobile = (rule, value, cb) =>{
      // 验证手机号
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if(regMobile.test(value)){
        return cb();
      };
      cb(new Error('格式有误')); 
    };
    return {
      total:0,  // 总人数
      dialogVisible:false, //添加用户对话框是否显示
      editDialogVisible:false, //修改用户对话框是否显示
      roleDialogVisible:false, //分配角色对话框是否显示
      queryInfo:{   //获取用户列表的请求参数
        query:'',
        pagenum:1,
        pagesize:5
      },
      userList: [], // 用户列表
      addUserForm:{ //需要添加的用户字段
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      editForm:{//编辑用户
        id:'',
        email:'',
        mobile:'',
      },  
      userInfo:{},//用户信息
      roleList:{},//所有角色列表
      roleId:'',//角色id
      userRules:{ //添加表单的验证规则
        username:[
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        email:[
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {validator:checkMobile,trigger:'blur'}
        ],
      },
      editFormRules:{ //编辑用户表单验证规则
        email:[
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {validator:checkMobile,trigger:'blur'}
        ],
      }  
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
   async getUserList() {
      // 请求用户列表
    const {data:res} =  await this.$http.get('users',{params:this.queryInfo});
    this.total = res.data.total;
    this.userList = res.data.users;
    // console.log(res);
    },
    // 监听 pagesize 的变化
  handleSizeChange(newSize){
    // 将最新的newSize的值赋给pagesize，然后重新发起请求
    this.queryInfo.pagesize = newSize;
    this.getUserList();
  },
  // 监听页数的变化
  handleCurrentChange(newPage){
     // 将最新的newPage的值赋给pagenum，然后重新发起请求
     this.queryInfo.pagenum = newPage;
     this.getUserList();
  },
  // 监听状态按钮最新的状态
 async getnewStatus(userlist){
    // 当用户的状态发生改变时，发起请求用户的状态
    const {data:res} = await this.$http.put(`users/${userlist.id}/state/${userlist.mg_state}`)
      this.notification(res,'用户状态更新失败','用户状态更新成功',200);
    },
    // 当对话框关闭后清空表单的所有数据
    closeDialog(){
      this.$refs.formRef.resetFields();
    },
    // 添加用户
    addUser(){
      this.$refs.formRef.validate(async vail=>{
        if(!vail) return;
        const {data:res} = await this.$http.post('users',this.addUserForm);
        this.notification(res,'用户创建失败','用户创建成功',201);
         // 关闭对话框
         this.dialogVisible = false;
         //更新页面的数据
         this.getUserList(); 
      });
    },
    //编辑用户信息
   async editUserInfo(id){
       //显示对话框
      this.editDialogVisible = true;
      // 根据id获取到相对应的用户信息
      const {data:res} =  await this.$http.get('users/'+id);
      this.editForm = res.data;
  },
  // 监听编辑对话框
  closeEditDialog(){
    this.$refs.editFormRef.resetFields();
  },
  // 提交编辑的结果
  editComplate(){
  // 预验证表单
    this.$refs.editFormRef.validate(async vali =>{
      if(!vali)return
      const {data:res} =  await this.$http.put('users/'+this.editForm.id,
      {email:this.editForm.email,mobile:this.editForm.mobile}); 
     this.notification(res,'修改用户信息失败','修改用户信息成功',200);
    // 关闭对话框
    this.editDialogVisible = false;
    // 更新页面的数据
    this.getUserList();
    });
  },
  // 删除用户信息
 async removeUserInfo(id){
   const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
        const {data:res} =  await this.$http.delete('users/'+id);
        this.notification(res,'删除用户失败','删除用户成功',200);
        this.getUserList();
      }
    },
    // 获取所有的角色
   async getRoles(roles){
      // 拿到用户的信息，存入data里
      this.userInfo = roles;
      //获取角色列表
      const {data:res} = await this.$http.get('roles');
      if(res.meta.status!==200)return;
      this.roleId = res.data.id
      this.roleList = res.data;
      this.roleDialogVisible = true; 
    },
    // 修改角色
   async modifyRole(){
     if(!this.roleId){
        this.$message.error('请选择角色');
        return;
     }
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{'rid':this.roleId});
      this.notification(res,'修改用户角色失败','修改用户角色成功',200);
        this.getUserList();
        this.roleDialogVisible = false;
      },

 },
}
</script>

<style lang="less" scoped>

</style>