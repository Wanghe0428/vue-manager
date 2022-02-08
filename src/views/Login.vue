<template>
  <div class="main">
    <!-- 背景画布 -->
    <canvas id="particle-canvas" width="891" height="893"></canvas>
    <div class="container">
      <!-- react子应用 -->
      <!-- <div id="childReact"></div> -->
      <!-- <div>
        <el-button @click="handlelogin" type="success">登陆</el-button>
      </div> -->
      <div class="login">
        <h3 class="title">酒店管理系统</h3>
        <el-form
          size="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="40px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号" prop="loginId">
            <el-input v-model.number="ruleForm.loginId" type="text"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <!-- 给密码框添加一个enter按键摁下事件  -->
            <el-input
              type="password"
              v-model="ruleForm.loginPwd"
              autocomplete="off"
              @keyup.native.enter.stop="pwdEnter"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="loginPwd">
            <!-- `checked` 为 true 或 false  -->
            <el-checkbox v-model="ruleForm.checked">记住密码</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >登陆</el-button
            >
            <el-button type="warning" @click="register">注册</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
        <!-- <span>vue父应用本有的登陆页面</span> -->
      </div>
    </div>
  </div>
</template>
<script>
// 导入首页canvas画布
import { start1 } from "../assets/js/login.js";
// 导入md5加密方法
import { strToMd5 } from "../util/md5.js";
// 引入qiankun
import {
  registerMicroApps,
  start,
  initGlobalState,
  MicroAppStateActions,
} from "qiankun";

export default {
  // 表示页面加载完毕
  mounted() {
    // 调用画布
    // this.$router.push("/layout");
    start1();
    // setTimeout(() => {
    //   this.res = localStorage.getItem("res");
    //   // console.log(this.res);
    // }, 5000);
    this.res = localStorage.getItem("res");
    // qiankun引入的子应用
    const apps = [
      // react子应用
      {
        name: "reactApp",
        entry: "http://localhost:8002",
        container: "#childReact",
        activeRule: "/login",
        // 通过props实现通信传递值
        props: {
          callback: function (res) {
            this.res = res;
            console.log(res);
          },
        },
      },
    ];

    // registerMicroApps(apps, {
    //   // 当子应用挂载成功之后
    //   afterMount() {
    //     console.log("挂载成功");
    //   },
    // });
    // 启动
    start({});
  },
  data() {
    // 验证账号的方法
    var validateLoginId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    // 验证密码的方法
    var validateLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      // 从子应用接收到的数据
      res: {},
      // 表单数据
      ruleForm: {
        // 登录名
        loginId: "",
        // 登陆密码
        loginPwd: "",
        // 多选框属性
        checked: false,
      },

      // 表单的验证数据
      rules: {
        // 验证账号
        loginId: [{ validator: validateLoginId, trigger: "blur" }],
        // 验证密码
        loginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
      },
    };
  },
  // 销毁前调用的生命周期函数
  beforeDestroy() {
    // 组件销毁前需要清除缓存
    // localStorage.clear();
  },
  methods: {
    // 点击登陆触发事件
    handlelogin() {
      this.$setToken();
      this.$router.push("/layout");
      if (this.res) {
        console.log(1);
      }
    },

    // 在密码框回车键盘按下所触发的事件
    pwdEnter() {
      this.submitForm("ruleForm");
    },
    // 账号注册页面
    register() {
      this.$router.push("/register");
    },
    // 表单提交方法
    submitForm(formName) {
      console.log(this.ruleForm.loginPwd);
      this.$refs[formName].validate(async (valid) => {
        // 判断表单数据是否验证成功
        if (valid) {
          // 对密码进行md5加密
          this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
          // 去实现登陆
          let { message, token, success } = await this.$get(
            "/Admin/Login",
            this.ruleForm
          );
          // 如果登录成功
          if (success == true) {
            // 登陆成功，服务器会返回一个token令牌，这个token就代表了你的身份信息，所以需要保存该token信息，一般需要把token保存到浏览器的缓存
            // 浏览器的缓存空间有两种localStorage和sessionStorage，区别：localStorage里面保存的数据一直存在，而sessionStorage里面保存的数据会随着浏览器的关闭而自动清空
            // token存入缓存用sessionStorage.setItem('token',token)  或者用 localStorage.setItem(),
            // 区别时sessionStorage是关闭浏览器后就清理了缓存,而
            sessionStorage.setItem("token", token);
            // 在浏览器中保存登陆名
            localStorage.setItem("loginId", this.ruleForm.loginId);
            // 判断是否点击了记住密码
            if (this.ruleForm.checked) {
              // 保存密码
              localStorage.setItem("loginPwd", this.ruleForm.loginPwd);
            }
            this.$message_alert_success(message);
            // 设置默认请求头token信息
            this.$setToken();
            // 跳转到后台管理页面
            this.$router.push("/layout");
          } else {
            // 错误提示框
            this.$message_alert_error(message);
          }
        } else {
          return false;
        }
      });
    },
    // 表单重置方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  width: 100vw;
  height: 100vh;
  // 画布的背景css样式
  #particle-canvas {
    width: 100%;
    height: 100%;
    // background-color: linear-gradient(
    //   to bottom,
    //   rgb(10, 10, 50) 0%,
    //   rgb(60, 10, 60) 100%
    // );
    background-color: skyblue;
    vertical-align: middle;
  }
  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login {
      background-color: transparent;
      padding: 50px;
      width: 400px;
      height: 200px;
      border: 1px solid #ccc;
      border-radius: 5px;
      .title {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        font-size: 18px;
        color: white;
        text-align: center;
        margin: 20px;
      }
    }
  }
}
</style>
