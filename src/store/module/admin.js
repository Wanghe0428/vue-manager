// 当前登录账号模块
export default {
    // 设置私有命名空间
    namespaced: true,
    state: {
        admin: {
            role: ""
        },
    },
    mutations: {
        //   該方法用于admin对象赋值
        setAdmin(state, val) {
            state.admin = val;
        }
    }
};