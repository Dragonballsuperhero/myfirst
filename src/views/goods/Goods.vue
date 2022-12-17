<template>
  <div>
     <!-- 用户导航区域 -->
     <Nav>
        <template #homePage>首页</template>
        <template #context1>商品管理</template>
        <template #context2>商品列表</template>
      </Nav>
      <!-- 卡片区域 -->
      <el-card>
        <!-- 搜索框和按钮 -->
        <el-input placeholder="请输入内容" v-model="goodsListParam.query" @clear="getGoodsList" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
       </el-input>
       <!-- 添加按钮 -->
       <el-button  type="primary" @click="addGoods">添加商品</el-button>
       <!-- 表格 -->
       <el-table :data="goodsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>      
          <el-table-column width="600px" prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格" width="100px"></el-table-column> 
          <el-table-column prop="goods_number" label="商品数量" width="100px"></el-table-column>    
          <el-table-column prop="add_time" label="创建时间" width="200px">
            <template slot-scope="scope">
                  {{scope.row.add_time | formatDate}}
            </template>
          </el-table-column>
             <!-- 操作按钮 -->
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.goods_id)"></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="removeGoods(scope.row.goods_id)" size="mini"></el-button>
              </template>
          </el-table-column>
      </el-table>
      <!-- 分页 -->
      
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsListParam.pagenum"
      :page-sizes="[30, 50, 100, 150]"
      :page-size="goodsListParam.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>
      </el-card>
      <!-- 编辑对话框 -->
      <el-dialog
          title="编辑商品"
          :visible.sync="editDialogVisible"
           width="40%">
              <!-- 表单 -->
              <el-form :model="editForm" status-icon :rules="formRules" ref="formRef" label-width="100px">
                  <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
                  </el-form-item>
                  <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="editForm.goods_price"></el-input>
                  </el-form-item>
                  <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="editForm.goods_number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="editForm.goods_weight"></el-input>
                  </el-form-item>
            </el-form>
            <span slot="footer">
           <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
         </span>
     </el-dialog>
  </div>
</template>

<script>
import Nav from '@/components/Nav/Nav.vue';
export default {
  name:'Goods',
  components:{Nav},
  data() {
    return {
      // 商品列表数据
      goodsList: [],
      // 商品列表的请求参数
      goodsListParam:{
        query:'',
        pagenum:1,
        pagesize:50
      },
      // 商品列表总数
      count:0,
      // 表单验证规则
      formRules:{
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
        },
      // 编辑商品绑定的数据
      editForm:{
        goods_name:'',
        goods_price:0,
        goods_number:0,
        goods_weight:0
      },
      // 编辑对话框
      editDialogVisible:false,
      // 商品的id
      goodsId:''
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
   async getGoodsList() {
     const {data:res} = await this.$http.get('goods',{params:this.goodsListParam});
     if(res.meta.status!==200)return;
     this.goodsList = res.data.goods;
     this.count = res.data.total;
    },
    // 监听页面展示的数量的事件
    handleSizeChange(newSize){
        this.goodsListParam.pagesize = newSize;
        this.getGoodsList();
    },
    // 监听页数发生改变的事件
    handleCurrentChange(newPage){
      this.goodsListParam.pagenum = newPage;
        this.getGoodsList();
    },
    // 删除商品
  async removeGoods(id){
      const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
        const {data:res} =  await this.$http.delete('goods/'+id);
        this.notification(res,'删除商品失败','删除商品成功',200);
        this.getGoodsList();
      }
    },
    // 添加商品
    addGoods(){
      this.$router.push('/Goods/Add');
    },
    // 显示编辑对话框
   async showEdit(id){
        this.editDialogVisible = true;
         const {data:res}=  await this.$http.get('goods/'+id);
         if(res.meta.status!==200){
          return;
         }
         this.editForm = res.data;
         this.goodsId = id;
        },
        // 编辑商品
       editGoods(){
            this.$refs.formRef.validate( async vali=>{
               if(!vali){
                   return;
                }
           // 编辑操作
             const {data:res} =  await this.$http.put('goods/'+this.goodsId,this.editForm);
             this.notification(res,'修改失败','修改成功',200);
              this.getGoodsList();
              this.editDialogVisible = false;
           });
        }
  },
}
</script>

<style lang="less" scoped>
 .el-input {
    width: 350px;
  }
.el-button{
  margin-left: 15px;
}
</style>