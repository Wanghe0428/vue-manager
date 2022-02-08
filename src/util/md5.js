// 用于加密的工具
// md5加密
import md5 from "js-md5"

function strToMd5(str) {
    // 将字符串先进行一次md5加密，然后将加密结果进行一次翻转，然后再进行一次加密
    return md5(md5(str).split('').reverse().join(''));
}
// 导出一个将字符串进行md5加密的方法
export {
    strToMd5
}