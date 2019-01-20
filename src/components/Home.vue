<template>
    <div class="home">
        <el-container>
            <el-header>
                <div class="logo">
                </div>
                <div class="logout">
                    欢迎光临
                    <el-button type="error" @click="logout">退出</el-button>
                </div>
                <div class="title">
                    <h1>电商后台管理系统</h1>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                  <!-- el-menu: 菜单组件 -->
                  <!-- default-active: 进入页面默认选中的菜单 -->
                  <!-- el-submenu: 每一个子菜单 -->
                  <!-- unique-opened: 每次只能打开一个子菜单 -->
                  <el-menu
                    :default-active="$route.path"
                    class="el-menu-vertical-demo"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    unique-opened
                    router>
                    <!-- 一级菜单 -->
                    <el-submenu :index="'/'+ item1.path" v-for="item1 in menuList" :key="item1.id">
                      <template slot="title" style="min-width:200px">
                        <i class="el-icon-location"></i>
                        <span>{{item1.authName}}</span>
                      </template>
                      <!-- 二级菜单1 -->
                        <el-menu-item :index="'/'+ item2.path" v-for="item2 in item1.children" :key="item2.id">
                          <i class="el-icon-menu"></i>
                          <span slot="title">{{item2.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                  </el-menu>
                </el-aside>
                <el-main>
                  <!-- 配置home组件的子路由的出口 -->
                  <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单
      menuList: []
    }
  },
  methods: {
    // 退出登录
    async logout() {
      try {
        await this.$confirm('你确定要退出登录吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 退出将token清除
        localStorage.removeItem('token')
        // 跳转到登录组件
        this.$router.push('./login')
        // 提示退出成功
        this.$message.success('退出成功')
      } catch (e) {
        this.$message.error('取消退出')
      }
    },
    users() {
      this.$router.push('./users')
    }
  },
  async created() {
    // 进入页面根据不同的用户拥有不同的权限 发送请求,经左侧菜单渲染出来
    let res = await this.axios({
      url: 'menus',
      method: 'get'
    })
    let { data, meta: { status } } = res
    if (status === 200) {
      // 获取左侧权限成功 渲染到页面上
      this.menuList = data
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;
  .el-container:nth-child(1) {
    width: 100%;
    height: 100%;
    .el-header {
      background-color: #b3c0d1;
      height: 100px;
      width: 100%;
      .logo {
        width: 180px;
        height: 60px;
        float: left;
        background-image: url('../assets/logo.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      .logout {
        float: right;
        height: 60px;
        width: 180px;
        line-height: 60px;
        text-align: right;
        font-weight: 700;
        a {
          color: red;
        }
      }
      .title {
        height: 60px;
        overflow: hidden;
        text-align: center;
        line-height: 60px;
        color: #fff;
        font-size: 20px;
      }
    }
    .el-container:nth-child(2) {
      width: 100%;
      height: 100%;
      .el-aside {
        height: 100%;
        background-color: rgb(84, 92, 100);
        .el-submenu {
          width: 200px;
        }
      }
      .el-main {
        background-color: #e9eef3;
        color: #333;
      }
    }
  }
}
</style>
