// 添加全局配置文件
const path = require("path");
module.exports = {
    // 关闭esList语法检测功能
    lintOnSave: false,
    // 开发服务器相关的配置
    devServer: {
        // 配置静态资源目录
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        // 设置开发服务器的端口号
        port: 8848,
        proxy: {
            "/Admin": {
                target: "http://bingjs.com:83",
                changeOrigin: true
            }
        }
    },
    // dev: {
    //     proxyTable: {
    //         '/': {
    //             target: 'http://bingjs.com:83', //后端接口地址
    //             changeOrigin: true,  //是否允许跨越
    //         }
    //     },
    // },
    // 配置webpack相关
    configureWebpack: {
        // 解析
        resolve: {
            // 配置路径别名
            alias: {
                '@v': path.resolve(__dirname, "src/views"),
                '@c': path.resolve(__dirname, "src/components"),
            }
        }
    }
}