<template>
  <div class="main"></div>
</template>
<script>
export default {
  // 钩子函数，一旦此页面创建，就自动执行
  async created() {
    // 从浏览器缓存中获取登录名和密码
    // sessionStorage为退出浏览器会保存缓存中的内容
    let loginId = localStorage.getItem("loginId");
    // localStorage则一旦退出浏览器就会清理缓存
    let loginPwd = localStorage.getItem("loginPwd");
    // 如果loginid或者loginPwd有一个没有值，则跳转到登录页
    if (!loginId || !loginPwd) {
      console.log("错误");
      this.$router.push("/login");
    } else {
      let { message, token, success } = await this.$get("/Admin/Login", {
        loginId,
        loginPwd,
      });
      console.log(1111);
      if (success) {
        sessionStorage.setItem("token", token);
        console.log("登陆成功！");
        // 设置默认请求头token信息
        this.$setToken();
        // 跳转到后台管理页面
        this.$router.push("/layout");
      }else {
        //   跳转到登录页
        this.$router.push("/login");
        console.log(222);
      } 
    }
  },
};
</script>
<style scoped>
</style>