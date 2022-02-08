<template>
  <div>
    <!-- 信息添加按钮 -->
    <div class="search">
      <el-button
        type="primary"
        size="mini"
        @click="
          drawer = true;
          isAdd = true;
        "
        >添加角色</el-button
      >
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="角色编号" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名" width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            {{ scope.row.roleName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handlePermssion(scope.$index, scope.row)"
            >设置权限</el-button
          >
          <el-button
            type="warning"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉区域 -->
    <div>
      <el-drawer
        title="添加角色"
        :visible.sync="drawer"
        :with-header="false"
        :before-close="handleClose"
      >
        <div class="drawerTitle">{{ isAdd ? "添加角色" : "修改角色" }}</div>
        <el-form
          size="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model.number="ruleForm.roleName" type="text"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              isAdd ? "添加角色" : "修改"
            }}</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>
<script>
// 导入角色api
import { List, add, getOne, updata, del } from "../../api/role_api.js";
export default {
  data() {
    // 验证角色名称的方法
    var validateRoleName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入角色名称"));
      } else {
        callback();
      }
    };
    return {
      // 表格数据
      tableData: [],
      // 抽屜
      drawer: false,
      // 抽屉是否添加
      isAdd: true,
      // 表单数据
      ruleForm: {
        // 登录名
        roleName: "",
      },
      // 表单的验证数据
      rules: {
        // 验证角色名称
        roleName: [{ validator: validateRoleName, trigger: "blur" }],
      },
    };
  },
  async created() {
    this.getTableList();
  },
  methods: {
    // 从后台获取表格数据的方法：
    async getTableList() {
      // 在页面中请求接口，获取数据
      let res = await this.$get("/Role/List");

      // 通过api层调用接口请求数据
      // let res = await List();
      this.tableData = res;
      // console.log(this.tableData);
      // console.log(res);
    },
    // 点击跳转到设置路由页面
    handlePermssion(index, row) {
      this.$router.push("/layout/permission");
    },
    // 点击编辑按钮触发的方法，编辑角色内容
    async handleEdit(index, row) {
      // 修改isAdd,表示为编辑
      this.isAdd = false;
      // 获取相应的用户编号
      let roleId = row.roleId;
      this.ruleForm = await this.$get("/Role/GetOne", { roleId });
      // 打开抽屉
      this.drawer = true;
    },
    // 点击删除按钮触发的方法
    async handleDelete(index, row) {
      // 是否确认删除
      await this.$confirm_("是否确定删除？");
      // 获取角色编号
      let roleId = row.roleId;
      // 删除对应的用户信息
      let { message, success } = await this.$post("Role/Delete", { roleId });
      // 可删除
      if (success) {
        this.$message_alert_success(message);
        this.getTableList();
      } else {
        this.$message_alert_error(message);
      }
    },

    // 表单提交方法
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        // 判断表单数据是否验证成功
        if (valid) {
          // 执行添加功能
          if (this.isAdd) {
            const { success, message } = await this.$post(
              "/Role/Add",
              this.ruleForm
            );
            // 判断是否添加成功
            if (success) {
              this.$message_alert_success(message);
              this.getTableList();
            } else {
              this.$message_alert_error(message);
            }
          } else {
            // 执行修改功能
            const { success, message } = await this.$post(
              "/Role/Update",
              this.ruleForm
            );
            // 判断是否修改成功
            if (success) {
              this.$message_alert_success(message);
              this.getTableList();
            } else {
              this.$message_alert_error(message);
            }
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
    //确认框
    async $confirm_(message) {
      return new Promise((resolve, reject) => {
        this.$confirm(message)
          .then((res) => {
            resolve();
          })
          .catch((error) => {});
      });
    },
    // 关闭抽屉触发
    async handleClose() {
      this.drawer = false;
      this.ruleForm = {};
    },
  },
};
</script>
<style scoped lang="scss">
.search {
  padding-bottom: 10px;
}
.drawerTitle {
  color: #606266;
  font-size: 14px;
  padding: 20px 12px;
}
</style>