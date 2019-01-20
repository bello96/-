<template>
    <div class="Goods">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/users">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加商品 -->
        <el-button type="success" style="margin-bottom:10px" @click="$router.push('/addgoods')" plain>添加商品</el-button>
        <!-- 商品列表 -->
        <el-table
            :data="goodsList"
           v-loading="loading"
            element-loading-text="正在加载..."
            element-loading-spinner="el-icon-loading"
            stripe
            style="width: 100%">
            <el-table-column type="index" :index="indexCerd" width="80"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称"></el-table-column>
            <el-table-column prop="goods_price" width="100" label="商品价值"></el-table-column>
            <el-table-column prop="goods_weight" width="100" label="商品重量"></el-table-column>
            <el-table-column width="200" label="创建时间">
                <template slot-scope="scope">
                   {{scope.row.add_time | dataFilter}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="DelGoods(scope.row)" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 搜索商品 -->
        <!-- 分页 -->
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[4, 6, 8 ,10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'>
        </el-pagination>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表数据
      goodsList: [],
      // 查询参数
      query: '',
      // 当前页
      currentPage: 1,
      // 每页显示的条数
      pageSize: 8,
      // 总条数
      total: 0,
      // 页面加载效果
      loading: true
    }
  },
  methods: {
    async getGoodsList() {
      this.loading = true
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { total, goods } } = res
      if (status === 200) {
        // 请求成功
        this.goodsList = goods
        this.total = total
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodsList()
    },
    // 自定义索引
    indexCerd(index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize
    },
    // 显示删除商品
    async DelGoods(user) {
      try {
        await this.$confirm('你确定要删除这个商品吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`goods/${user.goods_id}`)
        let { meta: { status, msg } } = res
        if (status === 200) {
          // 删除成功
          // 更新列表
          this.getGoodsList()
          // 提示
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      } catch (e) {
        // 失败
        this.$message.error('取消删除')
      }
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style>
</style>
