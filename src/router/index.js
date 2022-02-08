import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 导入Nprogress ，加载进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { meta } from 'eslint/lib/rules/';

// 路由信息数组
const routes = [
  // 后台管理首页路由
  {
    path: '/',
    // meta是设置路由元信息，可有可无
    meta: {
      title: '小贺酒店管理系统',
    },
    component: () => import('@v/Index.vue'),
  },
  // 登录页路由
  {
    path: '/login',
    meta: {
      title: '登陆页',
    },
    component: () => import('@v/Login.vue'),
  },
  // 注册页面路由
  {
    path: '/register',
    meta: {
      title: '小贺酒店管理账号注册页面',
    },
    component: () => import('@v/Register.vue'),
  },
  // 后台管理布局页路由
  {
    path: '/layout',
    meta: {
      title: '小贺酒店管理系统',
    },
    component: () => import('@v/Layout.vue'),
    // 子路由
    children: [
      // 角色页面
      {
        path: 'role',
        meta: {
          title: '角色管理',
          // 只有roleId为1的才可以访问这个页面
          permission: [1]
        },
        component: () => import('@v/role/Role.vue'),
      },
      //admin路由

      {
        path: 'admin',
        meta: {
          title: '账户管理',
        },
        component: () => import('@v/admin/Admin.vue'),
      },
      // 客房类型路由

      {
        path: 'roomType',
        meta: {
          title: '客房类型管理',
        },
        component: () => import('@v/roomType/RoomType.vue'),
      },
      // 客房路由
      {
        path: 'room',
        meta: {
          title: '客房管理',
        },
        component: () => import('@v/room/Room.vue'),
      },
      // 客户管理路由
      {
        path: 'guest',
        meta: { title: '客户管理' },
        component: () => import('@v/guest/Guest.vue'),
      },
      //email路由
      {
        path: 'email',
        meta: {
          title: '电子邮箱',
        },
        component: () => import('@v/user/Email.vue'),
      },
      // Home主页路由
      {
        path: '',
        meta: {
          title: '客房管理主页',
        },
        component: () => import('@v/user/Home.vue'),
      },

      // message页面路由
      {
        path: 'message',
        meta: {
          title: 'message页面',
        },
        component: () => import('@v/user/Message.vue'),
      },

      // 个人中心页面路由
      {
        path: 'mine',
        meta: {
          title: '个人中心',
        },
        component: () => import('@v/user/Mine.vue'),
      },

      // 重置密码页面路由
      {
        path: 'resetPwd',
        meta: {
          title: '重置密码页面',
        },
        component: () => import('@v/user/ResetPwd.vue'),
      },
      // 权限路由
      {
        path: "permission",
        meta: {
          title: "权限路由页面",
          permission: [1]
        },
        component: () => import("@v/permission/Permission")

      }
    ],
  },
  // *表示剩余的全部情况

  {
    path: '*',
    component: () => import('@v/Error404.vue'),
  },
];
// 创建路由对象
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 显示加载进度条
  NProgress.start();
  // 如果要到的一个路由有源信息
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  // 表示需要验证权限
  if (to.meta && to.meta.permission) {
    // 在路由前置守卫中设置to.meta.permission是否为1，如果为1则继续，否则跳转到layout页面
    if (to.meta.permission.includes(parseInt(localStorage.getItem("roleId")))) {
      console.log(to.path);
      next()
    } else {
      console.log(from);
      // 则返回一开始的页面
      router.push("/layout");
    }
  } else {
    next();
  }



});

// 路由后置守卫
router.afterEach((to, from) => {
  // 关闭加载进度条
  NProgress.done();
});

// 导出router对象
export default router;
