<template>
  <div>
    <div class="oper-div">
      <el-button type="primary" plain icon="el-icon-circle-plus-outline" style="margin-right: 10px;" @click="showAddRecordDialog" :disabled="loading">增加
      </el-button>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" border stripe height="calc(100vh - 200px)" v-loading="loading">
      <el-table-column prop="sno" label="学号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cno" label="课程号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="grade" label="成绩" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" style="margin-right: 10px;" @click="showUpdateRecordDialog(scope.row)"></el-button>
          <el-popconfirm title="确认删除？" @confirm="deleteRecord(scope.row.ID)">
            <el-button type="danger" icon="el-icon-delete" size="small" slot="reference"></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-div">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRows" style="margin-top: 10px;" :disabled="loading">
      </el-pagination>
    </div>

    <el-dialog title="添加记录" :visible.sync="scDialogVisible">
      <el-form :model="scForm" ref='scForm' :rules="rules" label-width="20%">
        <el-form-item label="学号" prop="sno">
          <el-input v-model="scForm.sno" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="课程号" prop="cno">
          <el-input v-model="scForm.cno" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="成绩" prop="grade">
          <el-input v-model.number="scForm.grade" style="width: 80%;"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="scDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'RecordTable',
  data () {
    return {
      loading: false,
      tableData: [],
      multipleSelection: [],
      searchInput: '',
      currentPage: 1,
      pageSize: 10,
      totalRows: 0,
      scDialogVisible: false,
      scForm: {},
      rules: {
        sno: [{ required: true, message: '请输入学号', trigger: 'blur' }],
        cno: [{ required: true, message: '请输入课程号', trigger: 'blur' }],
        grade: [
          { required: true, message: '请输入成绩', trigger: 'blur' },
          {
            type: 'number',
            min: 0,
            max: 100,
            message: '成绩需为0~100之间的整数',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created: function () {
    this.getTable()
  },
  methods: {
    getTable () {
      this.loading = true
      request
        .get('sc/query', {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            search: this.searchInput
          }
        })
        .then((res) => {
          this.tableData = []
          this.totalRows = 0
          if (res.code === 0) {
            this.tableData = res.data
            this.totalRows = res.rows
            if (res.rows === 0) {
              this.$message({
                message: '无数据',
                type: 'warning'
              })
            } else {
              this.deptInfoData = res.data
              console.log(this.deptInfoData)
              this.$message({
                message: '获取信息成功',
                type: 'success',
                showClose: 'true'
              })
            }
          } else {
            this.$message.error({
              message: '获取信息失败，错误信息：' + res.error,
              showClose: 'true'
            })
          }
          this.loading = false
        })
        .catch((err) => {
          this.$message.error({
            message: '获取信息失败，错误信息：' + err,
            showClose: 'true'
          })
        })
    },
    showAddRecordDialog () {
      this.scForm = {}
      this.$nextTick(() => {
        this.$refs.scForm.clearValidate()
      })
      this.scDialogVisible = true
    },
    insertItem () {
      this.$refs.scForm.validate((valid) => {
        if (valid) {
          if (this.scForm.ID) {
            request.put('sc/update', this.scForm).then((res) => {
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '修改记录成功',
                  duration: 3000,
                  type: 'success'
                })
                this.scDialogVisible = false
                this.getTable()
              } else {
                this.$notify.error({
                  title: '失败',
                  message: '修改记录失败，错误信息：' + res.error,
                  duration: 3000
                })
              }
            })
          } else {
            request.post('sc/insert', this.scForm).then((res) => {
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '添加记录成功',
                  duration: 3000,
                  type: 'success'
                })
                this.scDialogVisible = false
                this.getTable()
              } else {
                this.$notify.error({
                  title: '失败',
                  message: '添加记录失败，错误信息：' + res.error,
                  duration: 3000
                })
              }
            })
          }
        } else {
          this.$notify.error({
            title: '失败',
            message: '数据不满足要求，请检查数据',
            duration: 3000
          })
        }
      })
    },
    showUpdateRecordDialog (row) {
      this.scForm = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.scForm.clearValidate()
      })
      this.scDialogVisible = true
    },
    deleteRecord (ID) {
      console.log(ID)
      request
        .delete('sc/delete', {
          params: {
            id: ID
          }
        })
        .then((res) => {
          if (res.code === 0) {
            this.$notify({
              title: '成功',
              message: '删除记录成功',
              duration: 3000,
              type: 'success'
            })
            this.scDialogVisible = false
            this.getTable()
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除记录失败，错误信息：' + res.error,
              duration: 3000
            })
          }
        })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getTable()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTable()
    }
  }
}
</script>

<style scoped>
.oper-div {
  margin-bottom: 10px;
  display: flex;
}

.page-div {
  display: flex;
  justify-content: center;
}
</style>
