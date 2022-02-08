<template>
  <div class="main" @click="handleErrot">
    <div class="error">
      <img src="../../public/img/404false/404.png" alt="" />
    </div>
    <div class="content">你访问的页面未找到!</div>
  </div>
</template>
<script>
export default {
  methods: {
    //   返回首页
    handleErrot() {
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped lang="scss">
.main {
  .error {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      background-color: #fff;
    }
  }
  .content {
    display: flex;
    justify-content: center;
    color: red;
    font-size: 50px;
    font-weight: 700;
  }
}
</style>