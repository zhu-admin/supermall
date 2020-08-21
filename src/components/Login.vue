<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avtar_box">
        <img :src="loginLogo" alt />
      </div>
      <!-- 登录表单区 -->
      <!-- :rules="loginFromRules" 表单验证规则 -->
      <el-form
        ref="loginFromRef"
        :model="loginForm"
        :rules="loginFromRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-xingmingyonghumingnicheng"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // logo图片
      loginLogo: require("assets/logo.png"),
      //login表单数据
      loginForm: {
        username: "admin",
        password: "admin",
      },
      userLogin: {
        username: "admin",
        password: "admin",
      },
      // 表单验证规则
      loginFromRules: {
        // 验证用户名
        username: [
          // required：是否为必须填写项
          //message 错误信息
          // trigger 触发事件
          { required: true, message: "请输入登录名称", trigger: "blur" },
          //min，max 长度区间
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  components: {},

  methods: {
    //点击重置表单
    resetLoginFrom() {
      this.$refs.loginFromRef.resetFields();
    },
    // 登录验证
    login() {
      this.$refs.loginFromRef.validate((valid) => {
        if (valid) {
          if (
            this.loginForm.username === this.userLogin.username &&
            this.loginForm.password === this.userLogin.password
          ) {
            this.$message({ message: "登录成功", type: "success" });
            window.localStorage.setItem("token", "token");
            setTimeout(() => {
              this.$router.push("/home");
            }, 1000);
          } else {
            this.$message.error("请输入正确的用户名和密码");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avtar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>