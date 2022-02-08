// home页
<template>
  <div>
    <div ref="main" class="main"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      totalTypePrice: [],
      roomTypeNameArray: [],
      totalMoney: [],
    };
  },
  async mounted() {
    // 获取每种房型的销售额
    this.totalTypePrice = await this.$get("/RoomType/TotalTypePrice");
    // 将数据映射为我们想要的数据数组
    this.roomTypeNameArray = this.totalTypePrice.map((ele) => ele.roomtypeName);
    this.totalMoney = this.totalTypePrice.map((ele) => ele.totalMoney);
    console.log(this.totalMoney);
    // 基于准备好的dom，初始化echarts实例
    // 获取资源ref="main"
    var myChart = echarts.init(this.$refs["main"]);
    // console.log(this.$refs.main);
    // 绘制图表
    myChart.setOption({
      title: {
        text: "房间销售额",
      },
      tooltip: {},
      xAxis: {
        data: this.roomTypeNameArray,
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: this.totalMoney,
        },
      ],
    });
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 80vw;
  height: 80vh;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>