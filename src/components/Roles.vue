<template>
    <div class="roles">
       <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/rights">角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加角色按钮 -->
        <el-button type="success" style="margin-bottom:10px" plain @click="showAddRoles">添加角色</el-button>
        <!-- 角色列表 -->
        <el-table :data="rolesList" stripe style="width: 100%">
            <el-table-column type="expand" width="50">
                <template slot-scope="scope">
                    <!-- 暂无权限提示 -->
                    <el-row v-if="scope.row.children.length === 0">
                        暂无权限
                    </el-row>
                    <el-row class="item1" v-for="item1 in scope.row.children" :key="item1.id">
                       <el-col :span="4">
                           <el-tag closable @close="delRoles(scope.row,item1.id)">{{item1.authName}}</el-tag>
                       </el-col>
                       <el-col :span="20">
                            <el-row class="item2" v-for="item2 in item1.children" :key="item2.id">
                                <el-col :span="4">
                                    <el-tag type="success" @close="delRoles(scope.row,item2.id)" closable>{{item2.authName}}</el-tag>
                                </el-col>
                                <el-col :span="20">
                                    <el-tag class="item3" type="danger" @close="delRoles(scope.row,item3.id)" closable v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                       </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="showEditRolele(scope.row)" size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="delRolele(scope.row.id)"  size="mini" plain></el-button>
                    <el-button type="success" icon="el-icon-check" @click="showDisplayMode(scope.row)" size="mini" plain>分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
         <!-- 添加角色的模态框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="showDialogVisible"
            width="40%">
            <el-form :model="addRolesList" :rules="rules" status-icon ref="addRolesList" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRolesList.roleName"></el-input>
                </el-form-item>
                 <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="AddRolesUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改角色模态框 -->
        <el-dialog
            title="修改角色"
            :visible.sync="showEditVisible"
            width="40%">
            <el-form :model="editRolesList" status-icon :rules="rules" ref="editRolesList" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRolesList.roleName"></el-input>
                </el-form-item>
                 <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRolesList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoles">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限模态框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="showDisplayModeVisible"
            width="40%">
            <el-tree
              :data="rightList"
              show-checkbox
              node-key="id"
              ref="tree"
              default-expand-all
              :props="defaultProps">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDisplayModeVisible = false">取 消</el-button>
                <el-button type="primary" @click="assignRight">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 添加用户列表
      addRolesList: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色数据
      editRolesList: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 角色id
      rolesId: '',
      // 添加角色列表的模态框显示与否
      showDialogVisible: false,
      // 修改角色列表的模态框显示与否
      showEditVisible: false,
      // 分配权限列表的模态框显示与否
      showDisplayModeVisible: false,
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'change' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'change' }
        ],
        roleDesc: [
          {
            min: 2,
            max: 18,
            message: '长度在 3 到 5 个字符',
            trigger: 'change'
          }
        ]
      },
      // 显示树形控件
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    // 渲染角色列表数据信息
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
    // 树形菜单所有的权限数据信息
    async getRightList() {},
    // 删除角色权限
    async delRoles(scopeRow, roleId) {
      // 发送请求
      let res = await this.axios({
        url: `roles/${scopeRow.id}/rights/${roleId}`,
        method: 'delete'
      })
      let { data, meta: { status, msg } } = res
      if (status === 200) {
        // 删除成功
        scopeRow.children = data
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    // 删除角色
    async delRolele(id) {
      try {
        await this.$confirm('你确定要删除这个角色吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 根据id发送请求,删除当前角色
        let res = await this.axios.delete(`roles/${id}`)
        let { meta: { status, msg } } = res
        if (status === 200) {
          // 删除成功
          this.getRolesList()
          this.$message.success(msg)
        }
      } catch (e) {
        this.$message.error('删除失败')
      }
    },
    // 添加角色的模态框
    showAddRoles() {
      // 点击添加按钮,显示添加角色的模态框
      this.showDialogVisible = true
    },
    // 确定添加角色
    AddRolesUser() {
      this.$refs.addRolesList.validate(async valid => {
        if (valid) {
          // 发送axjia请求
          let res = await this.axios({
            url: 'roles',
            method: 'post',
            data: this.addRolesList
          })
          let { meta: { msg, status } } = res
          if (status === 201) {
            // 创建成功
            // 清空模态框内容
            this.$refs.addRolesList.resetFields()
            // 关闭模态框
            this.showDialogVisible = false
            // 重新渲染列表
            this.getRolesList()
            // 提示超成功
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        } else {
          return false
        }
      })
    },
    // 修改用户模态框
    showEditRolele(user) {
      this.showEditVisible = true
      // 数据回显
      this.editRolesList.roleDesc = user.roleDesc
      this.editRolesList.roleName = user.roleName
      this.editRolesList.id = user.id
    },
    // 确定修改角色
    editRoles() {
      this.$refs.editRolesList.validate(async valid => {
        if (valid) {
          // 成功
          let res = await this.axios({
            url: `roles/${this.editRolesList.id}`,
            method: 'put',
            data: this.editRolesList
          })
          //   console.log(res)
          let { meta: { msg, status } } = res
          if (status === 200) {
            // 修改成功
            // 内容清空
            this.$refs.editRolesList.resetFields()
            // 关闭模态框
            this.showEditVisible = false
            // 重新渲染列表
            this.getRolesList()
            // 提示用户
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        } else {
          return false
        }
      })
    },
    // 显示分配权限列表
    async showDisplayMode(user) {
      // 这里需要把角色roleId存起来
      // console.log(user.id)
      this.rolesId = user.id
      // console.log(user)
      // 获取所有权限的信息
      this.showDisplayModeVisible = true
      let res = await this.axios({
        url: 'rights/tree',
        method: 'get'
      })
      let { data, meta: { status } } = res
      if (status === 200) {
        // 获取成功
        // 渲染到页面上
        this.rightList = data
      }
      // 显示默认选中的权限
      this.$nextTick(() => {
        // 获取所有的三级权限的id
        let temp = []
        user.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              temp.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 确定分配权限
    async assignRight() {
      // 点击确定按钮获取到每个每个权限的id(这个只有当前权限全选择才能得到)
      let checkout = this.$refs.tree.getCheckedKeys()
      // 获取半选中的id
      let halfcheckout = this.$refs.tree.getHalfCheckedKeys()
      let all = [...checkout, ...halfcheckout] // 扩展运算符 可以展开数组和对象
      // 发送axios请求
      let res = await this.axios.post(`roles/${this.rolesId}/rights`, {
        rids: all.join()
      })
      let { meta: { msg, status } } = res
      if (status === 200) {
        // 更新成功
        // 关闭模态框
        this.showDisplayModeVisible = false
        // 重新渲染角色列表
        this.getRolesList()
        // 提示用户成功
        this.$message.success(msg)
      }
    }
  },
  // 钩子函数,进入页面就触发
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.item1 {
  margin-bottom: 20px;
}
.item2 {
  margin-bottom: 5px;
}
.item3 {
  margin-bottom: 10px;
  margin-left: 10px;
}
</style>
