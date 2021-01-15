<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.name"
        clearable
        size="small"
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入模板名"
        @keyup.enter.native="handleFind"
      />

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        size="small"
        plain
        @click="handleFind"
      >搜索</el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        size="small"
        @click="handleReset"
      >重置</el-button>
      <el-button
        class="filter-item"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="handleAdd"
      >添加</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="模板名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="业务ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bizType }}</span>
        </template>
      </el-table-column>

      <el-table-column label="业务类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bizId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="文件名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handlePreview(scope.row)">预览</el-button>
          <el-button type="text" icon="el-icon-download" @click="handleDownload(scope.row)">下载</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        background
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="'新增模板'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      custom-class="page-dialog"
    >
      <el-form
        ref="ruleForm"
        :model="dataForm"
        label-width="80px"
        size="small"
        label-position="right"
      >
        <el-form-item label="模板名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" placeholder="请输入模板名称" />
        </el-form-item>

        <el-form-item label="业务ID" :label-width="formLabelWidth" prop="deviceType">
          <el-input v-model="dataForm.bizId" auto-complete="off" placeholder="请输入业务id" />
        </el-form-item>

        <el-form-item label="业务类型" :label-width="formLabelWidth" prop="deviceId">
          <el-input v-model="dataForm.bizType" auto-complete="off" placeholder="请输入业务类型" />
        </el-form-item>

        <el-upload
          ref="upload"
          class="upload-demo"
          action
          :file-list="dataForm.fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  saveTemplate,
  getTemplate,
  deleteTemplate
} from '@/api/template'
import { uploadAvatar } from '@/api/user'
import { guid } from '@/utils/webUtils'
import { upload, download, convertRes2Blob, preview } from '@/api/fileupload'
import { encode } from 'jszip/lib/base64'

export default {
  data() {
    return {
      tableData: [],
      query: { name: '' },
      dataForm: {
        name: '',
        bizType: '',
        bizId: '',
        fid: ''
      },
      dialogFormVisible: false, // 控制弹出框
      currentPage: 1,
      pageSize: 10,
      formLabelWidth: '80px',
      total: 0,
      loading: false,
      templateOptions: [],
      templatePageParam: {
        current: 1,
        size: 10
      }
    }
  },
  mounted() {
    this.templateList()
  },
  methods: {
    handlerInput(d) {

    },
    handleReset: function() {
      this.query = {
        name: ''
      }
      this.templateList()
    },
    // 添加
    handleAdd: function() {
      this.dialogFormVisible = true
      this.dataForm = {
        name: '',
        bizType: '',
        bizId: '',
        fid: '',
        fileList: []
      }
    },
    dialogClosed() {
      this.$refs.ruleForm.resetFields()
    },
    handleFind: function() {
      this.templateList()
    },
    // 加载模板列表
    templateList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('current', this.currentPage)
      params.append('size', this.pageSize)
      if (this.query.name !== '') {
        params.append('name', this.query.name)
      }
      getTemplate(params).then(response => {
        this.loading = false
        this.tableData = response.data.data.records
        this.total = response.data.data.total
      })
    },
    submitForm: function() {
      if (this.dataForm.batchId) {
        saveTemplate(this.dataForm).then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogFormVisible = false
            this.templateList()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请先确认文件已上传'
        })
      }
    },
    // 删除配置
    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将 ' + row.name + ' 删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTemplate(row.fileId).then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.templateList()
            } else {
              this.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.templateList()
    },
    submitUpload() {
      const { uploadFiles } = this.$refs.upload
      const formData = new FormData()
      const batchFileUUID = guid()
      formData.append('batchFileUUID', batchFileUUID) // 额外参数
      uploadFiles.forEach(file => {
        formData.append('files', file.raw)
      })
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      upload(formData).then((res) => {
        if (res.data.code == 200) {
          this.dataForm.batchId = batchFileUUID
          this.$message.info('上传成功!')
        } else {
          this.$message.error('上传失败!')
        }
      })
      loading.close()
    },
    handlePreview(file) {
      preview().then((res) => {
        if (res.data.code == 200) {
          window.open(res.data.data.previewServerUrl + encodeURIComponent(encode(res.data.data.fileUrl + file.filePath)), '_blank')
        } else {
          this.$message.error('获取预览服务器失败!')
        }
      })
    },
    handleDownload(row) {
      this.$confirm('您确定下载 ' + row.fileName + ' 文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          download(row.fileId).then((res) => convertRes2Blob(res))
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下载'
          })
        })
    }
  }
}
</script>
<style lang="scss">
.page-dialog {
  min-width: 730px;
  max-width: 730px;
}
</style>
