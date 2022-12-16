<template>
    <div>
       <!-- 用户导航区域 -->
     <Nav>
        <template #homePage>首页</template>
        <template #context1>商品管理</template>
        <template #context2>添加商品</template>
      </Nav>
      <!-- 卡片区域 -->
        <el-card>
          <!-- 提示信息 -->
          <el-alert :closable="false" title="添加商品信息" type="info" show-icon></el-alert>
          <el-form :model="addForm" :rules="addFormRules" 
          label-position="top" ref="addFormRef" label-width="100px">
          <!-- 步骤条 -->
          <el-steps :space="200" :active="activeIndex - 0" align-center finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品信息"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- tab栏 -->
        <el-tabs @tab-click="getParamList" v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave">
            <el-tab-pane label="基本信息" name="0">
              <!-- 文本框 -->
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格"  prop="goods_price">
                <el-input type="number" v-model="addForm.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input type="number" v-model="addForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input type="number" v-model="addForm.goods_weight"></el-input>
              </el-form-item>
              <!-- 级联选择器 -->
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                clearable
                :props="cateParams"
                @change="handleChange">
              </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane  label="商品参数" name="1">
              <!-- 动态参数 -->
              <el-form-item  v-for="item in manyData" :key="item.attr_id" :label="item.attr_name" >
                <el-checkbox-group v-model="item.attr_vals" >
                  <el-checkbox  v-for="(val,i) in item.attr_vals" :key="i" :label="val" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品信息" name="2">
              <!-- 静态属性 -->
              <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
                    <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <!-- 图片的上传 -->
              <!-- action是图片提交的路径,headers是提交图片携带的请求头部 -->
              <el-upload
                  :headers="requestHeader"
                  action="http://127.0.0.1:8888/api/private/v1/upload"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 填写商品内容 -->
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <!-- 添加按钮 -->
                  <el-button class="addBtn" @click="add" type="primary">添加商品</el-button>
            </el-tab-pane>
      </el-tabs>
    </el-form>
        </el-card>
        <!-- 预览图片的对话框 -->
        <el-dialog title="图片预览" :visible.sync="PreviewdialogVisible"
            width="50%">
            <img class="previewImg"  :src="imgURL" alt="图片">
      </el-dialog>
    </div>
</template>

<script>
import Nav from '@/components/Nav/Nav.vue';
import _ from 'lodash'
export default {
  name:'Add',
  components:{Nav},
  data() {
    return {
        activeIndex:'0',
        // 表单绑定的数据
        addForm:{
          goods_name:'',
          goods_price:0,
          goods_number:0,
          goods_weight:0,
          goods_cat:[],
          pics:[],
          goods_introduce:'',
          attrs:[],
        },
        // 表单验证规则
        addFormRules:{
          goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          ],
          goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          ],
          goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          ],
          goods_cat:[
          { required: true, message: '请输入商品分类', trigger: 'blur' },
          ],
        },
        // 商品分类的列表数据
        cateList:[],
        // 配置参数
        cateParams:{
            expandTrigger: 'hover',
            value:'cat_id',
            label:'cat_name',
            children:'children'
        },
        // 动态参数的列表数据
        manyData:[],
        // 静态属性的列表数据
        onlyData:[],
        // 上传图片的请求头部
        requestHeader:{
          Authorization :sessionStorage.getItem('token')
        },
        // 预览图片对话框是否显示
        PreviewdialogVisible:false,
        // 图片的url
        imgURL:'',
    };
  },
  created(){
      this.getCateList();
  },
  methods: {
    async getCateList() {
     const {data:res} = await this.$http.get('categories');
     if(res.meta.status!==200){
        return;
     }
     this.cateList = res.data;
     
    },
    // 选项发生改变时
    handleChange(){
      // 不是选中第三级就清空数组
      if(this.addForm.goods_cat.length!==3){
        this.addForm.goods_cat = [];
      }
    },
    // 切换tab栏触发
    beforeTabLeave(active,old){
      // 判断是否选中了商品分类
      if(old === '0'&&this.addForm.goods_cat.length!==3){
        this.$message.error('请选择商品分类');
        return false;
      }
    },
    // 获取动态参数和静态属性
   async getParamList(){
    // 当激活的tab栏为1时，获取动态参数
      if(this.activeIndex==='1'){
        const {data:res} =  await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}});
      if(res.meta.status!==200){
        return;
      }
      res.data.forEach(item=>{
        item.attr_vals = item.attr_vals.length===0?[]:item.attr_vals.split(",");
         });
      this.manyData = res.data;
      }
    // 当激活的tab栏为2时，获取静态属性
      else if(this.activeIndex==='2'){
        const {data:res} =  await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}});
      if(res.meta.status!==200){
        return;
      }
      this.onlyData = res.data;
       }
    },
    // 预览图片
    handlePreview(file){
      this.imgURL = file.response.data.url;
      this.PreviewdialogVisible = true;
      
    },
    // 删除图片
    handleRemove(file){
      // 找到被删除的图片的路径
      const path =  file.response.data.tmp_path;
      // 将数组里的图片路径进行遍历比较，找到就返回一个索引值
     const index =  this.addForm.pics.findIndex(val=>{
        return val.pic===path
      });
      // 根据索引值删除图片
      this.addForm.pics.splice(index,1);
      console.log(this.addForm.pics);
    },
    // 上传图片成功
    handleSuccess(request){
      // 拿到图片上传的临时路径
      const p = {pic:request.data.tmp_path}
      // 将图片的路径push到pics这个数组里
      this.addForm.pics.push(p);
    },
    //添加商品
    add(){
      this.$refs.addFormRef.validate(async vali=>{
          if(!vali){
            return this.$message.error('请填写必选项');
          }
          // 添加商品操作
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(',');
        // 处理动态参数
        this.manyData.forEach(item=>{
          const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals};
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyData.forEach(item=>{
          const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals};
          this.addForm.attrs.push(newInfo);
        });
          form.attrs = this.addForm.attrs;
          console.log(form);
          const {data:res} = await this.$http.post('goods',form);
          this.notification(res,'添加商品失败','添加商品成功',201);
          console.log(res);
          this.$router.push('/goods');
        });
    }
  },
  computed: {
    cateId() {
        if(this.addForm.goods_cat.length===3){
          return this.addForm.goods_cat[2];
        }else{
          return null;
        }
    },
  
  },
}
</script>

<style lang="less" scoped>
.el-checkbox{
  margin: 0 15px 0 0;
}
.previewImg{
  width: 100%;
}
.addBtn{
  margin-top: 60px;
}
</style>