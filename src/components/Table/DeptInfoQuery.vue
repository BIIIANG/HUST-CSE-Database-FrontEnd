<template>
  <div>
    <el-card shadow="never">
      <el-divider content-position="left">院系统计信息</el-divider>
      <el-table ref="multipleTable" :data="deptInfoData" tooltip-effect="dark" style="width: 100%;" border stripe height="calc(100vh - 200px)"
        v-loading="loading">
        <el-table-column prop="Dept" label="专业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AvgGrade" label="平均成绩" show-overflow-tooltip></el-table-column>
        <el-table-column prop="MaxGrade" label="最高成绩" show-overflow-tooltip></el-table-column>
        <el-table-column prop="MinGrade" label="最低成绩" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GreatRate" label="优秀率(%)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FailNum" label="不及格人数(人次)" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'DeptInfoQuery',
  data () {
    return {
      deptInfoData: [],
      deptInput: '',
      currentPage: 1,
      pageSize: 5,
      totalRows: 0,
      loading: false
    }
  },
  created: function () {
    this.getDeptRank()
  },
  methods: {
    getDeptRank () {
      this.loading = true
      request
        .get('app/deptinfo')
        .then((res) => {
          this.deptInfoData = []
          if (res.code === 0) {
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
</style>
