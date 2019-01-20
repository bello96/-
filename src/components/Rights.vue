<template>
    <div class="rights">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/rights">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 权限列表 -->
        <el-table :data="rightsList" stripe style="width: 100%">
            <el-table-column type="index" width="100"></el-table-column>
            <el-table-column prop="authName" label="权限名称"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="层级">
                <template slot-scope="scope">
                    <span v-if="scope.row.level==='0'">一级</span>
                    <span v-if="scope.row.level==='1'">二级</span>
                    <span v-if="scope.row.level==='2'">三级</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      let res = await this.axios({
        url: 'rights/list',
        method: 'get'
      })
      let { data, meta: { status } } = res
      if (status === 200) {
        // 获取成功
        // 渲染到页面上
        this.rightsList = data
      }
    }
  },
  created() {
    // 进入页面发送请求获取数据渲染到页面上
    this.getRightsList()
  }
}
</script>

<style>
</style>
