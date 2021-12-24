<template>
  <div>
    <el-menu :default-active="this.$route.path" router style="width: 200px; height: calc(100vh - 81px);">
      <el-menu-item index="/StudentTable" :route="{path : '/StudentTable'}">
        <i class="el-icon-user-solid"></i>
        <span slot="title">学生管理</span>
      </el-menu-item>
      <el-menu-item index="/CourseTable" :route="{path : '/CourseTable'}">
        <i class="el-icon-s-management"></i>
        <span slot="title">课程管理</span>
      </el-menu-item>
      <el-menu-item index="/SCTable" :route="{path : '/SCTable'}">
        <i class="el-icon-s-check"></i>
        <span slot="title">成绩管理</span>
      </el-menu-item>
      <el-menu-item index="/DeptInfoQuery" :route="{path : '/DeptInfoQuery'}">
        <i class="el-icon-menu"></i>
        <span slot="title">院系统计信息查询</span>
      </el-menu-item>
      <el-menu-item index="/DeptRankQuery" :route="{path : '/DeptRankQuery'}">
        <i class="el-icon-s-data"></i>
        <span slot="title">院系排名查询</span>
      </el-menu-item>
      <el-menu-item index="/InfoGradeQuery" :route="{path : '/InfoGradeQuery'}">
        <i class="el-icon-search"></i>
        <span slot="title">学生信息和成绩查询</span>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AsideDB'
}
</script>

<style>
.el-menu-item.is-active {
  background-color: #ecf5ff !important;
}
</style>
