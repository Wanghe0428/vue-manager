// 后台管理页面
<template>
  <div class="main">
    <!-- 左侧导航栏 -->
    <div
      class="left"
      :style="{
        backgroundColor: themeColor,
        width: isCollapse ? 'auto' : '200px',
      }"
    >
      <div class="logo">小贺</div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        v-bind:background-color="themeColor"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        router
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>账号管理</span>
          </template>
          <!-- 使用了vue-router模式，就可以用index作为path路径进行跳转 -->
          <el-menu-item
            index="/layout/role"
            v-if="$store.state.admin.admin.roleId == 1"
            >角色管理</el-menu-item
          >
          <el-menu-item index="/layout/admin">账号管理</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-shop"></i>
            <span>客房管理</span>
          </template>
          <el-menu-item index="/layout/roomType">类型管理</el-menu-item>
          <el-menu-item index="/layout/room">客房管理</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-grape"></i>
            <span>客户管理</span>
          </template>
          <el-menu-item index="/layout/guest">客户管理</el-menu-item>
        </el-submenu>
        <el-submenu index="4" v-if="$store.state.admin.admin.roleId == 1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item index="/layout/permission">权限管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <!-- end 左侧内容 -->
    <!-- 右侧内容 -->
    <div class="right">
      <!-- 顶部导航栏 -->
      <div class="nav" :style="{ backgroundColor: themeColor }">
        <div class="icon" @click="handleClick">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          v-bind:background-color="themeColor"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="min-width: 640"
          router
        >
          <el-menu-item index="/layout">
            <i class="el-icon-s-home"></i>
            <span>Home</span>
          </el-menu-item>
          <el-menu-item index="/layout/message">
            <i class="el-icon-message"></i>
            <span>Message</span>
          </el-menu-item>
          <el-menu-item index="/layout/email">
            <i class="el-icon-chat-dot-square"></i>
            <span>Email</span>
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-help"></i>
              <span>Theme</span>
            </template>
            <el-menu-item
              v-bind:index="item.value"
              v-for="(item, index) in theme"
              :key="index"
              @click="checkTheme(item.value)"
              >{{ item.name }}</el-menu-item
            >
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{ admin.loginId }}</span>
            </template>
            <el-menu-item index="/layout/mine">个人中心</el-menu-item>
            <el-menu-item index="/layout/resetPwd">修改密码</el-menu-item>
            <el-menu-item @click="exit">退出系统</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <!-- end 顶部导航栏 -->
      <!-- 内容区域 -->
      <div class="content">
        <!-- 路由视图 -->
        <router-view></router-view>
      </div>
      <!-- end 内容区域 -->
    </div>
    <!-- end 右侧内容 -->
  </div>
</template>
<script>
// 导入当前登录账户模块
import admin from "../store/module/admin.js";
// 导入vuex的映射函数mapState
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      activeIndex2: "1",
      // 主题颜色的值,先去缓存中查找是否主题颜色有值
      themeColor: localStorage.getItem("themeColor")
        ? localStorage.getItem("themeColor")
        : "#101f30",
      // 是否折叠左侧导航栏
      isCollapse: false,
    };
  },
  // 生命周期函数created
  async created() {
    // 先获取当前登录用户的用户名
    let loginId = localStorage.getItem("loginId");
    // 如果用户名为空，表示未登录，则跳回登录界面
    if (!loginId) {
      this.$router.push("/login");
    } else {
      let res = await this.$get("/Admin/GetOne", { loginId });
      // console.log(res);
      this.setAdmin(res);
      // console.log(this.$store.state.admin.admin);
      // 在缓存中保存当前用户的角色编号
      localStorage.setItem("roleId", res.roleId);
    }
  },
  mounted() {},
  computed: {
    // 导入vuex的主题数据
    ...mapState("theme", ["theme"]),
    ...mapState("admin", ["admin"]),
  },
  methods: {
    // 导入vuex登录账户的的方法
    ...mapMutations("admin", ["setAdmin"]),
    // 切换主题颜色的事件函数
    checkTheme(color) {
      // console.log(color);
      // console.log(this.themeColor);

      // 将主题颜色存入缓存中
      localStorage.setItem("themeColor", color);
      this.themeColor = color;
    },
    // 折叠导航栏的事件函数
    handleClick() {
      // console.log(this.isCollapse);
      this.isCollapse = !this.isCollapse;
    },
    // 退出系统的事件函数
    exit() {
      // removeItem方法需要一个一个清楚，clear方法直接清楚所有
      // sessionStorage.removeItem('token');
      // localStorage.removeItem('loginId');
      // sessionStorage.removeItem('loginPwd');
      sessionStorage.clear();
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  //   左侧样式
  .left {
    background-color: #101f30;
    width: 200px;
    // 图标样式
    .logo {
      width: 90%;
      font-size: 18px;
      color: white;
      text-align: center;
      padding: 10px 0;
      border: 1px solid white;
      margin: 8px auto;
    }
  }
  //   右侧样式
  .right {
    flex: 1;
    // 顶部导航样式
    .nav {
      display: flex;
      height: 60px;
      justify-content: space-between;
      background-color: #101f30;
      .icon {
        display: flex;
        align-items: center;
        padding: 5px;
        i {
          color: white;
          font-size: 25px;
        }
      }
    }
    .content {
      padding: 8px;
    }
  }
}
</style>