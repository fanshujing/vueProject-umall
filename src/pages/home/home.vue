<template>
  <div>
    <h1>首页管理</h1>
    <div class="box" id="main"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import echarts from "echarts";

export default {
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  watch: {
    list: {
      handler() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById("main"));

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: "商品分类",
          },
          tooltip: {},
          legend: {
            data: ["下级分类数量"],
          },
          xAxis: {
            data:this.list.map(item=>item.catename),
          },
          yAxis: {},
          series: [
            {
              name: "下级分类数量",
              type: "line",
              data: this.list.map(item=>item.children.length),
            },
          ],
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      requestCateList: "cate/requestCateList",
    }),
  },
  mounted() {
    this.requestCateList();
  },
};
</script>

<style scopede>
.box {
  width: 80%;
  height: 400px;
  margin: 20px auto;
  border: 1px solid #cccccc;
}
</style>