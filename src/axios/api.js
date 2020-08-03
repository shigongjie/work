import Vue from 'vue'
var api = {
  /* 公共接口 */
  common: {
    //文件上传
    upload: '/fastdfs-boot/upload',
    //根据模块获取导出字段
    exportColumn: '/teachers-boot/common/exportColumn',
    //获取检索字段配置(如果是下拉框带上选项数组)
    listConditionColumn: '/teachers-boot/common/listConditionColumn',
    //获取人员类型等相关字段
    listBasicJa: '/teachers-boot/common/listBasicJa',
    //获取基本信息
    getUserBaseInfo: '/oauth-boot/oauth/getUserBaseInfo',
    //缓存导出字段
    cacheExportField: '/basics-boot/info/cacheExportField',
    //保存搜索
    addHistory: '/basics-boot/info/addHistory',
    //获取历史搜索列表
    listHistory: '/basics-boot/info/listHistory',
    //删除一条指定的历史搜索条件
    delHistory: '/basics-boot/info/delHistory',
    //回显一条历史搜索条件
    getHistory: '/basics-boot/info/getHistory',
    //获取表头接口
    listColumn: '/basics-boot/column/listColumn',
    // 政策表头
    basicslistColumn: '/basics-boot/common/listColumn',
    //获取评论列表
    listComments: '/oa-boot/message/comment/listComments',
    //保存列头
    saveColumn: '/basics-boot/info/saveColumn',
    // 获取个人消息列表（用于h5页面，不根据会话id获取）
    listNoticeMsg: '/message-boot/message/notice/listNoticeMsg',
    //获取待办列表
    listTodoMessage: '/oa-boot/message/listTodoMessage',
    //获取未读消息数（待办、系统通知）
    getMessageCount: '/oa-boot/message/getMessageCount',
    //发送评论
    send: '/message-boot/message/comment/send',
    //获取评论列表
    listComments: '/message-boot/message/comment/listComments',
    //  删除用户自己配置的表头数据
    resetTableColumn: '/basics-boot/info/resetTableColumn',
    // 获取系统相对应的角色字典列表
    listCfgAppStrategy: '/oauth-boot/oauth/listCfgAppStrategy'
  },

  /* 发送验证码 */
  sendVerifyCode: '/message-boot/message/sms/sendVerifyCode',
  /* 获取图形验证码并验证字符串 */
  getImageVerifyCode: '/message-boot/message/sms/getImageVerifyCode',
  /* 初步验证短信验证码 */
  preliminarySubmitVerifyCode: '/message-boot/message/sms/preliminarySubmitVerifyCode',

  /* 绑定手机号 */
  regAccount: '/message-boot/message/push/regAccount',
  /* 绑定手机号 */
  bindPhone: '/oauth-boot/oauth/bindPhone',

  /* 找回密码 */
  findPwd: '/oauth-boot/oauth/findPwd',

  /* 用户登录 */
  login: '/oauth-boot/oauth/login',
  /*注册 */
  register: '/oauth-boot/oauth/register',
  /* 用户注销 */
  logout: '/oauth-boot/oauth/logout',

  /* 获取子菜单列表 */
  listSubMenu: '/basics-boot/menu/treeMyMenu',

  /* 获取OSS签名 */
  getOssSign: '/basics-boot/oss/getSign',

  /* 用户 */
  user: {
    //获取教师个人信息
    getTeacherInfo: '/basics-boot/info/getTeacherInfo',
    //教师修改个人信息
    modifyTeacherInfo: '/basics-boot/info/modifyTeacherInfo',
    //教师获取学生信息
    getStudentInfo: '/basics-boot/info/teacherGetStudentInfo',
    //学生修改个人信息
    modifyStudentInfo: '/basics-boot/info/modifyStudentInfo',
    //修改密码
    modifyPwd: '/oauth-boot/oauth/modifyPwd',
    //修改个人中心数据
    updatePersonInfo: '/oa-boot/homePage/updatePersonInfo',
  },

  /* 首页 */
  home: {
    //待办事项（老师、管理员）
    pageDiary: '/oa-boot/homePage/pageDiary',
    //首页 获取个人信息（部门角色）
    getLoginUserInfo: '/oa-boot/homePage/getLoginUserInfo',
    //首页 获取统计指标（未读日志、客户数、等待协调/待我协调、我发起/待我完成
    getHomeIndex: '/oa-boot/homePage/getHomeIndex',
    //对应系统下的获得所有部门，对应的成员
    listDepartmentAndUser: '/basics-boot/department/listDepartmentAndUser',
    //获取所有部门信息
    getDiary: '/oa-boot/homePage/v2/getDiary',
    // getDiary: '/oa-boot/homePage/getDiary',
    //获取当天的日志信息
    getCurrentDiary: '/oa-boot/homePage/getCurrentDiary',
    //修改日志（有id，保存时判断【今日成果、明日任务、待协调、截止时间、用时、自评分、上级评分】中如果有变更则组装一份到评论中）
    addOrEditDiary: '/oa-boot/homePage/addOrEditDiary',
    //保存日志接收人
    saveDiaryReceiver: '/oa-boot/homePage/saveDiaryReceiver',
    //回显日志接收人
    listDiaryReceiver: '/oa-boot/homePage/listDiaryReceiver',
    //更新上级评分（只有日志接收人可评分）
    updateHigherRating: '/oa-boot/homePage/updateHigherRating',
    //新闻类型
    listNewsType: '/basics-boot/news/listNewsType',
    //新闻列表
    pageNewsByType: '/basics-boot/news/pageNewsByType',
    //新闻详情
    getNews: '/basics-boot/news/getNews',
  },

  policy: {
    //获取所有部门信息
    // listColumnForPolicy: '/oa-boot/policy/listColumnForPolicy',
    listColumnForPolicy: '/oa-boot/policy/v2/listColumnForPolicy',
    //010111 政策管理 分页
    pagePolicy: '/oa-boot/policy/v2/pagePolicy',
    //0031212 按 dict_name字段查找dict_basics表
    listDictBasicByName: '/basics-boot/common/listDictBasicByName',
    //0031212 按 dict_name字段查找dict_basics表
    listDictBasicObjByName: '/basics-boot/common/listDictBasicObjByName',
    //新
    // addOrEditPolicy: '/oa-boot/policy/addOrEditPolicy',
    addOrEditPolicy: '/oa-boot/policy/v2/addOrEditPolicy',
    //新
    // getPolicy: '/oa-boot/policy/getPolicy',
    getPolicy: '/oa-boot/policy/v2/getPolicy',
    //新
    updateOperateStatusForPolicy: '/oa-boot/policy/updateOperateStatusForPolicy',
    //新
    delPolicy: '/oa-boot/policy/delPolicy',
    // 获取地区信息
    getArea: "/basics-boot/area/listSubNormArea",
    // 审批通过
    isapprove: '/oa-boot/policy/v2/approve',
    // 撤回修改
    returnBack: '/oa-boot/policy/v2/returnBack',
    // 完成任务
    complete: '/oa-boot/policy/v2/complete',
    // 指派任务
    assign: '/oa-boot/policy/v2/assign'
  },
  mail: {
    // 岗位列表
    pageDictPosition: '/basics-boot/position/pageDictPosition',
    // 用户列表
    findUserListByPosition: '/basics-boot/position/findUserListByPosition',
    // 添加修改岗位字典
    addOrEditDictPosition: '/basics-boot/position/addOrEditDictPosition',
    // 获取职责字典列表，返回是否已选择
    listDictResponsibilityByPosition: '/basics-boot/position/listDictResponsibilityByPosition',
    // 职位绑定职责，可用于删除绑定关系
    bindResponsibility: '/basics-boot/position/bindResponsibility',
    // 部门员工树，返回员工勾选状态
    listUser: '/basics-boot/position/listDepartmentAndUser',
    // 职位绑定用户，也可用于删除用户绑定关系
    bindUser: '/basics-boot/position/bindUser',
    //获取所有部门信息
    listDepartment: '/basics-boot/department/listDepartment',
    // 删除（逻辑）部门
    delDepartment: '/basics-boot/department/delDepartment',
    // 添加或修改部门
    addOrEditDepartment: '/basics-boot/department/addOrEditDepartment',
    //  分页获取某部门下的成员信息
    pageMemberByDepartment: '/oa-boot/membership/pageMemberByDepartment',
    //  通过电话号码查找用户信息
    getUserInfoByTelephone: '/oa-boot/membership/getUserInfoByTelephone',
    //  回显一条成员记录
    getMember: '/oa-boot/membership/getMember',
    //  下拉列表展示：对应系统下的获得所有部门
    listAllDepartment: '/basics-boot/department/listAllDepartment',
    //  获取系统相对应的角色字典列表
    listDictRole: '/basics-boot/role/listDictRole',
    //  将成员添加到部门
    addMember: '/basics-boot/department/addMember',
    //  添加或编辑字典角色
    addOrEditDictRole: '/basics-boot/role/addOrEditDictRole',
    //  逻辑删除角色信息
    delDictRole: '/basics-boot/role/delDictRole',
    //  获取指定角色
    getDictRole: '/basics-boot/role/getDictRole',
    //  逻辑删除部门下的成员
    delMember: '/basics-boot/department/delMember',
    //  通讯录 编辑一条成员信息
    editMember: '/oa-boot/membership/editMember',
    //  获取一个指定的部门对象
    getDepartment: '/basics-boot/department/getDepartment',
    //  分页获取某角色下的成员信息
    pageMemberByRole: '/oa-boot/membership/pageMemberByRole',
    //  在角色下添加成员
    addRoleMember: '/basics-boot/role/addMember',
    //  在指定角色下逻辑删除成员
    delRuleMember: '/basics-boot/role/delMember',
    //  根据角色id获取菜单
    treeMenuByRole: '/basics-boot/menu/treeMenuByRole',
    //  更新角色下对应的菜单
    updateRecRoleMenu: '/basics-boot/menu/updateRecRoleMenu',
  },
  // 客户管理
  customer: {
    //  判断当前用户是否可见客户经理列表
    isManagerTableVisible: '/oa-boot/customer/v2/isManagerTableVisible',
    // 客户管理 获取客户信息（分页、搜索）
    pageCustomerMaster: '/oa-boot/customer/pageCustomerMaster',
    // 客户管理 新增或编辑客户
    addOrEditCustomerMaster: '/oa-boot/customer/addOrEditCustomerMaster',
    // 客户管理 获取指定客户信息（回显数据)
    getCustomer: '/oa-boot/customer/getCustomer',
    // 客户管理 （逻辑)删除指定客户)
    delCustomerMaster: '/oa-boot/customer/delCustomerMaster',
    // 客户管理 下拉列表客户
    listCustomerMaster: '/oa-boot/customer/listCustomerMaster',
    // 客户管理 获取客户联系人列表（不分页)
    listCustomerDetail: '/oa-boot/customer/listCustomerDetail',
    // 客户管理 新增或编辑客户联系人
    addOrEditCustomerDetail: '/oa-boot/customer/addOrEditCustomerDetail',
    // 客户管理 （逻辑)删除指定联系人（客户细表记录)
    delCustomerDetail: '/oa-boot/customer/delCustomerDetail',
    // 客户管理 获取指定联系人（客户细表）信息
    getCustomerDetail: '/oa-boot/customer/getCustomerDetail',
    // 006031001 excel导入客户信息
    importCustomerExcel: '/oa-boot/customer/importCustomerExcel',
    //01001006 获取大项列表及表头
    listWithLabel: '/oa-boot/customerItem/list',
    // 新增或编辑
    addOrEditCustomer: '/oa-boot/customer/v2/addOrEdit',
    getcustomerv2: '/oa-boot/customer/v2/get',
    // 获取动态表单Json串
    GetiJson: '/basics-boot/column/listCfgCustomField',
    // 01001006 保存编辑客户细表/保存编辑进展
    addOrEditTableDetail: '/oa-boot/customer/v2/detail/addOrEdit',
    // 获取信息分配
    getInfomationShare: '/oa-boot/customer/v2/priv/list',
    // 修改用户信息权限
    addOrEditUserInfomation: '/oa-boot/customer/v2/priv/addOrEdit',
    // 01001011 获取信息分配/信息共享详情
    getInfomationDetail: '/oa-boot/customer/v2/priv/get',
    // 获取客户列表
    getCustomerList: '/oa-boot/customer/v2/listWithPriv',
    // // 获取客户细项列表
    // getCustomerList:'/oa-boot/customer/v2/listWithPriv',
    // 010060801 根据客户查找任务列表
    listTaskByCustomer: '/oa-boot/task/v2/listTaskByCustomer',
    // 选择年份返回总量
    changeYear: '/oa-boot/customer/v2/dataAnnual/findByAnnual',
    // 删除细项
    deleteDetail: '/oa-boot/customer/v2/detail/del',
    deleteDetailInfomation: '/oa-boot/customer/v2/priv/del',
    // 客户沟通情况
    pageCommunicationRecordWithPriv: '/oa-boot/customer/v2/detail/pageCommunicationRecordWithPriv',
    // 客户意向情况
    pageIntentionWithPriv: '/oa-boot/customer/v2/detail/pageIntentionWithPriv',
    // 客户任务情况
    pageTaskWithPriv: '/oa-boot/customer/v2/detail/pageTaskWithPriv',
    // 客户经理
    pageManagerWithPriv: '/oa-boot/customer/v2/detail/pageManagerWithPriv',

  },
  projectManage: {
    // 010022 项目管理 添加，编辑项目信息
    addOrEditEngineeringMaster: '/oa-boot/engineering/addOrEditEngineeringMaster',
    // 工程管理 工程信息列表
    listEngineeringMaster: '/oa-boot/engineering/listEngineeringMaster',
    // 工程管理 负责人列表
    listPrincipal: '/oa-boot/engineering/listPrincipal',
    // 工程管理 负责人列表
    getEngineeringMaster: '/oa-boot/engineering/getEngineeringMaster',
    // 工程管理 删除（逻辑)指定的工程信息
    delEngineeringMaster: '/oa-boot/engineering/delEngineeringMaster',
    // 获取工程模块信息（分页，搜索）
    pageEngineeringModule: '/oa-boot/engineering/pageEngineeringModule',
    // 工程管理 添加或修改工程模块
    addOrEditEngineeringModule: '/oa-boot/engineering/addOrEditEngineeringModule',
    // 获取指定工程模块信息
    getEngineeringModule: '/oa-boot/engineering/getEngineeringModule',
    // (逻辑)删除指定工程模块信息
    delEngineeringModule: '/oa-boot/engineering/delEngineeringModule',
    // 工程管理 按用户所属部门展示工程信息列表
    listEngineeringMasterByUserId: '/oa-boot/engineering/listEngineeringMasterByUserId',
    // 获取部门列表
    listAllDepartment: '/basics-boot/department/listAllDepartment',
    // 获取部门下的所有成员
    listUserByDepartmentId: '/basics-boot/department/listUserByDepartmentId',
    addOrEditItem: '/oa-boot/item/addOrEditItem'
  },
  // 业务管理模块
  projectProgress: {
    // 业务任务模块：获取任务状态列表
    listTaskStatus: '/oa-boot/task/listTaskStatus',
    //业务任务模块：任务（分页，搜索）
    pageTask: '/oa-boot/task/pageTask',
    //获取指定工程模块下的阶段列表
    listEngineeringPhaseName: '/oa-boot/engineering/listEngineeringPhaseName',
    //业务任务模块: 新增或修改任务
    addOrEditTask: '/oa-boot/task/addOrEditTask',
    //获取指定工程下的模块列表
    listEngineeringModule: '/oa-boot/engineering/listEngineeringModule',
    //业务任务模块: 获取任务
    getTask: '/oa-boot/task/getTask',
    //业务任务模块: 新增或修改进展记录
    addOrEditProgress: '/oa-boot/task/addOrEditProgress',
    // 业务任务模块: 获取进展记录
    getProgress: '/oa-boot/task/getProgress',
    // 业务任务模块: 删除进展记录
    delProgress: '/oa-boot/task/delProgress',
    // 业务任务模块: 修改任务状态 0 未开始 1 进行中 2 已完成 3 已暂停 4 已取消 5 已关闭
    updateTaskStatus: '/oa-boot/task/updateTaskStatus',
    // 更新操作人的操作状态 如审核人: 审核通过或不通过
    updateOperateStatus: '/oa-boot/task/updateOperateStatus',
    // 上一个或者下一个
    previousOrNext: '/oa-boot/task/previousOrNext',
    // 业务需求模块: 新增或修改需求
    // addOrEditDemand: '/oa-boot/demand/addOrEditDemand',
    addOrEditDemand: '/oa-boot/approve/addOrEditApprove',
    // 业务需求模块: 获取需求
    // getDemand: '/oa-boot/demand/getDemand',
    getDemand: '/oa-boot/approve/getApprove',

    // 业务需求模块: 需求列表
    pageDemand: '/oa-boot/approve/pageApprove',
    // 业务统计模块：任务（分页，搜索）
    pageTaskStatistics: '/oa-boot/statistics/pageTaskStatistics',
    // 010104 获取任务或需求表头列表
    listSpecialColumn: '/oa-boot/common/listSpecialColumn',

    //010107 一校一策模块 字典下拉列表
    listSchoolBook: '/oa-boot/customer/listSchoolBook',
  },
  // 审批中心
  approve: {
    // 010062905 根据审批类型和类别查找模板
    getTemplates: '/oa-boot/approve/template/getTemplateByApproveTypeAndCategory',
    // 010062903 审批模板分页
    pageTemplate: '/oa-boot/approve/template/pageTemplate',
    // 010052001 获取审批类型列表
    listApproveType: '/oa-boot/approve/listApproveType',
    // 010052002 获取审批类别列表
    listApproveTypeCategory: '/oa-boot/approve/listApproveTypeCategory',
    // 010062901 添加或修改审批模板
    addOrEditTemplate: '/oa-boot/approve/template/addOrEditTemplate',
    // 010062902 回显审批模板
    getTemplate: '/oa-boot/approve/template/getTemplate',
    // 010062904 (逻辑)删除审批模板
    delTemplate: '/oa-boot/approve/template/delTemplate',
    // 审批操作
    doApprove: '/oa-boot/common/doApprove',
    // 撤回审批
    setApproveStatus: '/oa-boot/approve/setApproveStatus',
    // 获取历史审批条数
    listHistory: '/oa-boot/common/listHistory',
    // 回显指定的历史记录数据
    getHistoryDetail: '/oa-boot/common/getHistoryDetail',
    // 作废
    updateApproveEnabledFlag: '/oa-boot/approve/updateApproveEnabledFlag',
    // 移除备忘
    removeBatchMemoApprove: '/oa-boot/approve/removeBatchMemoApprove',
    // 催办
    Urging: '/oa-boot/common/remindApprove'
  },
  /* 个人中心 */
  personalCenter: {
    //老师获取自己导师信息
    getMyTutorInfo: '/teachers-boot/personal/getMyTutorInfo',
    //申请修改个人信息 将获取的接口值里的变动替换后直接保存
    applyModifyTutorInfo: '/teachers-boot/personal/applyModifyTutorInfo'
  },
  /* 任务2.0 */
  task: {
    //任务分页2.0
    pageTask: '/oa-boot/task/v2/pageTask',
    //获取任务标签页2.0
    listSpecialColumnForTask: '/oa-boot/task/v2/listSpecialColumnForTask',
    //分页展示: 业务，工程和模块
    treeItem: '/oa-boot/item/treeItem',
    //创建草稿
    draftTask: '/oa-boot/task/v2/draftTask',
    //回显数据
    getTask: '/oa-boot/task/v2/getTask',
    //根据itemcode获取阶段数组
    listPhase: '/oa-boot/item/listPhase',
    //回显 任务完成者列表 + 任务完成者的动态表头
    listFinishRelation: '/oa-boot/businessRelation/listFinishRelation',
    //克隆、创建
    cloneTask: '/oa-boot/task/v2/cloneTask',
    //新增或编辑任务2.0
    addOrEditTask: '/oa-boot/task/v2/addOrEditTask',
    //新增或编辑业务关系表（审批，完成者，抄送）
    addOrEditRelation: '/oa-boot/businessRelation/addOrEditRelation',
    //物理删除业务关系表（审批，完成者，抄送）
    delRelation: '/oa-boot/businessRelation/delRelation',
    //获取某业务某操作类型的列表
    listRelation: '/oa-boot/businessRelation/listRelation',
    // 任务2.0: 上一个或者下一个
    pre0rNextTask: '/oa-boot/task/v2/pre0rNextTask',
    // 开始任务，任务转态更改
    updateTaskStatus: '/oa-boot/task/v2/updateTaskStatus',
    // 开始任务，任务转态更改
    listSpecialColumnForTask: '/oa-boot/task/v2/listSpecialColumnForTask',
    // 任务完成者 任务完成
    doFinish: '/oa-boot/businessRelation/doFinish',
    // 自评分回显
    getFinishByOneself: '/oa-boot/businessRelation/getFinishByOneself',
    // 领导评分回显
    getFinishByLeader: '/oa-boot/businessRelation/getFinishByLeader',
    // 领导评分
    doFinishByLeader: '/oa-boot/businessRelation/doFinishByLeader',
    // 审批操作
    doApprove: '/oa-boot/common/doApprove',
    // 进展分页
    pageByBusinessId: '/oa-boot/customer/v2/detail/pageByBusinessId',
    // 进展不分页
    findByBusinessId: '/oa-boot/customer/v2/detail/findByBusinessId',
    // 获取职责
    findMyResponsibilities: '/basics-boot/position/findMyResponsibilities',
    // 客户细表列表，只查询自己有权限的
    listWithPriv: '/oa-boot/customer/v2/detail/listWithPriv',
    // 客户细表列表，只查询自己有权限的
    list: '/oa-boot/customer/v2/detail/list',
    // 任务数
    customerProjectList: '/oa-boot/task/v2/customerProjectList',
    // 工程详情
    customerProjectInfo: '/oa-boot/task/v2/customerProjectInfo',
    // 模块详情
    customerModuleInfo: '/oa-boot/task/v2/customerModuleInfo',
    // 根据用户获取月计划列表
    listMonthPlan: '/oa-boot/month/plan/listMonthPlan',
  },
  // 立项
  projectCreat: {
    pageProject: '/oa-boot/project/pageProject',
    // 创建立项草稿
    draftProject: '/oa-boot/project/draftProject',
    // 立项指标列表
    listProjectIndex: '/oa-boot/project/listProjectIndex',
    // 添加编辑立项指标
    addOrEditProjectIndex: '/oa-boot/project/addOrEditProjectIndex',
    // 删除立项指标
    delProjectIndex: '/oa-boot/project/delProjectIndex',
    // 立项预算列表
    listProjectBudget: '/oa-boot/project/listProjectBudget',
    // 添加修改立项预算
    addOrEditProjectBudget: '/oa-boot/project/addOrEditProjectBudget',
    // 删除预算
    delProjectBudget: '/oa-boot/project/delProjectBudget',
    // 编辑立项
    addOrEditProject: '/oa-boot/project/addOrEditProject',
    // 获取立项详情
    getProject: '/oa-boot/project/getProject',
    // 撤回立项
    returnBack: '/oa-boot/project/returnBack',
    // 重新发起
    republish: '/oa-boot/project/republish',
    // 发起验收
    launchAcceptance: '/oa-boot/project/launchAcceptance',
    // 验收
    doAcceptance: '/oa-boot/common/doAcceptance',
    // 立项列表
    listProject: '/oa-boot/project/listProject',
    // 获取年计划细项列表
    listYearPlanDetail: '/oa-boot/yearPlan/listYearPlanDetail',
  },
  /* 月计划2.0 */
  plan: {
    launchMonthPlan:'/oa-boot/month/plan/launchMonthPlan',
    // 根据用户获取月计划列表
    pageMonthPlan: '/oa-boot/month/plan/pageMonthPlan',
    personMonthPlan: '/oa-boot/month/plan/personMonthPlan',
    // 新增或编辑某个月计划
    addOrEditMonthPlan: '/oa-boot/month/plan/addOrEditMonthPlan',
    // 获取月计划树
    getMonthPlanTree: '/oa-boot/month/plan/getMonthPlanTree',
    listSpecialColumnForMonthPlan: '/oa-boot/month/plan/listSpecialColumnForMonthPlan',
    // 月计划任务列表
    mounthpageTask: '/oa-boot/task/v2/pageTask',
    // 个人月计划列表
    personMonthPlan: '/oa-boot/month/plan/personMonthPlan',
    // 010070804 回显某个月计划接口
    getMonthPlan: '/oa-boot/month/plan/getMonthPlan',
    // 010070803 创建个草稿月计划
    draftMonthPlan: '/oa-boot/month/plan/draftMonthPlan',
    // addOrEditMonthPlan:'/oa-boot/month/plan/addOrEditMonthPlan'
    getMembersByMonthId: '/oa-boot/month/plan/getMembersByMonthId',
    // 根据用户获取任务列表
    getTaskByuser: '/oa-boot/task/v2/pageTask',
    getMonthPlanByYearAndMonth: '/oa-boot/month/plan/getMonthPlanByYearAndMonth',
    mounthPlanreturnBack:'/oa-boot/month/plan/returnBack'
  },
  /* 年计划2.0 */
  yearplan: {
    // 根据用户获取月计划列表
    pageYearPlan: '/oa-boot/yearPlan/pageYearPlan',
    // 根据年份和部门获取年计划详情，如果没有则创建草稿
    getYearPlanByYear: '/oa-boot/yearPlan/getYearPlanByYear',
    // 新增或编辑某个年计划
    addOrEditYearPlan: '/oa-boot/yearPlan/addOrEditYearPlan',
    listSpecialColumnForMonthPlan: '/oa-boot/month/plan/listSpecialColumnForMonthPlan',
    // 月计划任务列表
    mounthpageTask: '/oa-boot/task/v2/pageTask',
    // 个人月计划列表
    personMonthPlan: '/oa-boot/month/plan/personMonthPlan',
    // 010070804 回显某个年计划接口
    getYearPlan: '/oa-boot/yearPlan/getYearPlan',
    // 年计划添加细项
    addOrEditYearPlanDetail: '/oa-boot/yearPlan/addOrEditYearPlanDetail',
    // 获取年计划细项列表
    listYearPlanDetail: '/oa-boot/yearPlan/listYearPlanDetail',
    // 获取年计划细项详情
    getYearPlanDetail: '/oa-boot/yearPlan/getYearPlanDetail',
    // 根据用户获取任务列表
    getTaskByuser: '/oa-boot/task/v2/pageTask',
    // 年计划发起审批
    submitApprove:'/oa-boot/yearPlan/submit',
    getMonthPlanByYearAndMonth: '/oa-boot/month/plan/getMonthPlanByYearAndMonth'
  },
  coop: {
    // 根据配置的key值获取用户列表
    getUserListByConfigKey:'/oa-boot/common/getUserListByConfigKey',
    pageCoop: "/oa-boot/coop/pageCoop",
    addOrEdit:'/oa-boot/coop/addOrEdit',
    getCoop:'/oa-boot/coop/getCoop',
    agreeCoop:'/oa-boot/coop/agree',
    disagree:'/oa-boot/coop/disagree',
    returnBackCoop:'/oa-boot/coop/returnBackCoop',
    finalConfirmation:'/oa-boot/coop/finalConfirmation',
    cancelCoop:'/oa-boot/coop/cancelCoop'
  }

}
Vue.prototype.$api = api;

export default api;
