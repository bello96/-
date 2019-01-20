<template>
    <div class="addgoods">
        <!-- 步骤条 -->
        <el-steps :active="active" finish-status="success">
            <el-step title="步骤 1" description="基本信息"></el-step>
            <el-step title="步骤 2" description="商品图片"></el-step>
            <el-step title="步骤 3" description="商品内容"></el-step>
        </el-steps>
        <!-- tap栏 -->
        <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="basic">
                <el-form :model="addForm" status-icon ref="addForm" :rules="rules" label-width="80px">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input placeholder="请输入商品名称" v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input placeholder="请输入商品价格" v-model="addForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                         <el-input placeholder="请输入商品重量" v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input placeholder="请输入商品数量" v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-cascader
                            :options="options"
                            :props="props"
                            v-model="addForm.goods_cat"
                            clearable
                            change-on-select>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="是否促销">
                        <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
                        <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
                    </el-form-item>
                    <!-- 下一步 -->
                    <el-button type="primary" @click="nexts">下一步</el-button>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="pic">
                <el-upload
                    class="upload-demo"
                    action="http://localhost:8888/api/private/v1/upload"
                    :on-success="handleSuccess"
                    :headers="headers"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传图片</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                 <!-- 下一步 -->
                <el-button style="margin-top:50px" type="primary" @click="nextstow">下一步</el-button>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="content">
                <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                <el-button type="success" @click="addGoodsList" style="margin-top:10px" plain>确定添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'basic',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        is_promote: true,
        goods_cat: [],
        pics: [],
        goods_introduce: ''
      },
      radio: 1,
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 校验添加分类
      rules: {
        goods_name: [
          { required: true, message: '商品名称不能为空', trigger: 'change' }
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'change' }
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'change' }
        ],
        goods_weight: [
          { required: true, message: '商品名称不能为空', trigger: 'change' }
        ]
      },
      headers: { Authorization: localStorage.getItem('token') }
    }
  },
  methods: {
    handleClick(tab) {
      this.active = +tab.index + 1
    },
    // 下一步
    nexts() {
      // 校验
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 校验通过
          // 下一步
          this.active = 1
          this.activeName = 'pic'
        } else {
          return false
        }
      })
    },
    // 下一步
    nextstow() {
      this.active = 2
      this.activeName = 'content'
    },
    // 图片上传成功后
    handleSuccess(res) {
      let { meta: { status }, data: { tmp_path: tmpPath } } = res
      if (status === 200) {
        this.addForm.pics.push({
          pic: tmpPath
        })
      }
    },
    // 确定添加商品
    async addGoodsList() {
      let res = await this.axios({
        url: 'goods',
        method: 'post',
        data: {
          goods_name: this.addForm.goods_name,
          goods_price: this.addForm.goods_price,
          goods_weight: this.addForm.goods_weight,
          goods_number: this.addForm.goods_number,
          is_promote: this.addForm.is_promote,
          goods_cat: this.addForm.goods_cat.join(),
          pics: this.addForm.pics,
          goods_introduce: this.addForm.goods_introduce
        }
      })
      let { meta: { msg, status } } = res
      if (status === 201) {
        // 添加成功
        this.$router.push('/goods')
        // 提示用户
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    }
  },
  async created() {
    let res = await this.axios.get('categories?type=3')
    let { meta: { status }, data } = res
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 400px;
  }
}
</style>
