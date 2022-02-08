<template>
  <div>
    <!-- 信息添加搜索 -->
    <div class="search">
      <span>客房类型:</span>
      <el-select
        v-model="roomTypeId"
        placeholder="请选择"
        :clearable="true"
        size="mini"
        @change="searchClick"
        ref="search"
        id="search1"
      >
        <el-option
          v-for="item in roomTypeList"
          :key="item.roomTypeId"
          :label="item.roomTypeName"
          :value="item.roomTypeId"
          :disabled="item.disabled"
          class="searchC"
        >
        </el-option>
      </el-select>
      <span>客房状态:</span>
      <el-select
        v-model="roomStateId"
        placeholder="请选择"
        :clearable="true"
        size="mini"
      >
        <el-option
          v-for="item in roomStateList"
          :key="item.roomStateId"
          :label="item.roomStateName"
          :value="item.roomStateId"
          :disabled="item.disabled"
          class="searchC"
        >
        </el-option>
      </el-select>
      <el-button type="success" size="mini" @click="searchClick"
        >查询</el-button
      >
      <el-button type="warning" size="mini" @click="excelClick"
        >导出Excel</el-button
      >
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
      <el-table-column label="房间号" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.roomId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            {{ scope.row.roomType.roomTypeName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="房间个数" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.roomType.bedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.roomType.roomTypePrice }}</span>
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
            type="warning"
            size="mini"
            @click="handleShowImg(scope.$index, scope.row)"
            >图片</el-button
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
      <!-- end 分页区域    -->
    </div>
    <!-- 抽屉区域 -->
    <div>
      <el-drawer
        title="添加账号"
        :visible.sync="drawer"
        :with-header="false"
        :before-close="handleClose"
        size="50%"
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
          <el-form-item label="房间号" prop="roomId">
            <el-input v-model="ruleForm.roomId"></el-input>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomTypeId">
            <el-select
              v-model="ruleForm.roomTypeId"
              placeholder="请选择"
              :clearable="true"
              size="mini"
            >
              <el-option
                v-for="item in roomTypeList"
                :key="item.roomTypeId"
                :label="item.roomTypeName"
                :value="item.roomTypeId"
                :disabled="item.disabled"
                class="searchC"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间状态" prop="roomStateId">
            <el-select
              v-model="ruleForm.roomStateId"
              placeholder="请选择"
              :clearable="true"
              size="mini"
            >
              <el-option
                v-for="item in roomStateList2"
                :key="item.roomStateId"
                :label="item.roomStateName"
                :value="item.roomStateId"
                :disabled="item.disabled"
                class="searchC"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <quill-editor
              v-model="ruleForm.description"
              ref="myQuillEditor"
              style="height: 300px; margin-bottom: 100px"
            >
            </quill-editor>
            <el-input v-model="ruleForm.description" type="textarea"></el-input>
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
    <!-- 弹出层 -->
    <el-dialog
      title="房间图片"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose1"
    >
      <!-- 图片上传组件 -->
      <el-upload
        :action="Upload_RoomImg_URL"
        list-type="picture-card"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>

      <el-dialog :visible.sync="dialogVisible2" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
// 导入角色api
import { List, add, getOne, updata, del } from "../../api/role_api.js";
//导入图片上传地址、查看房间图片根路径
import { Upload_RoomImg_URL, BASE_URL_RoomImg } from "../../config/index.js";
// 导入md5方法
import { strToMd5 } from "../../util/md5.js";
import xlsx from "../../excel/Export2Excel";
export default {
  data() {
    // 验证客房编号
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入编号"));
      } else {
        callback();
      }
    };
    // 验证客房类型
    var validateRoomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择客房类型"));
      } else {
        callback();
      }
    };
    // 验证状态编号
    var validateRoomStateId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择客房编号"));
      } else {
        callback();
      }
    };
    // 验证客房描述的方法
    var validateDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房描述"));
      } else {
        callback();
      }
    };
    return {
      //导入图片上传地址、
      Upload_RoomImg_URL,
      // 查看房间图片根路径
      BASE_URL_RoomImg,
      // 定义一个房间图片对应的房间号
      roomId: "",
      // 表格数据
      tableData: [],
      // 请求的数据条目的总数量
      // 客房类型
      roomTypeList: [],
      // 房间状态列表
      roomStateList: [],
      // 房间状态列表(用于添加)
      roomStateList2: [],
      // 客房类型编号
      roomTypeId: "",
      // 客房状态编号
      roomStateId: "",
      count: 1,
      // 分页的当前页码
      pageIndex: 1,
      // 角色编号，用于限制根据条件查询账号信息
      drawer: false,
      // 抽屉是否添加
      isAdd: true,
      // 弹出层
      dialogVisible: false,
      // 是否显示图片的弹出层大图
      dialogVisible2: false,
      // 上传图片的地址
      dialogImageUrl: "",
      // 一个数组，表示房间照片墙显示照片的数组
      fileList: [],
      // 表单数据
      ruleForm: {
        // 房间编号
        roomId: "",
        // 状态编号
        roomStateId: "",
        // 类型编号
        roomTypeId: "",
        // 房间描述
        description: "",
        // 用于备份房间号
        id: "",
      },
      // 表单的验证数据
      rules: {
        // 验证房间号
        roomId: [{ validator: validateRoomId, trigger: "blur" }],
        // 验证房间类型
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "change" }],
        // 验证状态编号
        roomStateId: [{ validator: validateRoomStateId, trigger: "change" }],
        // 验证描述
        description: [{ validator: validateDescription, trigger: "blur" }],
      },
    };
  },
  async created() {
    // 获取表格数据
    this.getTableList();
    // 获取房间类型列表的方法
    this.getRoomList();
    this.getRoomStateList();
  },
  mounted() {
    function test() {
      console.log(1);
    }
    var getTableList1 = () => {
      console.log(1);
      this.getTableList();
    };
    console.log(this.$refs.search);
    console.log(document.querySelector("#search1"));

    // 为search输入框添加防抖功能
    this.$refs.search.$on("change", this.$debounce(getTableList1, 5000));
    console.log(this);
    // 为屏幕滑轮滚动添加节流功能。window不是ref属性，所以可以直接使用原生属性addEventListener
    window.addEventListener("scroll", this.$throttle(test, 5000));
  },

  methods: {
    // 把表格数据导出excel的方法
    excelClick() {
      const tHeader = {
        roomid: "客房编号",
        roomtypeName: "客房类型",
        bednum: "床位数",
        roomtypePrice: "价格",
      };
      // 上面设置Excel的表格第一行的标题

      // 上面的index、nickName、name是tableData里对象的属性
      let data = this.tableData.map((v) => {
        return {
          roomid: v.roomId,
          roomtypeName: v.roomType.roomTypeName,
          bednum: v.roomType.bedNum,
          roomtypePrice: v.roomType.roomTypePrice,
        };
      });
      console.log(data);
      xlsx(data, tHeader, "列表excel");
    },

    // 头像上传成功
    async handleAvatarSuccess(res, file) {
      let { success, filename } = res;
      // 表示头像上传成功
      if (success) {
        let res = await this.$post("/RoomImg/Add", {
          roomId: this.roomId,
          imgUrl: filename,
        });
        //根据客房编号查询所有的客房图片
        let res1 = await this.$get("RoomImg/List", { roomId: this.roomId });
        this.fileList = res1.map((ele) => {
          return {
            roomImgId: ele.roomImgId,
            name: ele.imgUrl,
            url: this.BASE_URL_RoomImg + ele.imgUrl,
          };
        });
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
        this.$message.error("上传客房图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImg && isLt2M;
    },
    // 点击图片移除
    async handleRemove(file, fileList) {
      console.log(file, fileList);
      // 获取要删除图片的id
      let { roomImgId, name } = file;
      try {
        let { success, message } = await this.$post("/RoomImg/Delete", {
          roomImgId,
          filename: name,
        });
        console.log(success);
        if (success) {
          this.$message_alert_success(message);
        } else {
          this.$message_alert_error(message);
        }
      } catch (error) {}
    },
    // 点击图片预览
    handlePictureCardPreview(file) {
      // 设置大图地址
      this.dialogImageUrl = file.url;
      // 打开大图对话框
      this.dialogVisible2 = true;
    },
    // 点击关闭图片对话框
    handleClose1(done) {
      // 清空照片墙上面缓存的客房照片
      this.fileList = [];
      // 关闭照片墙
      done();
    },
    // 用于获取客房状态列表数据的方法
    async getRoomStateList() {
      this.roomStateList = await this.$get("RoomState/List");
      // 获取房间状态信息（房间状态没有入住）
      this.roomStateList2 = await this.$get("RoomState/ListToUpdate");
    },
    // 用于获取客房类型列表的方法：
    async getRoomList() {
      let res = await this.$get("RoomType/List");
      this.roomTypeList = res;
    },

    // 用于点击查询所触发的方法
    searchClick() {
      var getTableList1 = () => {
        console.log(1);
        this.getTableList();
      };
      // // this.$debounce1(getTableList1, 5000)
      // this.$refs.search.$on("change", () => {
      //   console.log(1);
      // });
      // console.log(this.$refs.search);
      // this.$refs.search.$debounce(getTableList1, 5000)();
      // this.$refs.search.$listeners()
      // this.$refs.search.$listeners.change(
      //   // this.$debounce(this.getTableList, 5000)
      //   () => {
      //     console.log(1);
      //   }
      // );
      // this.$debounce(getTableList1, 5000);
    },

    // 点击切换页码时触发
    currentChange(pageIndex) {
      // 设置当前页码
      this.pageIndex = pageIndex;
      // 然后重新调用获取表格数据的方法
      this.getTableList();
    },

    // 从后台获取表格数据的方法：
    async getTableList() {
      // 在页面中请求接口，获取房间信息数据
      let { data, count } = await this.$get("/Room/List", {
        roomTypeId: this.roomTypeId || 0,
        roomStateId: this.roomStateId || 0,
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
      // console.log(res);
    },

    // 点击编辑按钮触发的方法，编辑角色内容
    async handleEdit(index, row) {
      // 修改isAdd,表示为编辑
      this.isAdd = false;
      // 获取相应的登陆
      let roomId = row.roomId;
      let res = await this.$get("/Room/GetOne", { roomId });
      this.ruleForm = res;
      this.ruleForm.id = res.roomId;
      // 打开抽屉
      this.drawer = true;
    },
    // 点击查看客房房间图片
    async handleShowImg(index, row) {
      this.dialogVisible = true;
      // 获取客房编号
      this.roomId = row.roomId;
      //根据客房编号查询所有的客房图片
      let res = await this.$get("RoomImg/List", { roomId: this.roomId });
      console.log(res);
      this.fileList = res.map((ele) => {
        return {
          roomImgId: ele.roomImgId,
          name: ele.imgUrl,
          url: this.BASE_URL_RoomImg + ele.imgUrl,
        };
      });
    },
    // 点击删除按钮触发的方法
    async handleDelete(index, row) {
      // 是否确认删除
      await this.$confirm_("是否确定删除？");
      // 获取角色编号
      let roomId = row.roomId;
      // 删除对应的账户
      let { message, success } = await this.$post("/Room/Delete", {
        roomId,
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
              "/Room/Add",
              this.ruleForm
            );
            console.log(111);

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
              "/Room/Update",
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

.page {
  display: flex;
  justify-content: center;
}
</style>