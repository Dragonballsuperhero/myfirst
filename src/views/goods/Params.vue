<template>
  <div>
     <!-- 用户导航区域 -->
     <Nav>
        <template #homePage>首页</template>
        <template #context1>商品管理</template>
        <template #context2>分类参数</template>
      </Nav>
      <!-- 卡片区域 -->
      <el-card>
        <!-- 提示文本 -->
        <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
        <!--商品分类  -->
        <el-row style="margin:15px 2px">
          <el-col>
            <span>选择商品分类:</span>
            <el-cascader
                v-model="cateKeys"
                :options="cateList"
                clearable
                :props="cateParams"
                @change="handleChange">
              </el-cascader>
          </el-col>
        </el-row>
        <!-- tab标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 动态参数面板 -->
          <el-tab-pane label="动态参数" name="many">
              <el-button @click="showAddDialog" type="primary" :disabled="isBtnDisable" size="mini">添加参数</el-button>
              <!-- 动态参数表格 -->
                <el-table :data="manyData" stripe border>
                  <!-- 下拉列 -->
                  <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-tag
                            v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                            @close="handlerClose(i,scope.row)">
                            {{item}}
                        </el-tag>
                        <!-- 添加输入框 -->
                        <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput" size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!-- 按钮 -->
                        <el-button v-else class="button-new-tag"
                         size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                      </template>
                  </el-table-column>
                  <!-- 索引列 -->
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsOrAttr(scope.row.attr_id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
            </el-tab-pane>
          <!-- 静态属性面板 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" @click="showAddDialog" :disabled="isBtnDisable" size="mini">添加属性</el-button>
             <!-- 静态属性表格 -->
             <el-table :data="onlyData" stripe border>
                  <!-- 下拉列 -->
                  <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-tag
                            v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                            @close="handlerClose(i,scope.row)">
                            {{item}}
                        </el-tag>
                        <!-- 添加输入框 -->
                        <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput" size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!-- 按钮 -->
                        <el-button v-else class="button-new-tag"
                         size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                      </template>
                  </el-table-column>
                    <!-- 索引列 -->
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column  label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsOrAttr(scope.row.attr_id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 添加参数和属性对话框 -->
      <el-dialog
          :title="'添加'+title_name"
          :visible.sync="addDialogVisible"
          @close="dialogClosed"
           width="45%">
              <!-- 表单 -->
              <el-form :model="addForm" status-icon :rules="formRules" ref="formRef" label-width="100px">
               <el-form-item :label="title_name" prop="attr_name">
              <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer">
           <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsOrAttr">确 定</el-button>
         </span>
     </el-dialog>
     <!-- 编辑参数或属性的对话框 -->
     <el-dialog
          :title="'添加'+title_name"
          :visible.sync="editDialogVisible"
          @close="dialogClosed"
           width="45%">
              <!-- 表单 -->
              <el-form :model="editForm" status-icon :rules="formRules" ref="formRef" label-width="100px">
               <el-form-item :label="title_name" prop="attr_name">
              <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer">
           <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsOrAttr">确 定</el-button>
         </span>
     </el-dialog>
  </div>
</template>

<script>
import Nav from '@/components/Nav/Nav.vue'
export default {
  name:'Params',
  components:{Nav},
  created(){
      this.getCateList();
  },
  data() {
    return {
      // 级联选择器里的列表数据
      cateList: [],
      // 级联选择器配置参数
      cateParams:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 级联选择器绑定的id值
      cateKeys:[],
      // 被激活的tab栏
      activeName:'many',
      // 动态参数的数据
      manyData:[],
      // 静态属性的数据
      onlyData:[],
      // 添加参数和属性对话框标题
      title_name:'',
      // 添加参数和属性对话框是否显示
      addDialogVisible:false,
      //  添加参数和属性绑定的属性
      addForm:{
        attr_name:''
      },
      // 参数和属性表单验证规则
      formRules:{
        attr_name:[
        { required: true, message: '文本框不能为空', trigger: 'blur' }
        ]
      },
      // 编辑参数和属性对话框是否显示
      editDialogVisible:false,
      // 编辑参数和属性绑定的属性
      editForm:{
        attr_name:''
      },
      //属性或参数的id
      attr_id:'',
    };
  },
  methods: {
   async getCateList() {
     const {data:res} = await this.$http.get('categories');
     if(res.meta.status!==200){
        return;
     }
     this.cateList = res.data;
    },
    // 选项发生改变时触发
    handleChange(){

      if(this.cateKeys.length===3){
        this.getParamData();
      }else{     
          // 当数组长度小于3时，将manyData和onlyData清空
          this.manyData = [];
          this.onlyData = [];
          this.cateKeys = [];
      }
    },
    // 单击激活了哪个tab栏
    handleClick(){
      this.getParamData();
    },
    //获取三级分类列表的参数数据
   async getParamData(){
      const {data:res} =  await this.$http.get(`categories/${this.cateId}/attributes`,{params:{'sel':this.activeName}});
      if(res.meta.status!==200){
        return;
      }

      //判断请求名是否与被激活的面板名称一样
      if(this.activeName==='many'){
          this.manyData = res.data;
          this.title_name = '动态参数';       
      }else{
          this.onlyData = res.data;
          this.title_name = '静态属性';
      }
       // 循环出数组的attr_vals属性用,进行分割
       res.data.forEach(item=>{
            item.attr_vals = item.attr_vals? item.attr_vals.split(","):[];
          //添加自定义属性用来控制输入框和按钮之间的切换
            this.$set(item,'inputVisible',false);
            this.$set(item,'inputValue','');
          });
    },
    // 显示添加的对话框
    showAddDialog(){
      this.addDialogVisible = true;
    },
    // 监听对话关闭的事件
    dialogClosed(){
      this.$refs.formRef.resetFields();
    },
    // 添加参数或属性
    addParamsOrAttr(){
      this.$refs.formRef.validate(async vali=>{
          if(!vali){return};
          const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{'attr_name':this.addForm.attr_name,'attr_sel':this.activeName});
          this.notification(res,'添加失败','添加成功',201);
          this.getParamData();
          this.addDialogVisible = false;
        });
    },
    // 显示编辑的对话框
   async showEditDialog(id){
      this.editDialogVisible = true;
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{'attr_sel':this.activeName}});
      if(res.meta.status!==200){return;};
      this.attr_id = id;
      this.editForm.attr_name = res.data.attr_name;
    },
    // 编辑参数或属性
    editParamsOrAttr(){
      this.$refs.formRef.validate(async vali=>{
          if(!vali){return};
          const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.attr_id}`,{'attr_name':this.editForm.attr_name,'attr_sel':this.activeName});
          this.notification(res,'编辑失败','编辑成功',200);
          this.getParamData();
          this.editDialogVisible = false;
        });
    },
    // 删除参数或属性
   async removeParamsOrAttr(id){
      const result = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
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
        const {data:res} =  await this.$http.delete(`categories/${this.cateId}/attributes/${id}`);
        this.notification(res,'删除失败','删除成功',200);
        this.getParamData();
      }
    },
    // 监听文本框按下回车和失去焦点
    handleInputConfirm(row){  
      if(row.inputValue.trim()===''){
        row.inputVisible = false;
        row.inputValue = '';
        return;
      }
      // 将新的数据添加到数组里，然后发起请求
      row.attr_vals.push(row.inputValue);
      this.saveTagVal(row);
      row.inputVisible = false;
      row.inputValue = '';
    },
   async saveTagVal(row){
    const {data:res}  =  await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          'attr_name':row.attr_name,
          'attr_sel':row.attr_sel,
          'attr_vals':row.attr_vals.join(',')
        });
        this.notification(res,'操作失败','操作成功',200);
    },
    // 隐藏按钮显示文本框
    showInput(row){
      row.inputVisible = true;
      // 自动获取焦点
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除tag标签
    handlerClose(i,row){
        row.attr_vals.splice(i,1);
        this.saveTagVal(row);
    }
  },
  computed: {
    // 控制添加参数和添加属性按钮是否禁用
    isBtnDisable() {
      // 当数组的长度为0时，禁用按钮
      if(this.cateKeys.length===0){
        return true;
      }else{
        return false;
      }
    }, 
    // 三级分类的id值
    cateId(){
     return this.cateKeys[this.cateKeys.length-1];
    }
  },
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 5px;
}
.input-new-tag{
  width: 100px;
  margin-left: 5px;
}
.button-new-tag{
  margin-left: 5px;

}
</style>