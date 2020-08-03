import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//二级跳转通用视图
const routerView = resolve => require(['components/router-view'], resolve),

  // 树形控件
  trees = resolve => require(['../components/tree0/index.vue'], resolve),
  //框架首页
  Index = resolve => require(['../pages'], resolve),
  //登入
  Login = resolve => require(['pages/user/login'], resolve),
  //修改密码
  UpdataPwd = resolve => require(['pages/user/updatapwd'], resolve),
  //注册
  Register = resolve => require(['pages/user/register'], resolve),
  //注册
  ButTable = resolve => require(['pages/buy/butTable'], resolve),

  //首页
  Home = resolve => require(['pages/home'], resolve),
  //新闻详情
  NewsDetail = resolve => require(['pages/home/newsDetail'], resolve),
  // 月计划
  mounthPlan = resolve => require(['pages/monthPlan'], resolve),
  // 年计划
  mounthPlanSelf = resolve => require(['pages/yearplan'], resolve),
  mounthPlanManger = resolve => require(['pages/mounthPlanManger'], resolve),
  // 协同管理
  coordination = resolve => require(['pages/coordination'], resolve),
  //个人中心
  PersonalCenterInfo = () => import('pages/personalCenter/info'),

  //个人中心修改密码
  PersonalUpdatapwd = () => import('pages/personalCenter/updatapwd'),

  /* 客户管理 */
  //客户管理
  Customer = resolve => require(['pages/customer'], resolve),
  // 项目立项
  ProjectCreat = resolve => require(['pages/projectCreat'], resolve),

  /* 工程管理 */
  //工程管理
  ProjectManage = resolve => require(['pages/projectManage/indexbox'], resolve),

  /* 工程进度 */
  //审批中心
  CoordinateDemand = resolve => require(['pages/projectProgress/coordinate-demand'], resolve),
  // 任务列表
  TaskList = resolve => require(['pages/projectProgress/task-list'], resolve),
  // 任务列表
  TaskStatistics = resolve => require(['pages/taskStatistics'], resolve),
  // 任务列表
  PolicyRead = resolve => require(['pages/policy/read'], resolve),
  // 任务列表
  PolicySetUp = resolve => require(['pages/policy/setUp'], resolve),


  /*通讯录 */
  // 成员
  Member = resolve => require(['pages/mail/member'], resolve),
  // 角色
  Role = resolve => require(['pages/mail/role'], resolve),
  // 成员
  Power = resolve => require(['pages/mail/power'], resolve),
  // 岗位职责
  Duty = resolve => require(['pages/mail/duty'], resolve),
  // 月计划
  MonthPlan = resolve => require(['pages/monthPlan'], resolve),
  // 系统设置
  ApprovalProcess = resolve => require(['pages/set/approvalProcess'], resolve),
  DataAuthority = resolve => require(['pages/set/dataAuthority'], resolve),
  //401
  Page401 = resolve => require(['pages/errorPage/401'], resolve),
  //404
  Page404 = resolve => require(['pages/errorPage/404'], resolve);


Vue.use(Router)

const router = new Router({
  routes: [
    //
    { path: '/tree', name: 'tree', component: trees, meta: { requireAuth: false, title: '树形' } },
    { path: '/login', name: 'login', component: Login, meta: { requireAuth: false, title: '登录' } },
    //修改密码
    { path: '/updatapwd', name: 'updatapwd', component: UpdataPwd, meta: { requireAuth: false, title: '修改密码' } },
    { path: '/register', name: 'register', component: Register, meta: { requireAuth: false, title: '注册' } },
    { path: '/butTable', name: 'butTable', component: ButTable, meta: { requireAuth: false, title: '信息' } },
    {
      //首页框架
      path: '/', component: Index,
      children: [
        { path: '/', name: 'home', component: Home, meta: { requireAuth: true, title: '首页' } },
        { path: '/newsDetail', name: 'newsDetail', component: NewsDetail, meta: { requireAuth: true, title: '新闻详情' } },


        /* 客户管理 */
        {
          path: 'customer', component: routerView,
          children: [
            {
              path: 'center', component: routerView,
              children: [
                {
                  path: '/', name: 'center', component: Customer, meta: { requireAuth: true, title: '客户档案' },
                },
              ]
              // path: '/', name: 'course-theme', component: Customer, meta: { requireAuth: true, title: '客户管理' },
            },
            // 客户沟通情况
            {
              path: 'commit', component: routerView,
              children: [
                {
                  path: '/', name: 'commit', component: Customer, meta: { requireAuth: true, title: '沟通日报' },
                },
              ]
            },
            // 客户意向
            {
              path: 'intention', component: routerView,
              children: [
                {
                  path: '/', name: 'intention', component: Customer, meta: { requireAuth: true, title: '合作意向' },
                },
              ]
            },
            // 客户任务
            {
              path: 'task', component: routerView,
              children: [
                {
                  path: '/', name: 'task', component: Customer, meta: { requireAuth: true, title: '合作进展' },
                },
              ]
            },
            // 客户经理
            {
              path: 'manager', component: routerView,
              children: [
                {
                  path: '/', name: 'manager', component: Customer, meta: { requireAuth: true, title: '合作状态' },
                },
              ]
            },
          ]

        },
        /* 工程管理 */
        {
          path: 'manage', component: routerView,
          children: [
            {
              path: 'maintain', component: routerView,
              children: [{
                path: '/', name: 'project-manage', component: ProjectManage, meta: { requireAuth: true, title: '工程维护' },
              }]
            },

            {
              path: 'projectcreat', component: routerView,
              children: [{ path: '/', name: 'project-creat', component: ProjectCreat, meta: { requireAuth: true, title: '立项管理' } },]
            },
            // 协同
            {
              path: 'coordinationManage', component: routerView,
              children: [
                {
                  path: '/', name: 'project-statistics', component: coordination, meta: { requireAuth: true, title: '协同管理' },
                },
              ]
            },
          ]
        },
        /* 系统设置 */
        {
          path: 'set', component: routerView,
          children: [
            {
              path: 'DataAuthority', component: routerView,
              children: [{
                path: '/', name: 'project-manage', component: DataAuthority, meta: { requireAuth: true, title: '数据维护' },
              }]
            },

            {
              path: 'ApprovalProcess', component: routerView,
              children: [{ path: '/', name: 'project-creat', component: ApprovalProcess, meta: { requireAuth: true, title: '审批配置' } },]
            },
          ]
        },
        /* 工程进度 */
        {
          path: 'progress', component: routerView,
          children: [
            {
              path: 'demand', component: routerView,
              children: [
                { path: '/', name: 'coordinate-demand', component: CoordinateDemand, meta: { requireAuth: true, title: '审批中心' } },
              ]
            },
            {
              path: 'list', component: routerView,
              children: [
                { path: '/', name: 'task-list', component: TaskList, meta: { requireAuth: true, title: '任务列表' } },
              ]
            },
          ]
        },
        /* 工程进度 */
        {
          path: 'policy', component: routerView,
          children: [
            {
              path: 'read', component: routerView,
              children: [
                { path: '/', name: 'policy-read', component: PolicyRead, meta: { requireAuth: true, title: '政策解读' } },
              ]
            },
            {
              path: 'setUp', component: routerView,
              children: [
                { path: '/', name: 'policy-setUp', component: PolicySetUp, meta: { requireAuth: true, title: '政策设置' } },
              ]
            },
          ]
        },
        /* 业务统计 */
        {
          path: 'statistics', component: routerView,
          children: [
            {
              path: '/', name: 'project-statistics', component: TaskStatistics, meta: { requireAuth: true, title: '任务统计' },
            },
          ]
        },
        /* 月计划 */
        {
          path: 'monthlyplan', component: routerView,
          children: [
            {
              path: '/', name: 'project-statistics', component: mounthPlan, meta: { requireAuth: true, title: '月计划' },
            },
          ]
        },
        /* 年计划 */
        {
          path: 'annualplan', component: routerView,
          children: [
            {
              path: '/', name: 'project-statistics', component: mounthPlanSelf, meta: { requireAuth: true, title: '年计划' },
            },
          ]
        },

        // 月目标管理
        {
          path: 'monthlyplanmanage', component: routerView,
          children: [
            {
              path: '/', name: 'project-statistics', component: mounthPlanManger, meta: { requireAuth: true, title: '月目标管理' },
            },
          ]
        },
        /* 通讯录 */
        {
          path: 'mail', component: routerView,
          children: [
            {
              path: 'member', component: routerView,
              children: [
                { path: '/', name: 'member', component: Member, meta: { requireAuth: true, title: '成员' } },
              ]
            },
            {
              path: 'role', component: routerView,
              children: [
                { path: '/', name: 'role', component: Role, meta: { requireAuth: true, title: '角色' } },
              ]
            },
            {
              path: 'power', component: routerView,
              children: [
                { path: '/', name: 'power', component: Power, meta: { requireAuth: true, title: '角色权限' } },
              ]
            },
            {
              path: 'duty', component: routerView,
              children: [
                { path: '/', name: 'duty', component: Duty, meta: { requireAuth: true, title: '岗位职责' } },
              ]
            },
          ]
        },
        /* 月计划 */
        {
          path: 'monthPlan', component: routerView,
          children: [
            { path: '/', name: 'monthPlan', component: MonthPlan, meta: { requireAuth: true, title: '月计划管理' } },
          ]
        },
        /* 个人中心 */
        {
          path: 'personalCenter', component: routerView,
          children: [
            { path: '/', name: 'personal-info', component: PersonalCenterInfo, meta: { requireAuth: true, title: '个人中心' } },
            { path: 'updatapwd', name: 'personal-updatapwd', component: PersonalUpdatapwd, meta: { requireAuth: true, title: '修改密码' } },
          ]
        },
        /* 其他 */
        {
          path: 'http://enroll.91ready.com', component: routerView,
          children: [
            { path: 'http://enroll.91ready.com', name: '招生管理', meta: { requireAuth: true, title: '个人中心' } },
            { path: 'updatapwd', name: 'personal-updatapwd', component: PersonalUpdatapwd, meta: { requireAuth: true, title: '修改密码' } },
          ]
        },
        { path: '401', name: 'page401', component: Page401, meta: { requireAuth: true, activeIndex: '', title: '401' } },
        { path: '404', name: 'page404', component: Page404, meta: { requireAuth: true, activeIndex: '', title: '404' } },
      ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  // store.commit('clearDetailsInfo')
  store.commit('setError', {
    errorMsg: '',
    navIndex: -1
  })
  if (!to.name) {
    next({ name: 'page404' });
    return;
  }
  var user_info = Vue.prototype.$common.getLocalStorage('userInfo');
  if (to.name == 'login' && user_info) {
    next({ name: 'manage' });
    return;
  }
  if (to.meta.requireAuth) {
    if (user_info) {
      next()
    } else {
      nprogress.done();
      next({ name: 'login' });
    }
  } else
    next();
})

router.afterEach(function (to) {
  nprogress.done();
})




export default router;
