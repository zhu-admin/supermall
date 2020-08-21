<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 索搜与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="searchList(queryInfo.query)"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchList(queryInfo.query)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border>
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStartChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 点击添加弹出的对话框 -->
    <!-- :visible.sync 控制显示隐藏 -->
    <el-dialog title="添加用户" @close="addDialogClosed" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击编辑弹出的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    // 验证手机号的规则
    var checkPhone = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regEmail = /^1[34578]\d{9}$/;
      if (regEmail.test(value)) {
        // 合法手机号
        return callback();
      } else {
        // 不合法手机号
        callback(new Error("请输入合法手机号"));
      }
    };
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      } else {
        // 不合法邮箱
        callback(new Error("请输入合法邮箱"));
      }
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前的页码
        page: 1,
        // 当前每页显示多少条数据
        pageSize: 2,
      },
      //用户列表数据
      userList: [
        {
          id: 1,
          username: "admin",
          email: "asd@qq.com",
          phone: "12306",
          role_name: "超级管理员",
          mg_state: true,
        },
        {
          id: 2,
          username: "liken",
          email: "bbb@qq.com",
          phone: "10010",
          role_name: "测试员",
          mg_state: true,
        },
      ],
      // 共计多少条数据
      total: 0,
      // 添加按钮对话框显示隐藏
      addDialogVisible: false,
      // 修改按钮对话框显示隐藏
      editDialogVisible: false,
      //添加用户的表单验证规则对象
      addFormRules: {
        // 用户名验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // 密码验证规则
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // 邮箱验证规则
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        // 手机号验证规则
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      //添加用户的表单数据对象
      addForm: {
        username: "",
        password: "",
        email: "",
        phone: "",
      },
    };
  },

  components: {},

  methods: {
    //监听pagesize改变
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    //监听页码值改变
    handleCurrentChange(val) {
      this.queryInfo.page = val;
      console.log(`当前页: ${val}`);
    },
    //监听开关状态改变
    userStartChanged(userinfo) {
      console.log(userinfo);
    },
    //查询表单
    searchList(searchInfo) {
      console.log(searchInfo);
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        console.log(valid);
        if (valid) {
          //发请求
          this.addDialogVisible = false;
        } else {
          return;
        }
      });
    },
    // 展示编辑的对话框
    showEditDialog(id) {
      // console.log(id);
      // 根据id调用接口
      this.editDialogVisible = true;
    },
    //根据id删除用户的对应信息
    removeUserById(id) {
      console.log(id);
      // 弹框
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 确认
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        //取消
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },

  mounted() {
    this.total = this.userList.length;
  },
};
</script>

<style scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>