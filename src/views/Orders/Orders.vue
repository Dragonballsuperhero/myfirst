<template>
  <div>
    <!-- 用户导航区域 -->
    <Nav>
        <template #homePage>首页</template>
        <template #context1>订单管理</template>
        <template #context2>订单列表</template>
      </Nav>
      <!-- 卡片区域 -->
      <el-card>
          <el-row>
            <el-col :span="7">
              <!-- 搜索框 -->
              <el-input v-model.trim="queryInfo.query" placeholder="请输入订单号" @clear="getOrderList" clearable>
              <el-button @click="getOrderList" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <!-- 表格 -->
            <el-table :data="orderList" stripe border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="pay_status" label="是否付款">
                  <template slot-scope="scope">
                      <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
                      <el-tag type="success" v-else>已付款</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time|formatDate}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作">
                    <template>
                      <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit"></el-button>
                      <el-button size="mini" type="success" icon="el-icon-location" @click="showProgress"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </el-card>
        <!-- 修改地址对话框 -->
        <el-dialog
        title="修改地址"
        :visible.sync="addDialogVisible"
        width="45%" @close="closeEdit">
        <!-- 添加地址 -->`
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
            <el-cascader :props="{ expandTrigger: 'hover' }" :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
    </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
    <!-- 时间线组件  -->
    <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" 
        :key="index" :timestamp="activity.time">
            {{activity.context}}
        </el-timeline-item>
    </el-timeline>
</el-dialog>
  </div>
</template>

<script>
import Nav from '@/components/Nav/Nav.vue';
import cityData from './citydata'
export default {
    name:'Orders',
    components:{Nav},
    created() {
        this.getOrderList();
    },
    data() {
      return {
        orderList: [],
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:5
        },
        total:0,
        addDialogVisible:false,
        progressVisible:false,
        cityData,
        addressForm:{
          address1:[],
          address2:''
        },
        addressFormRules:{
          address1:[{ required: true, message: '请选择省市区县', trigger: 'blur' }],
          address2:[{ required: true, message: '请输入详细地址', trigger: 'blur' }],
      },
      // 物流信息
      progressInfo:[
        {
      "time": "2018-05-10 09:39:00",
      "ftime": "2018-05-10 09:39:00",
      "context": "已签收,感谢使用顺丰,期待再次为您服务",
      "location": ""
    },
    {
      "time": "2018-05-10 08:23:00",
      "ftime": "2018-05-10 08:23:00",
      "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
      "location": ""
    },
    {
      "time": "2018-05-10 07:32:00",
      "ftime": "2018-05-10 07:32:00",
      "context": "快件到达 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-10 02:03:00",
      "ftime": "2018-05-10 02:03:00",
      "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-09 23:05:00",
      "ftime": "2018-05-09 23:05:00",
      "context": "快件到达 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 21:21:00",
      "ftime": "2018-05-09 21:21:00",
      "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 13:07:00",
      "ftime": "2018-05-09 13:07:00",
      "context": "顺丰速运 已收取快件",
      "location": ""
    },
    {
      "time": "2018-05-09 12:25:03",
      "ftime": "2018-05-09 12:25:03",
      "context": "卖家发货",
      "location": ""
    },
    {
      "time": "2018-05-09 12:22:24",
      "ftime": "2018-05-09 12:22:24",
      "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
      "location": ""
    },
    {
      "time": "2018-05-08 21:36:04",
      "ftime": "2018-05-08 21:36:04",
      "context": "商品已经下单",
      "location": ""
    }
        ]
      };
    },
    methods: {
     async getOrderList() {
      const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
        if(res.meta.status!==200){
          return;
        }
        console.log(res);
        this.total = res.data.total;
        this.orderList = res.data.goods;
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },
        handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum;
            this.getOrderList();
        },
        showEdit(){
          this.addDialogVisible = true;
        },
        closeEdit(){
          this.$refs.addressFormRef.resetFields();
        },
        showProgress(){
          this.progressVisible = true;
        }
    },
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>