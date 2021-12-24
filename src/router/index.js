import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '*', redirect: '/StudentTable'
  }, {
    path: '/StudentTable',
    name: 'StudentTable',
    component: () => import('../components/Table/StudentTable.vue')
  }, {
    path: '/CourseTable',
    name: 'CourseTable',
    component: () => import('../components/Table/CourseTable.vue')
  }, {
    path: '/SCTable',
    name: 'SCTable',
    component: () => import('../components/Table/SCTable.vue')
  }, {
    path: '/InfoGradeQuery',
    name: 'InfoGradeQuery',
    component: () => import('../components/Table/InfoGradeQuery.vue')
  }, {
    path: '/DeptRankQuery',
    name: 'DeptRankQuery',
    component: () => import('../components/Table/DeptRankQuery.vue')
  }, {
    path: '/DeptInfoQuery',
    name: 'DeptInfoQuery',
    component: () => import('../components/Table/DeptInfoQuery.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
