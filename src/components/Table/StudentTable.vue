<template>
  <div>
    <div class="oper-div">
      <el-button type="primary" plain icon="el-icon-circle-plus-outline" style="margin-right: 10px;" @click="showAddStudentDialog" :disabled="loading">增加
      </el-button>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" border stripe height="calc(100vh - 200px)" v-loading="loading">
      <el-table-column prop="sno" label="学号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sname" label="姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ssex" label="性别" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sage" label="年龄" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sdept" label="专业" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sscholarship" label="奖学金" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" style="margin-right: 10px;" @click="showUpdateStudentDialog(scope.row)"></el-button>
          <el-popconfirm title="确认删除？" @confirm="deleteStudent(scope.row.ID)">
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

    <el-dialog title="添加学生" :visible.sync="studentDialogVisible">
      <el-form :model="studentForm" ref='studentForm' :rules="rules" label-width="20%">
        <el-form-item label="学号" prop="sno">
          <el-input v-model="studentForm.sno" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="sname">
          <el-input v-model="studentForm.sname" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="ssex">
          <el-radio-group v-model="studentForm.ssex" style="width: 80%;">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="sage">
          <el-input v-model.number="studentForm.sage" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="sdept">
          <el-input v-model="studentForm.sdept" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="奖学金" prop="sscholarship">
          <el-radio-group v-model="studentForm.sscholarship" style="width: 80%;">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="studentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'StudentTable',
  data () {
    return {
      loading: false,
      tableData: [],
      multipleSelection: [],
      searchInput: '',
      currentPage: 1,
      pageSize: 10,
      totalRows: 0,
      studentDialogVisible: false,
      studentForm: {},
      rules: {
        sno: [
          { required: true, message: '请输入学号', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        sname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        ssex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        sage: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { type: 'number', message: '年龄必须为数字值', trigger: 'blur' }
        ],
        sdept: [{ required: true, message: '请输入专业', trigger: 'blur' }],
        sscholarship: [
          { required: true, message: '请选择奖学金', trigger: 'change' }
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
        .get('student/query', {
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
    showAddStudentDialog () {
      this.studentForm = {}
      this.$nextTick(() => {
        this.$refs.studentForm.clearValidate()
      })
      this.studentDialogVisible = true
    },
    insertItem () {
      this.$refs.studentForm.validate((valid) => {
        if (valid) {
          if (this.studentForm.ID) {
            request.put('student/update', this.studentForm).then((res) => {
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '修改学生成功',
                  duration: 3000,
                  type: 'success'
                })
                this.studentDialogVisible = false
                this.getTable()
              } else {
                this.$notify.error({
                  title: '失败',
                  message: '修改学生失败，错误信息：' + res.error,
                  duration: 3000
                })
              }
            })
          } else {
            request.post('student/insert', this.studentForm).then((res) => {
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '添加学生成功',
                  duration: 3000,
                  type: 'success'
                })
                this.studentDialogVisible = false
                this.getTable()
              } else {
                this.$notify.error({
                  title: '失败',
                  message: '添加学生失败，错误信息：' + res.error,
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
    showUpdateStudentDialog (row) {
      this.studentForm = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.studentForm.clearValidate()
      })
      this.studentDialogVisible = true
    },
    deleteStudent (ID) {
      console.log(ID)
      request
        .delete('student/delete', {
          params: {
            id: ID
          }
        })
        .then((res) => {
          if (res.code === 0) {
            this.$notify({
              title: '成功',
              message: '删除学生成功',
              duration: 3000,
              type: 'success'
            })
            this.studentDialogVisible = false
            this.getTable()
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除学生失败，错误信息：' + res.error,
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
