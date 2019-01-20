<template>
    <div class="users">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/users">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索功能 + 用户添加-->
        <div>
            <el-input placeholder="请输入搜索关键字" v-model="query" @keyup.enter.native="search" class="input-width-select">
                <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
            </el-input>
            <el-button type="success" @click="showAddDialog" plain>添加用户</el-button>
        </div>
        <!-- 表格展示功能 -->
        <el-table :data="userList" style="width: 100%">
            <el-table-column prop="username" label="姓名" width="180"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column  label="状态" width="180">
                 <template slot-scope="scope">
                     <el-switch
                        v-model="scope.row.mg_state"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="changeState(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)" size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)" size="mini" plain></el-button>
                    <el-button type="success" icon="el-icon-check" size="mini" plain @click="showRoleDialog(scope.row)">分配角色</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页功能 -->
        <el-pagination
            :total="total"
            :page-size="pageSize"
            background
            @current-change="handleCurrentChange"
            :page-sizes="[2, 4, 6, 8]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange">
        </el-pagination>

        <!-- 添加用户模态框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="showAddDialogVisible"
          width="40%">
          <el-form :model="addForm" label-width="100px" status-icon :rules="rules" ref="addForm" class="demo-ruleForm">
              <el-form-item label="用户名" prop="username">
                <el-input placeholder="请输入用户名" v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input placeholder="请输入邮箱" v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input placeholder="请输入手机号" v-model="addForm.mobile"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAddDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 编辑用户会话框 -->
        <el-dialog
          title="编辑用户"
          :visible.sync="showEditDialogVisible"
          width="40%">
          <el-form :model="editForm" label-width="100px" status-icon :rules="rules" ref="editForm" class="demo-ruleForm">
            <el-form-item label="用户名">
              <el-tag type="info">{{editForm.username}}</el-tag>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showEditDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 分配角色模态框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="showRoleDialogVisible"
            width="40%">
            <el-form :model="assignForm" ref="assignForm" status-icon label-width="100px" :rules="rules" class="demo-ruleForm">
              <el-form-item label="用户名">
                <el-tag type="info">{{assignForm.username}}</el-tag>
              </el-form-item>
              <el-form-item label="角色列表" prop="rid">
                <el-select v-model="assignForm.rid" placeholder="请选择角色名称">
                  <el-option
                    v-for="item in rolesList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="RolesDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      query: '', // 查询关键字
      pageNum: 1, // 当前页
      pageSize: 6, // 每页显示条数
      total: 0, // 总页数
      userList: [], // 用户列表数据
      showAddDialogVisible: false, // 是否显示添加用户对话框
      showEditDialogVisible: false, // 是否显示编辑用户对话框
      showRoleDialogVisible: false, // 是否显示分配角色的对话框
      // 添加用户的表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户的表单信息
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 分配角色表单信息
      assignForm: {
        username: '',
        id: '',
        rid: ''
      },
      // 角色列表信息
      rolesList: [],
      // 校验添加用户
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          {
            min: 4,
            max: 12,
            message: '长度在 4 到 12 个字符',
            trigger: 'change'
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ],
        rid: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 获取角色列表信息
    async getRolesList() {
      let res = await this.axios({
        url: 'roles',
        method: 'get'
      })
      let { data, meta: { status } } = res
      if (status === 200) {
        // 获取成功
        this.rolesList = data
      }
    },
    // 获取用户列表
    async getUserList() {
      let res = await this.axios({
        url: '/users',
        method: 'get',
        params: {
          query: this.query, // 查询关键字
          pagenum: this.pageNum, // 当前页
          pagesize: this.pageSize // 每页显示条数
        }
      })
      let { data: { users, total }, meta: { status } } = res
      if (status === 200) {
        // 获取成功
        this.userList = users
        this.total = total
      }
    },
    handleCurrentChange(val) {
      // val 是当前页
      this.pageNum = val
      // 发送请求
      this.getUserList()
    },
    handleSizeChange(val) {
      this.pageNum = 1
      // val 是每页显示的条数
      this.pageSize = val
      // 发送请求
      this.getUserList()
    },
    // 搜索
    search() {
      this.pageNum = 1
      // 发送请求
      this.getUserList()
    },
    // 删除用户
    async delUser(id) {
      // 弹出模态框
      try {
        await this.$confirm('你确定要删除该用户吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 删除成功,发送请求
        let res = await this.axios({
          url: `/users/${id}`,
          method: 'delete'
        })
        let { meta: { status } } = res
        if (status === 200) {
          // 删除成功
          this.getUserList()
          // 提示成功
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.error('删除失败')
      }
    },
    // 显示添加用户对话框
    showAddDialog() {
      this.showAddDialogVisible = true
    },
    // 提交添加用户
    submitForm() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 发送ajax请求
          let res = await this.axios({
            url: 'users',
            method: 'post',
            data: this.addForm
          })
          let { meta: { msg, status } } = res
          if (status === 201) {
            // 创建成功
            // 提示用户
            this.$message.success(msg)
            // 将模态框内容清空
            this.$refs.addForm.resetFields()
            // 关闭模态框
            this.showAddDialogVisible = false
            // 重新渲染到最后一页
            this.total++
            this.pageNum = Math.ceil(this.total / this.pageSize)
            // 重新渲染用户列表
            this.getUserList()
          } else {
            this.$message.error(msg)
          }
        } else {
          return false
        }
      })
    },
    // 显示编辑用户的对话框
    showEditDialog(user) {
      // 显示编辑框
      this.showEditDialogVisible = true
      // 将user中的值回显到editForm表单中,因为是双向绑定的,会实时同步
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    // 确认修改用户信息按钮
    editUser() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          // 发送ajxa请求
          let res = await this.axios({
            url: `users/${this.editForm.id}`,
            method: 'put',
            data: this.editForm
          })
          let { meta: { msg, status } } = res
          if (status === 200) {
            // 修改成功
            // 清空模态框内容
            this.$refs.editForm.resetFields()
            // 更新表单列表
            this.getUserList()
            // 关闭模态框
            this.showEditDialogVisible = false
            // 提示用户修改成功
            this.$message.success(msg)
          } else {
            // 提示用户修改失败
            this.$message.error(msg)
          }
        } else {
          return false
        }
      })
    },
    // 修改用户的状态
    async changeState({ id, mg_state: mgSstate }) {
      // 发送请求
      let res = await this.axios({
        url: `/users/${id}/state/${mgSstate}`,
        method: 'put'
      })
      let { meta: { status, msg } } = res
      if (status === 200) {
        // 设置成功,提示用户
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    // 显示分配角色模态框
    async showRoleDialog(user) {
      let res = await this.axios.get(`users/${user.id}`)
      let { meta: { status }, data: { rid } } = res
      if (status === 200) {
        if (rid === -1) {
          rid = ''
        }
        this.assignForm.rid = rid
      }
      this.assignForm.username = user.username
      this.assignForm.id = user.id
      this.getRolesList()
      this.showRoleDialogVisible = true
    },
    // 确定分配角色
    RolesDialog() {
      this.$refs.assignForm.validate(async valid => {
        if (valid) {
          // 发送ajax请求
          let res = await this.axios.put(`users/${this.assignForm.id}/role`, {
            rid: this.assignForm.rid
          })
          let { meta: { msg, status } } = res
          if (status === 200) {
            // 设置成功
            // 关闭模态框
            this.showRoleDialogVisible = false
            // 重置表单
            this.$refs.assignForm.resetFields()
            // 重新渲染列表
            this.getRolesList()
            // 提示用户
            this.$message.success(msg)
          }
        } else {
          return false
        }
      })
    }
  },
  // 钩子函数,users组件页面一加载发送ajiax请求,获取数据渲染到页面上
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 280px;
  margin: 10px 0;
}
</style>
