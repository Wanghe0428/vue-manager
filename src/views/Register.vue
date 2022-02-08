// 注册账号页面
<template>
  <div>
    <div class="drawerTitle">注册账号:</div>
    <el-form
      size="mini"
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="头像" prop="photo">
        <el-upload
          class="avatar-uploader"
          :action="upload_AdminImg_URL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="ruleForm.photo"
            :src="BASE_URL_AdminImg + ruleForm.photo"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="账号" prop="loginId">
        <el-input v-model="ruleForm.loginId" type="text"></el-input>
      </el-form-item>
      <!-- 表示只在添加的时候显示密码框，在修改账户信息时不需要显示出来 -->
      <el-form-item v-if="isAdd" label="密码" prop="loginPwd">
        <el-input type="password" v-model="ruleForm.loginPwd"></el-input>
      </el-form-item>
      <!--  不需要修改 -->
      <el-form-item v-if="isAdd" label="确认密码" prop="loginPwd2">
        <el-input v-model="ruleForm.loginPwd2" type="password"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" type="text"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="ruleForm.phone" type="text"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <!-- 下拉框 -->
        <el-select
          v-model="ruleForm.roleId"
          placeholder="请选择角色"
          :clearable="true"
        >
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >注册</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入管理员头像根路径
import { BASE_URL_AdminImg, upload_AdminImg_URL } from "../config/index.js";
// 导入md5方法
import { strToMd5 } from "../util/md5.js";
export default {
  data() {
    this.getRoleList();

    // 验证账号的方法
    var validateLoginId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号信息"));
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
    // 验证确认密码的方法
    var validateLoginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value != this.ruleForm.loginPwd) {
        callback(new Error("两次输入密码不匹配"));
      } else {
        callback();
      }
    };
    // 验证姓名的方法
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    // 验证账号的方法
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话"));
      } else {
        callback();
      }
    };
    // 验证角色的方法
    var validateRoleId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      // 管理员头像根路径BASE_URL_AdminImg
      BASE_URL_AdminImg,
      // 管理员头像上传路径
      upload_AdminImg_URL,
      // 表格数据
      tableData: [],
      // 请求的数据条目的总数量
      count: 1,
      // 分页的当前页码
      pageIndex: 1,
      // 角色编号，用于限制根据条件查询账号信息
      roleId: "",
      // 角色列表,用于筛选搜索
      roleListToSearch: [],
      // 抽屜
      drawer: false,
      // 抽屉是否添加
      isAdd: true,
      // 角色列表
      roleList: [],
      // 表单数据
      ruleForm: {
        // 账号
        loginId: "",
        // 角色编号
        roleId: "",
        // 电话
        phone: "",
        // 密码
        loginPwd: "",
        loginPwd2: "",
        // 姓名
        name: "",
        // 头像
        photo: "",
      },
      // 表单的验证数据
      rules: {
        // 验证账号
        loginId: [{ validator: validateLoginId, trigger: "blur" }],
        // 验证密码
        loginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
        // 验证确认密码
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }],
        // 验证确认姓名
        name: [{ validator: validateName, trigger: "blur" }],
        // 验证电话
        phone: [{ validator: validatePhone, trigger: "blur" }],
        // 验证角色
        roleId: [{ validator: validateRoleId, trigger: "change" }],
      },
    };
  },
  methods: {
    // 表单提交方法
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        // 判断表单数据是否验证成功
        if (valid) {
          // 执行添加功能

          // 对密码进行md5加密
          this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
          const { success, message } = await this.$post(
            "/Admin/Add",
            this.ruleForm
          );
          // 判断是否添加成功
          if (success) {
            this.$message_alert_success(message);
            this.resetForm("ruleForm");
            this.$router.push("/login");
          } else {
            this.$message_alert_error(message);
          }
        } else {
          return false;
        }
      });
    },
    // 表单重置方法
    resetForm(formName) {
      this.ruleForm = {};
      this.$refs[formName].resetFields();
    },
    // 头像上传成功
    handleAvatarSuccess(res, file) {
      let { success, filename } = res;
      // 表示头像上传成功
      if (success) {
        this.ruleForm.photo = filename;
      }
    },
    // 头像上传之前
    beforeAvatarUpload(file) {
      // 定义可以上传的图片数组类数组
      let img_type_list = ["image/jpeg", "image/png", "image/gif"];
      // 通过数组的include方法判断是否包含以上类型
      const isImg = img_type_list.includes(file.type);
      // 限制图片上传大小
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImg) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImg && isLt2M;
    },
    // 获取角色列表的方法：
    async getRoleList() {
      let res = await this.$get("/Role/List");
      this.roleList = res;
      console.log(res);
      this.roleListToSearch = res;
    },
  },
};
</script>

<style lang="scss" scoped>
// 上传头像样式 开始
.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
// 上传头像样式 结束
.drawerTitle {
  margin: 20px;
}
// 上传头像样式 结束
</style>