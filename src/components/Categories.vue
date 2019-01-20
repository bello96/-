<template>
    <div class="categories">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/users">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加按钮 -->
        <el-button type="success" style="margin-bottom:10px" plain @click="showAddCategories">添加分类</el-button>
        <!-- 商品分类列表 -->
        <el-table
            :data="categoryList"
            v-loading="loading"
            element-loading-text="正在加载..."
            element-loading-spinner="el-icon-loading"
            stripe
            style="width: 100%">
            <el-table-tree-column prop="cat_name" tree-key="cat_id" parent-key="cat_pid" level-key="cat_level" :indentSize="20" label="分类名称"></el-table-tree-column>
            <el-table-column prop="cat_deleted" label="是否删除">
                <template slot-scope="scope">
                    {{scope.row.cat_deleted?'是':'否'}}
                </template>
            </el-table-column>
            <el-table-column prop="cat_level" label="排序"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditBox(scope.row)" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDelCategorie(scope.row.cat_id)" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页功能 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[4, 6,8,10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'>
        </el-pagination>
        <!-- 添加分类模态框 -->
        <el-dialog
          title="添加分类"
          :visible.sync="showAddCategoriesVisible"
          width="40%">
          <el-form label-width="100px" status-icon :model="addCategoriesFrom" ref="addCategoriesFrom" :rules="rules" class="demo-ruleForm">
              <el-form-item label="分类名称" prop="cat_name">
                <el-input placeholder="请输入分类名" v-model="addCategoriesFrom.cat_name"></el-input>
              </el-form-item>
              <el-form-item label="父级名称" prop="cat_pid">
                <el-cascader
                  :options="options"
                  change-on-select
                  v-model="addCategoriesFrom.cat_pid"
                  :props="props"
                  :value="addCategoriesFrom.cat_pid"
                  clearable>
                </el-cascader>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAddCategoriesVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddCategories">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 显示修改的模态框 -->
        <el-dialog
          title="修改分类名称"
          :visible.sync="showEditVisible"
          width="40%">
          <el-form label-width="100px" status-icon :model="editCategoriesFrom" ref="editCategoriesFrom" :rules="rules" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input placeholder="请输入分类名" v-model="editCategoriesFrom.cat_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCategorie">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表
      categoryList: [],
      // 分页当前页
      currentPage: 1,
      // 一页条数
      pageSize: 6,
      // 总条数
      total: 0,
      // 页面加载效果
      loading: true,
      // 显示添加分类模态框
      showAddCategoriesVisible: false,
      // 修改模态框
      showEditVisible: false,
      // 添加分类数据
      addCategoriesFrom: {
        cat_pid: [],
        cat_name: ''
      },
      // 修改分类数据
      editCategoriesFrom: {
        cat_name: '',
        cat_id: ''
      },
      // 校验添加分类
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'change' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'change' }
        ]
      },
      // 父级分类数据
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    // 分页改变每页显示条数
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getCategoryList()
    },
    // 点击指定页码
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    },
    // 进入页面发送请求获取数据渲染在页面上
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { result, total } } = res
      if (status === 200) {
        // 获取成功
        // 渲染到页面上
        this.categoryList = result
        this.total = total
        this.loading = false
      }
    },
    // 显示添加分类模态框
    async showAddCategories() {
      this.showAddCategoriesVisible = true
      // 获取分类的二级数据
      let res = await this.axios.get('categories?type=2')
      let { meta: { status }, data } = res
      if (status === 200) {
        // 获取成功
        this.options = data
      }
    },
    // 点击确定按钮
    AddCategories() {
      this.$refs.addCategoriesFrom.validate(async valid => {
        if (!valid) return false
        // 发送请求
        let { cat_name: catName, cat_pid: catPid } = this.addCategoriesFrom
        let res = await this.axios.post('categories', {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        let { meta: { msg, status } } = res
        if (status === 201) {
          // 创建成功
          // 清空内容
          this.$refs.addCategoriesFrom.resetFields()
          // 关闭模态框
          this.showAddCategoriesVisible = false
          // 重新渲染
          this.getCategoryList()
          // 提示用户
          this.$message.success(msg)
        }
      })
    },
    // 删除分类模态框
    async showDelCategorie(id) {
      try {
        await this.$confirm('你确定要删除这个分类吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 确定
        // 发送axios请求
        let res = await this.axios({
          url: `categories/${id}`,
          method: 'delete'
        })
        let { meta: { msg, status } } = res
        if (status === 200) {
          // 删除成功
          // 重新渲染
          this.getCategoryList()
          this.$message.success(msg)
        }
      } catch (e) {
        this.$message.error('删除失败')
      }
    },
    // 显示修改模态框
    showEditBox(user) {
      this.editCategoriesFrom.cat_name = user.cat_name
      this.editCategoriesFrom.cat_id = user.cat_id
      this.showEditVisible = true
    },
    // 确定修改
    editCategorie() {
      this.$refs.editCategoriesFrom.validate(async valid => {
        if (!valid) return false
        // 发送axios请求
        let res = await this.axios({
          url: `categories/${this.editCategoriesFrom.cat_id}`,
          method: 'put',
          data: {
            cat_name: this.editCategoriesFrom.cat_name
          }
        })
        let { meta: { msg, status } } = res
        if (status === 200) {
          // 跟新成功
          // 清空内容
          this.$refs.editCategoriesFrom.resetFields()
          // 关闭模态框
          this.showEditVisible = false
          // 重新渲染
          this.getCategoryList()
          // 提示用户
          this.$message.success(msg)
        }
      })
    }
  },
  created() {
    // 钩子函数,进入页面发送请求,渲染在页面上
    this.getCategoryList()
  }
}
</script>

<style>
</style>
