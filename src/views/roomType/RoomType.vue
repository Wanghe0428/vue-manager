<template>
  <div>
    <!-- 信息添加搜索 -->
    <div class="search">
      <el-button
        type="primary"
        size="mini"
        @click="
          drawer = true;
          isAdd = true;
        "
        >添加客房类型</el-button
      >
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="类型编号" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.roomTypeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型名称" width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            {{ scope.row.roomTypeName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="床位数目" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.bedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.roomTypePrice }}</span>
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

    <!-- 抽屉区域 -->
    <div>
      <el-drawer
        title="添加账号"
        :visible.sync="drawer"
        :with-header="false"
        :before-close="handleClose"
       size="50%"
      >
        <div class="drawerTitle">{{ isAdd ? "添加客房" : "修改客房" }}</div>
        <el-form
          size="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="房间名称" prop="roomTypeName">
            <el-input v-model.number="ruleForm.roomTypeName"></el-input>
          </el-form-item>
          <el-form-item label="床位数目" prop="bedNum">
            <el-input v-model.number="ruleForm.bedNum" type="text"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="roomTypePrice">
            <el-input
              v-model.number="ruleForm.roomTypePrice"
              type="text"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="typeDescription">
              <quill-editor
              v-model="ruleForm.typeDescription"
              ref="myQuillEditor"
              style="height:300px;margin-bottom:100px"
            >
            </quill-editor>
            <el-input
              v-model.number="ruleForm.typeDescription"
              type="textarea"
            ></el-input>
            
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              isAdd ? "添加客房" : "修改"
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
    // 验证客房名称的方法
    var validateRoomTypeName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房名称"));
      } else {
        callback();
      }
    };
    // 验证客房房间数量的方法
    var validateBedNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房数量"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入整数数字"));
      } else {
        callback();
      }
    };
    // 验证客房价格
    var validateRoomTypePrice = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输客房价格"));
      } else {
        callback();
      }
    };
    // 验证客房描述的方法
    var validateTypeDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房描述"));
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
      // 抽屜
      drawer: false,
      // 抽屉是否添加
      isAdd: true,
     
      // 表单数据
      ruleForm: {
        // 房间类型名
        roomTypeName: "",
        // 房间数目
        bedNum: "",
        // 房间价格
        roomTypePrice: "",
        // 房间描述
        typeDescription: "",
      },
      // 表单的验证数据
      rules: {
        // 验证类型名字
        roomTypeName: [{ validator: validateRoomTypeName, trigger: "blur" }],
        // 验证数量
        bedNum: [{ validator: validateBedNum, trigger: "blur" }],
        // 验证价格
        roomTypePrice: [{ validator: validateRoomTypePrice, trigger: "blur" }],
        // 验证描述
        typeDescription: [
          { validator: validateTypeDescription, trigger: "blur" },
        ],
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
      // 在页面中请求接口，获取房间信息数据
      let data = await this.$get("/RoomType/List");
      // 通过api层调用接口请求数据
      // let res = await List();
      // 获取表格数据
      this.tableData = data;
      // 获取表格数据的总数量
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
      let roomTypeId = row.roomTypeId;
      this.ruleForm = await this.$get("/roomType/GetOne", { roomTypeId });
      // 打开抽屉
      this.drawer = true;
    },
    // 点击删除按钮触发的方法
    async handleDelete(index, row) {
      // 是否确认删除
      await this.$confirm_("是否确定删除？");
      // 获取角色编号
      let roomTypeId = row.roomTypeId;
      // 删除对应的账户
      let { message, success } = await this.$post("/RoomType/Delete", {
        roomTypeId,
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
            const { success, message } = await this.$post(
              "/RoomType/Add",
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
              "/roomType/Update",
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