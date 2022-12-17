<template>
  <div>
    <!-- 导航 -->
    <Nav>
        <template #homePage>首页</template>
        <template #context1>数据统计</template>
        <template #context2>数据报表</template>
      </Nav>
      <!-- 卡片区域 -->
        <el-card>
          <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import Nav from '@/components/Nav/Nav.vue';
import _ from 'lodash'
export default {
    name:'Report',
    components:{Nav},
    data() {
      return {
        option: {
          title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '5%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      };
    },
   async mounted(){
      var myChart = echarts.init(document.querySelector('#main'));
      // 指定图表的配置项和数据
     const {data:res} = await this.$http.get('reports/type/1');
      if(res.meta.status!==200){
        return;
      }
    const result =   _.merge(this.option,res.data);
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    },

}
</script>

<style>

</style>