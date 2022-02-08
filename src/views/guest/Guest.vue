<template>
  <div>
    <!-- 信息添加搜索 -->
    <div class="search">
      <span>客房姓名:</span>
      <el-input
        placeholder="请输入内容"
        v-model="guestName"
        clearable
        size="mini"
        style="width: 200px; margin-right: 10px"
      >
      </el-input>
      <span>结账状态:</span>
      <el-select
        v-model="resideStateId"
        placeholder="请选择结账状态"
        :clearable="true"
        size="mini"
      >
        <el-option
          v-for="item in resideStateList"
          :key="item.resideStateId"
          :label="item.resideStateName"
          :value="item.resideStateId"
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
      <el-table-column label="客户姓名" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.guestName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户电话" width="100">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            {{ scope.row.phone }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="150">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            {{ scope.row.identityId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="入住房间" width="80">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            {{ scope.row.roomId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.room.roomType.roomTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.room.roomType.bedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.room.roomType.roomTypePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住日期" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.resideDate }}</span>
        </template> </el-table-column
      ><el-table-column label="离开日期" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.leaveDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押金" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.deposite }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.totalMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住人数" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.guestNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.resideStateId === 1 ? 'primary' : 'success'"
            disable-transitions
            >{{ scope.row.resideState.resideStateName }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            style="color: #67c23a"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            :disabled="scope.row.resideStateId === 2"
            type="text"
            size="mini"
            style="color: #e6a23c"
            @click="handleJieZhang(scope.$index, scope.row)"
            >结账</el-button
          >
          <el-button
            :disabled="scope.row.resideStateId === 1"
            size="mini"
            type="text"
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
          <el-form-item label="姓名" prop="guestName">
            <el-input v-model="ruleForm.guestName"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="identityId">
            <el-input v-model="ruleForm.identityId"></el-input>
          </el-form-item>
          <el-form-item label="客房类型" prop="roomTypeId">
            <el-select
              v-model="ruleForm.roomTypeId"
              placeholder="请选择"
              :clearable="true"
              size="mini"
              @change="roomTypeChange"
            >
              <el-option
                v-for="item in roomTypeList"
                :key="item.roomTypeId"
                :label="item.roomTypeName"
                :value="item.roomTypeId"
                class="searchC"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客房" prop="roomId">
            <el-select
              v-model="ruleForm.roomId"
              placeholder="请选择客房"
              :clearable="true"
              size="mini"
            >
              <el-option
                v-for="item in roomList"
                :key="item.roomId"
                :label="item.roomId"
                :value="item.roomId"
                :disabled="item.disabled"
                class="searchC"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="入住时间" prop="resideDate">
            <div class="block">
              <el-date-picker
                v-model="ruleForm.resideDate"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="押金" prop="deposite">
            <el-input v-model="ruleForm.deposite"></el-input>
          </el-form-item>
          <el-form-item label="入住人数" prop="guestNum">
            <el-input v-model="ruleForm.guestNum"></el-input>
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
//导入图片上传地址、查看房间图片根路径
import { Upload_RoomImg_URL, BASE_URL_RoomImg } from "../../config/index.js";
// 导入md5方法
import { strToMd5 } from "../../util/md5.js";
import xlsx from "../../excel/Export2Excel";
export default {
  data() {
    // 验证身份证号
    var validateIdentityId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号"));
      } else {
        callback();
      }
    };
    // 验证顾客姓名
    var validateGuestName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入顾客姓名"));
      } else {
        callback();
      }
    };
    // 验证电话号码
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话号码"));
      } else {
        callback();
      }
    };
    // 验证房间号
    var validateDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间号"));
      } else {
        callback();
      }
    };
    // 验证房间号
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间号"));
      } else {
        callback();
      }
    };
    // 验证入住日期
    var validateResideDate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住日期"));
      } else {
        callback();
      }
    };
    // 验证押金
    var validateDeposite = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入押金"));
      } else {
        callback();
      }
    };
    // 验证入住人数
    var validateGuestNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住人数"));
      } else {
        callback();
      }
    }; // 验证房间类型
    var validateRoomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间类型"));
      } else {
        callback();
      }
    };
    return {
      // 客户名称
      guestName: "",
      // 结账状态
      resideStateId: "",
      // 定义一个房间图片对应的房间号
      roomId: "",
      // 表格数据
      tableData: [],

      // 结账状态列表
      resideStateList: [],
      roomStateList2: [],
      // 客房类型列表
      roomTypeList: [],
      // 客房列表
      roomList: [],
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

      // 表单数据
      ruleForm: {
        // 身份证
        identityId: "",
        // 顾客名字
        guestName: "",
        // 顾客电话
        phone: "",
        // 房间号
        roomId: "",
        // 入住日期
        resideDate: "",
        // 押金
        deposite: "",
        // 入住人数
        guestNum: "",
        // 房间类型编号
        roomTypeId: "",
        pickerOptions: {
          shortcuts: [
            {
              text: "今天",
              onClick(picker) {
                picker.$emit("pick", new Date());
              },
            },
            {
              text: "昨天",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", date);
              },
            },
            {
              text: "一周前",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", date);
              },
            },
          ],
        },
      },
      // 表单的验证数据
      rules: {
        // 验证身份证号
        identityId: [{ validator: validateIdentityId, trigger: "blur" }],
        // 验证客户姓名
        guestName: [{ validator: validateGuestName, trigger: "blur" }],
        // 验证手机号
        phone: [{ validator: validatePhone, trigger: "blur" }],
        roomId: [{ validator: validateRoomId, trigger: "blur" }],
        resideDate: [{ validator: validateResideDate, trigger: "change" }],
        deposite: [{ validator: validateDeposite, trigger: "change" }],
        guestNum: [{ validator: validateGuestNum, trigger: "blur" }],
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "blur" }],
      },
    };
  },
  async created() {
    // 获取表格数据
    this.getTableList();
    // 获取房间类型列表的方法
    this.getResideStateList();
    // 获取房间类型列表的方法
    this.getRoomList();
  },
  methods: {
    // 当切换表单里的房间类型时触发的事件
    async roomTypeChange() {
      this.ruleForm.roomId = "";
      // 获取客房类型编号
      let roomTypeId = this.ruleForm.roomTypeId;
      // 根据客房类型编号编号获取对应的客房信息，客房状态必须是空闲
      let { data } = await this.$get("/Room/List", {
        roomTypeId,
        roomStateId: 1,
      });
      console.log(data);
      this.roomList = data;
    },
    // 用于获取客房类型列表的方法：
    async getRoomList() {
      let res = await this.$get("RoomType/List");
      this.roomTypeList = res;
      console.log(res);
    },

    // 把表格数据导出excel的方法
    excelClick() {
      // 导出数据
      const tHeader = {
        guestName: "客户姓名",
        phone: "客户电话",
        identityId: "身份证号",
        roomId: "入住房间",
        roomTypeName: "房间类型",
        bedNum: "床位数",
        price: "房间价格",
        resideDate: "入住日期",
        leaveDate: "离开日期",
        deposite: "押金",
        totalMoney: "消费金额",
        guestNum: "入住人数",
        resideStateName: "结账状态",
      };
      // 上面设置Excel的表格第一行的标题

      // 上面的index、nickName、name是tableData里对象的属性
      let data = this.tableData.map((v) => {
        return {
          guestName: v.guestName,
          phone: v.phone,
          identityId: v.identityId,
          roomId: v.roomId,
          roomTypeName: v.room.roomType.roomTypeName,
          bedNum: v.room.roomType.bedNum,
          price: v.room.roomType.roomTypePrice,
          resideDate: v.resideDate,
          leaveDate: v.leaveDate,
          deposite: v.deposite,
          totalMoney: v.totalMoney,
          guestNum: v.guestNum,
          resideStateName: v.resideState.resideStateName,
        };
      });
      console.log(data);
      xlsx(data, tHeader, "客户信息导出excel");
    },

    // 用于结账状态状态列表数据的方法
    async getResideStateList() {
      this.resideStateList = await this.$get("/ResideState/List");
      // 获取房间状态信息（房间状态没有入住）
      // this.resideStateList2 = await this.$get("resideState/ListToUpdate");
    },
    // 用于获取客房类型列表的方法：
    // async getResideList() {
    //   let res = await this.$get("resideType/List");
    //   this.resideStateList = res;
    // },

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

    // 从后台获取表格数据的方法：
    async getTableList() {
      // 在页面中请求接口，获取房间信息数据
      let { data, count } = await this.$get("/GuestRecord/List", {
        // 客户姓名
        guestName: this.guestName,
        // 客户结账编号
        resideStateId: this.resideStateId || 0,
        // 页码
        pageIndex: this.pageIndex,
      });
      console.log(data);
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
      let guestId = row.guestId;
      let res = await this.$get("/GuestRecord/GetOne", { guestId });

      this.ruleForm = res;
      // 给表单对象添加房间类型编号
      this.ruleForm.roomTypeId = res.room.roomTypeId;
      // 打开抽屉
      this.drawer = true;
    },
    // 点击结账
    async handleJieZhang(index, row) {
      console.log(row);
      // 是否确认删除
      await this.$confirm_("是否确定结账？");
      // 顾客id
      let guestId = row.guestId;
      let { totalMoney } = await this.$post("/GuestRecord/Checkout", {
        guestId,
      });
      if (totalMoney > 0) {
        this.$message_alert_success("结账成功！已支付");
        this.getTableList();
      } else {
        this.$message_alert_error("结账失败！");
      }
    },
    // 点击删除按钮触发的方法
    async handleDelete(index, row) {
      // 是否确认删除
      await this.$confirm_("是否确定删除？");
      // 顾客id
      let guestId = row.guestId;
      let res = await this.$get("/GuestRecord/GetOne", { guestId });
      // 判断是否已结账，如果未结账则不能删除
      if (res.resideState.resideStateId == 1) {
        this.$message_alert_error("删除失败，还未结账！");
        return;
      }
      // 删除对应的账户
      let { message, success } = await this.$post("/GuestRecord/Delete", {
        guestId,
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
              "/GuestRecord/Add",
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
              "/GuestRecord/Update",
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

.page {
  display: flex;
  justify-content: center;
}
</style>