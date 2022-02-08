// 导入base_url.js
import baseUrl from './base_url.js';
// 导出BASE_URL
export let BASE_URL = baseUrl['dev'].url; //当前是开发模式
// 保存管理员头像地址根路径
export let BASE_URL_AdminImg = 'http://bingjs.com:83/upload/admin/';
// 管理员头像上传地址
export let upload_AdminImg_URL = 'http://bingjs.com:83/Admin/uploadImg/';
// 导出房间图片上传地址
export let Upload_RoomImg_URL = 'http://bingjs.com:83/RoomImg/uploadImg/';
// 导出显示房间图片的根路径
export let BASE_URL_RoomImg = 'http://bingjs.com:83/upload/room/';