<template>
  <div>
    <Nav>
      <template #homePage>首页</template>
      <template #context1>商品管理</template>
      <template #context2>商品分类</template>
    </Nav>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDiglog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="font" :data="cateList" :columns="columns"
      show-index :selection-type="false" :expand-type="false"
      stripe border>
      <!--是否有效 -->
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-check" v-if="scope.row.cat_deleted===false" style="color:green"></i>
        <i class="el-icon-close" v-else style="color:red"></i>
      </template>
      <!-- 等级 -->
      <template slot="level"  slot-scope="scope">
        <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
        <el-tag v-else type="warning">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="action" slot-scope="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
        <!-- 删除按钮 -->
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCate(scope.row.cat_id)"></el-button>
      </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="35%" @close="closeAddDialog">
      <!-- 添加表单 -->
      <el-form ref="addFromRef" :model="addFrom"
      status-icon
       label-width="80px" :rules="fromRul">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input  v-model="addFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父类名称">
          <!-- 级联文本框 -->
          <el-cascader
              v-model="selectItem"
              :options="parentCateList"
              :props="cascaderProps"
              clearable
              change-on-select
              @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑分类名称对话框 -->
<el-dialog
  title="提示"
  :visible.sync="editDialogVisible"
  width="30%">
  <!-- 表单 -->
  <el-form :model="editForm" status-icon :rules="fromRul" ref="editFormRef" label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editForm.cat_name" autocomplete="off"></el-input>
  </el-form-item>
  </el-form>
  <!-- 按钮 -->
  <span slot="footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import Nav from '@/components/Nav/Nav.vue';
export default {
  name:'Cate',
  components:{Nav},
  data() {
    return {
      cateList: [],//商品分类的列表
      queryInfo:{ //商品分类的列表的请求的参数
        type:3,
        pagenum:1,
        pagesize:4
      },
      total:0,//商品分类总数

      addDialogVisible:false,//控制添加分类对话框是否显示
      editDialogVisible:false,//编辑分类名称对话框是否显示
      columns:[ // 表格每一列的标签名和属性
        {
          label:'商品名称',
          prop:'cat_name'
        },{
          // 自定义列模版
          label:'是否有效',
          type:'template',
          template:'isok'
        },{
          // 自定义列模版
          label:'等级',
          type:'template',
          template:'level'
        },{
          // 自定义列模版
          label:'操作',
          type:'template',
          template:'action'
        }
      ],
      addFrom:{ //添加分类表单绑定的数据
        cat_pid:0,
        cat_name:'',
        cat_level:0
      },
      fromRul:{//表单验证规则
        cat_name:[
        { required: true, message: '请输入分类名称', trigger: 'blur' },
      ]
      },
      // 父类分类列表
      parentCateList:[],
      //级联选择器的配置对象
      cascaderProps: {
          value:'cat_id',
          label:'cat_name',
          children:'children',
          expandTrigger: 'hover'
        },    
        // 被选中的父类ID
        selectItem:[],
        //与编辑分类名称表单绑定的数据
        editForm:{
          cat_name:''
        },
        // 当前要被修改的id
        editId:'',
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类的列表
   async getCateList() {
      const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
      if(res.meta.status!==200){
        return;
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //当页面需要显示数量发生改变时触发
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      this.getCateList();   
    },
    //切换页面时触发
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage;
      this.getCateList();   
    },
    //显示添加分类对话框
    showAddDiglog(){
      //先拿到父级分类的数据
      this.getParentCate();
      this.addDialogVisible = true;
    },
    // 获取父级分类的数据
   async getParentCate(){
     const {data:res}  = await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status!==200){
        return;
      }
     this.parentCateList =res.data;
    },
    //当选项发生改变时
  handleChange(){
    console.log(this.addFrom);
    console.log(this.selectItem);
    //当数组的长度大于0说明是选中的是父级
    if(this.selectItem.length>0){
      // 父类的id
      this.addFrom.cat_pid = this.selectItem[this.selectItem.length-1];
      this.addFrom.cat_level = this.selectItem.length;
      return;
    }else{
      this.addFrom.cat_level = 0;
      this.addFrom.cat_pid = 0;
    }
  },
  //关闭对话框时，清除所有的状态
  closeAddDialog(){
    this.$refs.addFromRef.resetFields();
    this.selectItem = [];
    this.addFrom.cat_pid = 0;
    this.addFrom.cat_level = 0;
  },
  // 添加分类
  addCate(){
    this.$refs.addFromRef.validate(async vali=>{
      if(!vali)return;
         const {data:res} = await this.$http.post('categories',this.addFrom);
        this.notification(res,'添加失败','添加成功',201);
        this.getCateList();
        this.addDialogVisible = false;
      });
  },
  //显示修改分类名称对话框
 async showEditDialog(info){
      this.editDialogVisible = true;
      this.editId = info.cat_id;
      // 根据id拿到相对应的名称
      const {data:res} = await this.$http.get('categories/'+info.cat_id);
      if(res.meta.status!==200)return;
      this.editForm.cat_name = res.data.cat_name;
    },
  // 修改分类名称
  editCate(){
    this.$refs.editFormRef.validate(async vali=>{
      if(!vali)return;
         const {data:res} = await this.$http.put(`categories/${this.editId}`,{'cat_name':this.editForm.cat_name});
        this.notification(res,'修改失败','修改成功',200);
        this.getCateList();
        this.editDialogVisible = false;
      });
  },
  // 删除分类名称
 async removeCate(id){
    const result = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
        const {data:res} =  await this.$http.delete('categories/'+id);
        this.notification(res,'删除用户失败','删除用户成功',200);
        this.getCateList();
      }
  }
  },
}
</script>

<style lang="less" scoped>
.font{
  margin-top: 15px;
  font-size: 15px;
}
.el-cascader{
  width: 100%;
}
</style>