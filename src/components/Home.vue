<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="logo" :src="img.logo" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="togo-btn" @click="togoNavBar">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          router
          :default-active="activePath"
          :collapse-transition="false"
          :collapse="iscollapse"
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id" v-for="item in navBarData" :key="item.id">
            <!-- 一级菜单模版区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.title}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavStart('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.title}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 图片
      img: {
        // logo
        logo: require("assets/img/logo.png"),
      },
      // 侧导航字体图标
      iconsObj: {
        "1": "iconfont icon-geren",
        "2": "iconfont icon-permission",
        "3": "iconfont icon-shangpinguanli",
        "4": "iconfont icon-icon-dingdan",
        "5": "iconfont icon-shujutongji-copy",
      },
      // 侧导航数据
      navBarData: [
        {
          id: "1",
          title: "用户管理",
          path: "null",
          children: [
            {
              id: "1-1",
              title: "用户列表",
              path: "userList",
            },
          ],
        },
        {
          id: "2",
          title: "权限管理",
          path: "null",
          children: [
            {
              id: "2-1",
              title: "角色列表",
              path: "jsList",
            },
            {
              id: "2-2",
              title: "权限列表",
              path: "qsList",
            },
          ],
        },
        {
          id: "3",
          title: "商品管理",
          path: "null",
          children: [
            {
              id: "3-1",
              title: "商品列表",
              path: "spList",
            },
            {
              id: "3-2",
              title: "分类参数",
              path: "classcs",
            },
            {
              id: "3-3",
              title: "商品分类",
              path: "spclass",
            },
          ],
        },
        {
          id: "4",
          title: "订单管理",
          path: "null",
          children: [
            {
              id: "3-1",
              title: "商品列表",
              path: "spList",
            },
          ],
        },
        {
          id: "5",
          title: "数据统计",
          path: "dataStats",
          children: [
            {
              id: "3-1",
              title: "商品列表",
              path: "spList",
            },
          ],
        },
      ],
      // 控制侧导航折叠展开
      iscollapse: false,
      //被激活的连接地址
      activePath: "",
    };
  },

  components: {},

  created() {
    this.activePath = window.localStorage.getItem("activePath");
  },

  methods: {
    // 退出登录
    exit() {
      window.localStorage.removeItem("token");
      this.$message({ message: "退出成功", type: "success" });
      setTimeout(() => {
        this.$router.push("/login");
      }, 1000);
    },
    // 点击按钮切换菜单折叠与展开
    togoNavBar() {
      this.iscollapse = !this.iscollapse;
    },
    //保存连接的激活状态
    saveNavStart(activePath) {
      window.localStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.logo {
  width: 50px;
  height: 50px;
}
.iconfont {
  margin-right: 10px;
}
.togo-btn {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.4em;
  cursor: pointer;
}
</style>