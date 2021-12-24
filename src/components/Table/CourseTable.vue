<template>
  <div>
    <div class="oper-div">
      <el-button type="primary" plain icon="el-icon-circle-plus-outline" style="margin-right: 10px;" @click="showAddCourseDialog" :disabled="loading">增加
      </el-button>
      <el-checkbox v-model="isFilter" @change="getTable" style="padding-top: 10px;" :disabled="loading">筛选没有选课的课程</el-checkbox>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" border stripe height="calc(100vh - 200px)" v-loading="loading">
      <el-table-column prop="cno" label="课程号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cname" label="课程名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cpno" label="先导课程" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ccredit" label="学分" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" style="margin-right: 10px;" @click="showUpdateCourseDialog(scope.row)"></el-button>
          <el-popconfirm title="确认删除？" @confirm="deleteCourse(scope.row.ID)">
            <el-button type="danger" icon="el-icon-delete" size="small" slot="reference"></el-button>
          </el-popconfirm>
        </template>

      </el-table-column>
    </el-table>
    <div class="page-div">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRows" style="margin-top: 10px;"
        :disabled="isFilter === true || loading">
      </el-pagination>
    </div>

    <el-dialog title="添加课程" :visible.sync="courseDialogVisible">
      <el-form :model="courseForm" ref='courseForm' :rules="rules" label-width="20%">
        <el-form-item label="课程号" prop="cno">
          <el-input v-model="courseForm.cno" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="课程名" prop="cname">
          <el-input v-model="courseForm.cname" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="先导课程" prop="cpno">
          <el-input v-model="courseForm.cpno" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="学分" prop="ccredit">
          <el-input v-model.number="courseForm.ccredit" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="courseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'CourseTable',
  data () {
    return {
      loading: false,
      isFilter: false,
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalRows: 0,
      courseDialogVisible: false,
      courseForm: {},
      rules: {
        cno: [{ required: true, message: '请输入课程号', trigger: 'blur' }],
        cname: [{ required: true, message: '请输入课程名', trigger: 'blur' }],
        ccredit: [
          { required: true, message: '请输入学分', trigger: 'blur' },
          { type: 'number', message: '学分必须为数字值', trigger: 'blur' }
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
        .get('course/query', {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            filter: this.isFilter
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
    showAddCourseDialog () {
      this.courseForm = {}
      this.$nextTick(() => {
        this.$refs.courseForm.clearValidate()
      })
      this.courseDialogVisible = true
    },
    insertItem () {
      this.$refs.courseForm.validate((valid) => {
        if (valid) {
          if (this.courseForm.ID) {
            request.put('course/update', this.courseForm).then((res) => {
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '修改课程成功',
                  duration: 3000,
                  type: 'success'
                })
                this.courseDialogVisible = false
                this.getTable()
              } else {
                this.$notify.error({
                  title: '失败',
                  message: '修改课程失败，错误信息：' + res.error,
                  duration: 3000
                })
              }
            })
          } else {
            request.post('course/insert', this.courseForm).then((res) => {
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '添加课程成功',
                  duration: 3000,
                  type: 'success'
                })
                this.courseDialogVisible = false
                this.getTable()
              } else {
                this.$notify.error({
                  title: '失败',
                  message: '添加课程失败，错误信息：' + res.error,
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
    showUpdateCourseDialog (row) {
      this.courseForm = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.courseForm.clearValidate()
      })
      this.courseDialogVisible = true
    },
    deleteCourse (ID) {
      console.log(ID)
      request
        .delete('course/delete', {
          params: {
            id: ID
          }
        })
        .then((res) => {
          if (res.code === 0) {
            this.$notify({
              title: '成功',
              message: '删除课程成功',
              duration: 3000,
              type: 'success'
            })
            this.courseDialogVisible = false
            this.getTable()
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除课程失败，错误信息：' + res.error,
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
