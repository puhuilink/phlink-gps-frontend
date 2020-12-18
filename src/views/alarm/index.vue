<template>
  <div>
    <el-card class="box-card">
      <div class="filter-container">
        <el-input
          v-model="query.name"
          clearable
          size="small"
          class="filter-item"
          style="width: 200px;"
          placeholder="请输入配置名"
          @keyup.enter.native="handleFind"
        />

        <el-button class="filter-item" type="primary" icon="el-icon-search" size="small" plain @click="handleFind">搜索
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" size="small" @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加
        </el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="配置名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="围栏ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.fenceId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="设备ID" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.deviceId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="设备类型" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.deviceType }}</span>
          </template>
        </el-table-column>

        <el-table-column label="有效时间" width="200" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ scope.row.validTime ? '已配置': '未配置' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="200" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" min-width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
            </el-button>
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
    </el-card>

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="operation ? '新增告警配置' : '编辑告警配置'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      custom-class="page-dialog"
    >
      <el-form ref="ruleForm" :model="dataForm" label-width="80px" size="small" label-position="right">
        <el-form-item label="配置名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" placeholder="请输入名称" />
        </el-form-item>

        <el-form-item label="围栏ID" :label-width="formLabelWidth" prop="fenceId">
          <el-input v-model="dataForm.fenceId" auto-complete="off" placeholder="请输入围栏ID" />
        </el-form-item>

        <el-form-item label="设备ID" :label-width="formLabelWidth" prop="deviceId">
          <el-input v-model="dataForm.deviceId" auto-complete="off" placeholder="请输入设备ID" />
        </el-form-item>

        <el-form-item label="设备类型" :label-width="formLabelWidth" prop="deviceType">
          <el-input v-model="dataForm.deviceType" auto-complete="off" placeholder="请输入设备类型" />
        </el-form-item>

        <el-form-item label="有效时间" :label-width="formLabelWidth" prop="validTime">
          <time-select v-model="dataForm.validTime" @input="handlerInput" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { saveAlarmConfig, getAlarmConfig, updateAlarmConfig, deleteAlarmConfig } from '@/api/alarm'
import timeSelect from '@/components/TimeSelect/index'

export default {
  components: { timeSelect },
  data() {
    return {
      tableData: [],
      query: { name: '' },
      dataForm: {
        name: '',
        fenceId: '',
        deviceId: '',
        deviceType: '',
        validTime: {}
      },
      operation: true,
      dialogFormVisible: false, // 控制弹出框
      currentPage: 1,
      pageSize: 10,
      formLabelWidth: '80px',
      total: 0,
      loading: false
    }
  },
  mounted() {
    this.configList()
  },
  methods: {
    handlerInput(d) {
      // console.log('select data', d)
      // this.validTime = {vTime: d}
    },
    handleReset: function() {
      this.query = {
        name: ''
      }
      this.configList()
    },
    // 添加
    handleAdd: function() {
      this.dialogFormVisible = true
      this.operation = true
      this.dataForm = {
        name: '',
        fenceId: '',
        deviceId: '',
        validTime: null
      }
    },
    dialogClosed() {
      this.$refs.ruleForm.resetFields()
    },
    handleFind: function() {
      this.configList()
    },
    // 加载围栏列表
    configList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('current', this.currentPage)
      params.append('size', this.pageSize)
      if (this.query.name !== '') {
        params.append('name', this.query.name)
      }
      getAlarmConfig(params).then(response => {
        this.loading = false
        this.tableData = response.data.data.records
        this.total = response.data.data.total
      })
    },
    submitForm: function() {
      if (!this.operation) {
        // 编辑围栏
        updateAlarmConfig(this.dataForm).then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogFormVisible = false
            this.configList()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
        })
      } else {
        // 添加配置
        saveAlarmConfig(this.dataForm).then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogFormVisible = false
            this.configList()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
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
      }).then(() => {
        deleteAlarmConfig(row.configId).then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            that.configList()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.configList()
    },
    // 编辑
    handleEdit: function(row) {
      this.dialogFormVisible = true
      this.operation = false
      if (row.validTime) {
        row.validTime['from'] = 'server'
      }
      // 深拷贝row,防止数据被修改
      this.dataForm = Object.assign({}, row)
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
