<template>
  <div>
    <!-- 信息添加搜索 -->
    <div class="search">
      <span>角色:</span>
      <el-select
        v-model="roleId"
        placeholder="请选择"
        :clearable="true"
        size="mini"
      >
        <el-option
          v-for="item in roleListToSearch"
          :key="item.roleId"
          :label="item.roleName"
          :value="item.roleId"
          :disabled="item.disabled"
          class="searchC"
        >
        </el-option>
      </el-select>
      <el-button type="success" size="mini" @click="searchClick"
        >查询</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="
          drawer = true;
          isAdd = true;
        "
        >添加账号</el-button
      >
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="编号" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录名" width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            {{ scope.row.loginId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="
              BASE_URL_AdminImg +
              (scope.row.photo ? scope.row.photo : 'admin_default.jpg')
            "
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.role.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
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
            class="delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- start 分页区域 -->
    <div class="page">
      <el-pagination
        background
        :page-size="6"
        layout="prev, pager, next"
        :total="count"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- end 分页区域    -->
    <!-- 抽屉区域 -->
    <div>
      <el-drawer
        title="添加账号"
        :visible.sync="drawer"
        :with-header="false"
        :before-close="handleClose"
      >
        <div class="drawerTitle">{{ isAdd ? "添加账号" : "修改账号" }}</div>
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
            <el-input
              type="password"
              v-model="ruleForm.loginPwd"
            ></el-input>
          </el-form-item>
          <!--  不需要修改 -->
          <el-form-item v-if="isAdd" label="确认密码" prop="loginPwd2">
            <el-input
              v-model="ruleForm.loginPwd2"
              type="password"
            ></el-input>
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
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              isAdd ? "添加账号" : "修改"
            }}</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>
<script>
// 导入角色api
import { List, add, getOne, updata, del } from "../../api/role_api.js";
// 导入管理员头像根路径
import { BASE_URL_AdminImg, upload_AdminImg_URL } from "../../config/index.js";
// 导入md5方法
import { strToMd5 } from "../../util/md5.js";
export default {
  data() {
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
  async created() {
    // 获取表格数据
    this.getTableList();
    // 获取角色列表
    this.getRoleList();
  },
  methods: {
    // 用于点击查询所触发的方法
    searchClick() {
      this.getTableList();
    },

    // 点击切换页码时触发
    currentChange(pageIndex) {
      // 设置当前页码
      this.pageIndex = pageIndex;
      // 然后重新调用获取表格数据的方法
      this.getTableList();
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
    // 从后台获取表格数据的方法：
    async getTableList() {
      // 在页面中请求接口，获取数据
      let { data, count } = await this.$get("/Admin/List", {
        roleId: this.roleId || 0,
        pageIndex: this.pageIndex,
        // 一页最多放置多少数据
        pageSize: 6,
      });
      // 通过api层调用接口请求数据
      // let res = await List();
      // 获取表格数据
      this.tableData = data;
      // 获取表格数据的总数量
      this.count = count;
      // console.log(this.tableData);
      // console.log(res);
    },
    // 获取角色列表的方法：
    async getRoleList() {
      let res = await this.$get("/Role/List");
      this.roleList = res;
      this.roleListToSearch = res;
    },
    // 点击编辑按钮触发的方法，编辑角色内容
    async handleEdit(index, row) {
      // 修改isAdd,表示为编辑
      this.isAdd = false;
      // 获取相应的登陆
      let loginId = row.loginId;
      this.ruleForm = await this.$get("/Admin/GetOne", { loginId });
      // 打开抽屉
      this.drawer = true;
    },
    // 点击删除按钮触发的方法
    async handleDelete(index, row) {
      // 是否确认删除
      await this.$confirm_("是否确定删除？");
      // 获取角色编号
      let id = row.id;
      // 获取角色头像
      let photo = row.photo;
      // 删除对应的账户
      let { message, success } = await this.$post("/Admin/Delete", {
        id,
        photo,
      });
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
            // 对密码进行md5加密
            this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
            const { success, message } = await this.$post(
              "/Admin/Add",
              this.ruleForm
            );
            // 判断是否添加成功
            if (success) {
              this.$message_alert_success(message);
              this.getTableList();
              this.resetForm("ruleForm");
            } else {
              this.$message_alert_error(message);
            }
          } else {
            // 执行修改功能
            const { success, message } = await this.$post(
              "/Admin/Update",
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

.search {
  padding-bottom: 10px;
  font-size: 10px;
  span {
    margin-right: 5px;
  }
  button {
    margin-left: 10px;
  }
  .el-select {
    height: 28px;
  }
  .el-input__inner {
    height: 28px !important;
  }
}
.drawerTitle {
  color: #606266;
  font-size: 14px;
  padding: 20px 12px;
}
.delete {
  margin-left: 0;
}
.page {
  display: flex;
  justify-content: center;
}
</style>