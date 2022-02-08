// 举例：模拟客房管理的请求接口

// 导入mock
import Mock from "mockjs"

// 定义拦截的接口地址
Mock.mock("http://mockjs.com:83/Room/List?roomTypeId=0&roomStateId=0&pageIndex=1&pageSize=6", function() {
    console.log(1);
    return Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        "data|5-10": [{
            // roomId从1000开始，逐渐加1
            "roomId|+1": 1000,
            roomType: {
                roomTypeName: "@cname(2,6)",
                // roomTypePrice范围是100-200,
                "roomTypePrice|100-200": 200,
            },
            roomState: {
                // @cname指的是随机一个名字，且名字长度是2-6
                roomStateName: "@ctitle(2,6)"
            }
        }]
    });
})