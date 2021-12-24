<template>
  <div>
    <div class="oper-div">
      <el-input placeholder="请输入学号" v-model="snoInput" clearable="">
        <template slot="prepend">学号：</template>
        <el-button slot="append" icon="el-icon-search" @click="getInfoGrade"></el-button>
      </el-input>
    </div>
    <el-card shadow="never">
      <el-divider content-position="left">学生信息</el-divider>
      <el-table ref="multipleTable" :data="infoData" tooltip-effect="dark" style="width: 100%;" border stripe>
        <el-table-column prop="sno" label="学号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sname" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ssex" label="性别" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sage" label="年龄" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sdept" label="专业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sscholarship" label="奖学金" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-divider content-position="left">学生成绩</el-divider>
      <el-table ref="multipleTable" :data="gradeData" tooltip-effect="dark" style="width: 100%;" border stripe>
        <el-table-column prop="sno" label="学号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cno" label="课程号"></el-table-column>
        <el-table-column prop="grade" label="成绩"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRows" style="margin-top: 10px;">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'RecordTable',
  data () {
    return {
      infoData: [],
      gradeData: [],
      snoInput: '',
      currentPage: 1,
      pageSize: 5,
      totalRows: 0
    }
  },
  methods: {
    getInfoGrade () {
      request
        .get('app/infograde', {
          params: {
            sno: this.snoInput,
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        })
        .then((res) => {
          this.infoData = []
          this.gradeData = []
          this.totalRows = 0
          if (res.code === 0) {
            this.infoData.push(res.infoData)
            this.gradeData = res.gradeData
            this.totalRows = res.rows
            this.$message({
              message: '查找学生成功',
              type: 'success',
              showClose: 'true'
            })
          } else {
            this.$message.error({
              message: '查找学生失败，错误信息：' + res.error,
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

.block {
  display: flex;
  justify-content: center;
}
</style>
