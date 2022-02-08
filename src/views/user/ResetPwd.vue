<template>
  <div style="width: 500px">
    <el-form
      size="mini"
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="原始密码" prop="oldLoginPwd">
        <el-input
          type="password"
          v-model="ruleForm.oldLoginPwd"
        ></el-input>
      </el-form-item>
      <el-form-item label="修改密码" prop="newLoginPwd">
        <el-input v-model="ruleForm.newLoginPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="loginPwd2">
        <el-input
          v-model="ruleForm.loginPwd2"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >修改</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { strToMd5 } from "../../util/md5.js";
export default {
  data() {
    // 验证原始密码
    var validateLoginPwdOld = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else {
        callback();
      }
    };
    // 验证密码的方法
    var validateLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入最新密码"));
      } else {
        callback();
      }
    };
    // 验证确认密码的方法
    var validateLoginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value != this.ruleForm.newLoginPwd) {
        callback(new Error("两次输入密码不匹配"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        // 本账号id:
        id: this.$store.state.admin.admin.id,
        // 原始密码
        oldLoginPwd:'',
        // 密码
        newLoginPwd: '',
        // 确认密码
        loginPwd2: '',
      },
      // 表单的验证数据
      rules: {
        // 验证原始密码
        oldLoginPwd: [{ validator: validateLoginPwdOld, trigger: "blur" }],
        // 验证密码
        newLoginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
        // 验证确认密码
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState("admin", ["admin"]),
  },
  methods: {
    // 表单提交方法
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        // 判断表单数据是否验证成功
        if (valid) {
          // 对密码进行md5加密
          console.log(this.ruleForm.oldLoginPwd);
          this.ruleForm.oldLoginPwd = strToMd5(this.ruleForm.oldLoginPwd);
          this.ruleForm.newLoginPwd = strToMd5(this.ruleForm.newLoginPwd);
          const { success, message } = await this.$post(
            "/Admin/ResetPwd",
            this.ruleForm
          );
          // 判断是否添加成功
          if (success) {
            this.$message_alert_success(message);
            
            this.resetForm("ruleForm");
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
  },
};
</script>

<style lang="scss">
.main {
  width: 500px;
}
</style>