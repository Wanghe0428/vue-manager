// 定义一个插件，导出一个对象
// import { time } from "_echarts@5.2.2@echarts"
import { get, post, setToken } from "../util/request.js"

export default {
    // 插件中必须暴露一个install方法
    install: function (Vue) {
        // 给Vue混入成员
        Vue.mixin({
            methods: {
                // 设置get请求方法
                $get: (url, params) => {
                    return get(url, params)
                },
                // 设置post请求方法
                $post: (url, params) => {
                    return post(url, params)
                },
                // 设置默认请求头
                $setToken: () => {
                    // 执行该方法就会将浏览器缓存的token保存到ajax的请求头中
                    setToken();
                },
                // 设置警告消息提示框
                $message_alert_warn(message, duration = 2000) {
                    this.$message({
                        message,
                        type: "warning",
                        duration,
                        // 显示关闭按钮
                        showClose: true
                    });
                },
                // 设置成功消息提示框
                $message_alert_success(message, duration = 2000) {
                    this.$message({
                        message,
                        type: "success",
                        duration,
                        // 显示关闭按钮
                        showClose: true
                    });
                },
                // 设置错误消息提示框
                $message_alert_error(message, duration = 2000) {
                    this.$message({
                        message,
                        type: "error",
                        duration,
                        // 显示关闭按钮
                        showClose: true
                    });
                },
                // 防抖插件
                $debounce(callback, delay) {
                    // 定时器
                    let time = null;
                    return () => {
                        if (time) {
                            console.log(time);
                            clearTimeout(time);
                        }
                        time = setTimeout(() => {
                            callback();
                        }, delay)
                    }
                },
                // 节流插件
                $throttle(callback, delay) {
                    // 
                    let time;
                    return function () {
                        // 如果在delay期间再次执行事件，则time为true，直接返回
                        if (time) {
                            return;
                        }
                        time = setTimeout(() => {
                            callback()
                            time = null   // 在delay后执行完fn之后清空timer，此时timer为false，throttle触发可以进入计时器
                        }, delay);
                    }
                }
            }

        })
    }
}