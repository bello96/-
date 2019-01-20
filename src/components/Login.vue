<template>
    <div class="login">
        <!-- el-from: 表单组件 -->
        <!-- :model="form" : form对象用来收集表单中所有的数据 -->
        <!-- label-width:设置label的宽度 -->
        <el-form :model="form" :rules="rules" ref="form" status-icon label-width="80px">
            <img src="../assets/1234.jpg" alt="">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入密码" @keyup.enter.native="onLogin" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onLogin">登录</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '请输入正确的用户名', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { min: 6, max: 12, message: '请输入正确的密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onLogin() {
      // 登录
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 发送请求
          let res = await this.axios({
            url: '/login',
            method: 'post',
            data: this.form
          })
          let { data: { token }, meta: { msg, status } } = res
          if (status === 200) {
            // 提示登录成功
            this.$message.success(msg)
            // 获取登录成功后后台返回的token(这里当登录成功后,需要先获取存储token,在进行跳转组件到home,如果先跳转后存储是不行的,因为做了导航守卫,每次跳转路由都会进行校验是否有token,当你要跳转路由时,检测到token不存在所有跳转不了!!!)
            // 将返回的token存储到localStorage中
            localStorage.setItem('token', token)
            // 跳转到home组件
            this.$router.push('/home')
          } else {
            // 提示登录失败
            this.$message.error(msg)
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      // 重置
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less">
// vue脚手架给我们配置了less的 配置,但是并没有安装,如果需要用到,需要下载安装 less和less-loader  sass同理
// yarn add less less-loader -D 下载
.login {
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    height: 200px;
    padding: 75px 40px 15px;
    border-radius: 20px;
    background-color: #fff;
    margin: 200px auto;
    position: relative;
    img {
      position: absolute;
      transform: translateX(-50%);
      left: 50%;
      top: -80px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button {
      margin-left: 50px;
    }
  }
}
</style>
