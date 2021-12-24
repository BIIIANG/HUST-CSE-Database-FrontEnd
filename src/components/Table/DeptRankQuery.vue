<template>
  <div>
    <div class="oper-div">
      <el-input placeholder="请输入专业" v-model="deptInput" clearable="">
        <template slot="prepend">专业：</template>
        <el-button slot="append" icon="el-icon-search" @click="getDeptRank"></el-button>
      </el-input>
    </div>
    <el-card shadow="never">
      <el-divider content-position="left">学生成绩排名</el-divider>
      <el-table ref="multipleTable" :data="deptRankData" tooltip-effect="dark" style="width: 100%;" border stripe height="calc(100vh - 250px)">
        <el-table-column prop="Sno" label="学号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Sname" label="学生姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Cno" label="课程号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Cname" label="课程名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Grade" label="成绩" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'DeptRankQuery',
  data () {
    return {
      deptRankData: [],
      deptInput: '',
      currentPage: 1,
      pageSize: 5,
      totalRows: 0
    }
  },
  methods: {
    getDeptRank () {
      request
        .get('app/deptrank', {
          params: {
            dept: this.deptInput
          }
        })
        .then((res) => {
          this.deptRankData = []
          if (res.code === 0) {
            if (res.rows === 0) {
              this.$message({
                message: '未找到该专业的信息',
                type: 'warning'
              })
            } else {
              this.deptRankData = res.data
              this.$message({
                message: '查找专业成功',
                type: 'success',
                showClose: 'true'
              })
            }
          } else {
            this.$message.error({
              message: '查找专业失败，错误信息：' + res.error,
              showClose: 'true'
            })
          }
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
