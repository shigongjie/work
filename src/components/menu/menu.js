export default [
  { title: '首页', icon: 'el-icon-s-home', path: '/', child: [] },

  {
    title: '客户管理',
    icon: 'el-icon-s-custom',
    child: [
      { title: '客户管理', path: '/customer', child: [] },
    ],
  },

  {
    title: '项目管理',
    icon: 'el-icon-s-data',
    child: [
      { title: '项目管理', path: '/manage', child: [] },
    ],
  },

  {
    title: '项目进度',
    icon: 'el-icon-s-order',
    child: [
      { title: '审批中心', path: '/progress/demand', child: [] },
      { title: '任务列表', path: '/progress/list', child: [] },
    ],
  },
  {
    title: '任务统计',
    icon: 'el-icon-date',
    child: [
      { title: '任务统计', path: '/statistics', child: [] },
    ],
  },
  {
    title: '通讯录',
    icon: 'el-icon-collection',
    child: [
      { title: '成员', path: '/mail/member', child: [] },
      { title: '角色', path: '/mail/role', child: [] },
      { title: '角色权限', path: '/mail/power', child: [] },
      { title: '岗位职责', path: '/mail/duty', child: [] },
    ],
  },

  {
    title: '客户信息',
    icon: 'el-icon-s-custom',
    child: [
      { title: '客户档案', path: '/customer/center?id=0', child: [] },
      { title: '客户沟通情况', path: '/customer/commit?id=1', child: [] },
      { title: '客户意向情况', path: '/customer/intention?id=2', child: [] },
      { title: '客户任务情况', path: '/customer/task?id=3', child: [] },
      { title: '我的客户', path: '/customer/manager?id=4', child: [] },
    ],
  },
  {
    title: '系统设置',
    icon: 'el-icon-s-custom',
    child: [
      { title: '数据权限配置', path: '/set/DataAuthority', child: [] },
      { title: '审批流程配置', path: '/set/ApprovalProcess', child: [] },
    ],
  },


]
