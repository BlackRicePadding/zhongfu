
import { define } from './api_helper';

const url = '/api';
const apiObject = {
  decision: {
    // 登录页管理员登录
    loginIn: {
      url: `${url}/authenticate`,
      method: 'post',
    },
    // 铃铛处的数据回显
    SMSState: {
      url: `${url}/messager/mian/getSmsMessageState`,
    },
    // 首页条数数据回显
    IndexList: {
      url: `${url}/messager/mian/indexMainList`
    },
    // 首页流量图表数据
    IndexFlowCharts: {
      url: `${url}/messager/mian/messageFlow`
    },
    // 过滤流量图表格
    selectFlowCharts: {
      url: `${url}/messager/mian/messageFlow?`
    },
    // cpu使用率
    cpuCharts: {
      url: `${url}/messager/mian/getCpu`
    },
    // 系统信息参数获取
    systemInfo: {
      url: `${url}/messager/mian/getSystem`
    },
    // 通讯录列表
    employeesList: {
      url: `${url}/messager/employee/getEmployees?`
    },
    // 搜索通讯录
    selectEmployees: {
      url: `${url}/messager/employee/getEmployees?`
    },
    // 下载
    downLoadEmployees: {
      url: `${url}/messager/employee/employeeExport`,
      method: 'post',
      responseType: 'blob'
    },
    // 上传
    uploadEmployees: {
      url: `${url}/messager/employee/importEmployeeExcel`,
      method: 'post',
      headers: {
        'Content-type': 'multipart/form-data',
      }
    },
    // 弹窗下拉框中获取部门
    receiveDepartment: {
      url: `${url}/messager/department/getDepartment`,
    },
    // 通讯录出的是否启用
    addIsStart: {
      url: `${url}/messager/employee/enableEmployees`,
      method: 'post'
    },
    // 创建通讯用户
    createEmployees: {
      url: `${url}/messager/employee/saveEmployees`,
      method: 'post',
    },
    // 更新通讯用户
    updateEmployees: {
      url: `${url}/messager/employee/updateEmployees`,
      method: 'patch',
    },
    // 删除通讯用户
    deleteEmployees: {
      url: `${url}/messager/employee/employeeDelete/`,
      method: 'post',
    },
    // 部门树状图
    departmentTree: {
      url: `${url}/messager/department/departmentTree`
    },
    // 部门列表
    departmentList: {
      url: `${url}/messager/department/getDepartmentList?`,
    },
    // 上级部门数据
    SuperiorDepartmentData: {
      url: `${url}/messager/department/getDepartments`,
    },
    // 查询部门
    selectDepartment: {
      url: `${url}/messager/department/getDepartmentList?`,
    },
    // 新建部门
    createDepartment: {
      url: `${url}/messager/department/saveDepartment/`,
      method: 'post',
    },
    // 修改部门
    updateDepartment: {
      url: `${url}/extra/departments/`,
      method: 'patch',
    },
    // 删除部门
    deleteDepartment: {
      url: `${url}/messager/department/departmentDelete/`,
      method: 'post',
    },
    // 临时组列表
    temporaryGroupList: {
      url: `${url}/messager/groupEmployee/getGtoupList?`,
    },
    // 创建临时组
    createTemporaryGroup: {
      url: `${url}/messager/groupEmployee/addGroupList`,
      method: 'post',
    },
    // 查询临时组
    selectTemporaryGroup: {
      url: `${url}/messager/groupEmployee/getGtoupList?`,
    },
    // 更新临时组
    updateTemporaryGroup: {
      url: `${url}/messager/groupEmployee/group-temps`,
      method: 'patch',
    },
    // 删除临时组
    deleteTemporaryGroup: {
      url: `${url}/messager/groupEmployee/deleteGroupList`,
      method: 'post',
    },
    selectEmployeesGroup: {
      url: `${url}/messager/groupEmployee/employee-group/`,
    },
    // 标签列表
    tagsList: {
      url: `${url}/messager/smsKeyword/getSmsKeywordList?`,
    },
    // 搜索标签
    selectTag: {
      url: `${url}/messager/smsKeyword/getSmsKeywordList?`,
    },
    isEnables: {
      url: `${url}/messager/smsKeyword/enableSmsKeyword`,
      method: 'post'
    },
    // 创建标签
    createTags: {
      url: `${url}/sms-keywords/`,
      method: 'post',
    },
    // 标签类型接口
    tagsTypeList: {
      url: `${url}/sms-keyword-types`,
    },
    // 编辑标签
    updateTags: {
      url: `${url}/extra/sms-keywords`,
      method: 'patch',
    },
    // 删除标签
    deleteTags: {
      url: `${url}/messager/smsKeyword/deleteSmsKeyword`,
      method: 'post',
    },
    // 查询策略列表
    selectPolicy: {
      url: `${url}/messager/policy/getPolicyList?`,
    },
    // 添加策略
    createPolicy: {
      url: `${url}/policies/`,
      method: 'post'
    },
    // 修改策略
    updatePolicy: {
      url: `${url}/extra/policies/`,
      method: 'patch'
    },
    // 删除策略
    deletePolicy: {
      url: `${url}/messager/policy/policyDelete`,
      method: 'post'
    },
    // 是否激活
    isEnablePolicy: {
      url: `${url}/messager/policy/enablePolicy`,
      method: 'post'
    },
    // 白名单列表
    whiteList: {
      url: `${url}/white-lists/`,
    },
    // 编辑白名单
    updateWhiteList: {
      url: `${url}/white-lists/`,
      method: 'put',
    },
    // 删除白名单
    deleteWhiteList: {
      url: `${url}/white-listsDelete/`,
      method: 'post',
    },
    // 短信模板列表
    smsTemplate: {
      url: `${url}/messager/smsTemplate/getSmsTemplate?`,
    },
    // 是否启动
    isActive: {
      url: `${url}/messager/smsTemplate/enableSmsTemplate`,
      method: 'post'
    },
    // 添加短信模板
    createSMSTemplate: {
      url: `${url}/messager/smsTemplate/saveSmsTemplate`,
      method: 'post',
    },
    // 删除短信模板
    deleteSMSTemplate: {
      url: `${url}/messager/smsTemplate/deleteSmsTemplate`,
      method: 'post',
    },
    // 编辑短信模板
    updateSMSTemplate: {
      url: `${url}/messager/smsTemplate/editSmsTemplate`,
      method: 'patch',
    },
    // 搜索短信模板（按名称）
    selectSMSTemplate: {
      url: `${url}/messager/smsTemplate/getSmsTemplate?`,
    },
    // 短信模板弹窗标签获取
    receiveSMSTags: {
      url: `${url}/messager/smsKeyword/smsKeywordList`,
    },
    // 短信发送/接受列表回显接口
    smsRSList: {
      url: `${url}/messager/smsMessage/sms-messages?`,
    },
    // 短信发送/接受查询接口
    selectSMSRS: {
      url: `${url}/messager/smsMessage/sms-messages?`,
  },
    // 短信发送弹窗树接口
    SMSTree: {
      url: `${url}/messager/department/departmentEmployeesTree?`,
    },
    SMSTempTree: {
      url: `${url}/messager/groupEmployee/groupTree?`
    },
    // 业务计划列表
    bPlanList: {
      url: `${url}/messager/planInfo/planInfoList?`
    },
    // 业务计划处的单独的通讯录接口（额外关联个群组）
    bPlanAddress: {
      url: `${url}/messager/planInfo/getEmployees?`
    },
    // 业务计划处通讯录树
    bPlanGroupTree: {
      url: `${url}/messager/planInfo/groupTree`
    },
    // 进入修改计划页面时需要获取的数据
      getBPlanList: {
        url: `${url}/messager/planInfo/getPlanInfoMessage?`
    },
    // 修改业务计划
    updateBPlan: {
      url: `${url}/messager/planInfo/editPlanInfo`,
      method: 'post'
    },
    // 删除业务计划
    deleteBPlan: {
      url: `${url}/messager/planInfo/deletePlanInfoListById`,
      method: 'post'
    },
    deleteBPlanN: {
      url: `${url}/messager/planInfo/deletePlaninfos`,
      method: 'post'
    },
    // 业务计划短信模板
    bPlanSMSTemp: {
      url: `${url}/messager/smsTemplate/getPlanSmsTemplate?`,
    },
    // 业务计划策略模板
    bPlanPolicy: {
      url: `${url}/messager/policy/getPlanPolicyList?`,
    },
    // 内网业务计划列表回显接口
    insideBPlanList: {
      url: `${url}/messager/planInfo/planinfos?`,
    },
    // 内网业务计划列表编辑保存接口
    updateInsideBPlan: {
      url: `${url}/messager/planInfo/planinfos`,
      method: 'patch'
    },
    countList: {
      url: `${url}/messager/planInfo/getPlanInfo`,
    },
    // 策略模板列表
    policiesList: {
      url: `${url}/messager/policy/getPolicyList?`
    },
    // 四步骤保存
    addBPlan: {
      url: `${url}/messager/planInfo/savePlanInfo`,
      method: 'post'
    },
    //保存自由发送接口
    addFreePlan: {
      url: `${url}/messager/planInfo/savePlanInfoFree`,
      method: 'post'
    },
    updateFreePlan: {
      url: `${url}/messager/planInfo/editPlanInfoFree`,
      method: 'post'
    },
    // 短信发送接口
    sendSMS: {
      url: `${url}/messager/send/message`,
      method: 'post'
    },
    // 自由短信发送接口
    sendFreeSMS: {
      url: `${url}/messager/send/freeMessage`,
      method: 'post'
    },
    // 点击列表右侧数据回显
    bPlanDetail: {
      url: `${url}/messager/planInfo/planInfoListById?`,
    },
    // 通过apikey获取绑定模板信息
    planTemplateList: {
      url: `${url}/messager/plan-template`,
      method: 'post'
    },
    // 通过模板ID获取关联值
    TemplateIDList: {
      url: `${url}/messager/send/template?`,
    },
    // 计划日志
    planLog: {
      url: `${url}/messager/indexLog/LogList?`,
    },
    // 查询计划日志
    selectPlanLog: {
      url: `${url}/messager/indexLog/LogList?`,
    },
    // 删除计划日志
    deletePlanLog: {
      url: `${url}/messager/indexLog/LogDelete`,
      method: 'post'
    },
    // 导入计划日志
    uploadPlanLog: {
      url: `${url}/messager/indexLog/importLogExcel`,
      method: 'post',
      headers: {
        'Content-type': 'multipart/form-data',
      }
    },
    // 导出计划日志
    downLoadPlanLog: {
      url: `${url}/messager/indexLog/logExport`,
      method: 'post',
      responseType: 'blob'
    },
    // 系统日志
    systemLog: {
      url: `${url}/messager/indexLog/LogSysList?`
    },
    // 查询系统日志
    selectSystemLog: {
      url: `${url}/messager/indexLog/LogSysList?`
    },
    // 删除系统日志
    deleteSystemLog: {
      url: `${url}/messager/indexLog/LogSysDelete`,
      method: 'post'
    },
    // 导入系统日志
    uploadSystemLog: {
      url: `${url}/messager/indexLog/importLogSysExcel`,
      method: 'post',
      headers: {
        'Content-type': 'multipart/form-data',
      }
    },
    // 导出系统日志
    downloadSystemLog: {
      url: `${url}/messager/indexLog/logSysExport`,
      method: 'post',
      responseType: 'blob'
    },
    // 预警日志
    earlyLog: {
      url: `${url}/messager/logwarning/getList?`,
    },
    // 预警日志状态
    earlyLogState: {
      url: `${url}/log-warning-people`,
      method: 'post',
    },
    // 预警日志导入
    uploadEarlyLog: {
      url: `${url}/messager/indexLog/importLogWarningExtranet`,
      method: 'post',
      headers: {
        'Content-type': 'multipart/form-data',
      }
    },
    // 预警日志导出
    downloadEarlyLog: {
      url: `${url}/messager/indexLog/logWarningExtranet`,
      method: 'post',
      responseType: 'blob'
    },
    // sendwebSocket
    sendWebSocket: {
      url: `${url}/app/subscribe`,
      method: 'post'
    },
    // 监听
    getWebSocket: {
      url: `${url}/websocket`
    },
    // 获取修改部门的信息
    getBmValues: {
      url: `${url}/messager/department/info?`
    },
    // 鉴权设置
    Decertific: {
      url: `${url}/messager/smsConfig/sms-system-configs`,
      method: 'post'
    },
    // 鉴权设置值回显
    DecertificEcho: {
      url: `${url}/messager/smsConfig/getSmsconfigs`,
    },
    // 预警邮箱数据回显
    warningEmail: {
      url: `${url}/messager/smsConfig/getTheWarningEmail`,
    },
    // 编辑预警邮箱
    EditWarningEmail: {
      url: `${url}/messager/smsConfig/theWarningEmail`,
      method: 'post'
    },
    // 数据库备份
    dataBackUp: {
      url: `${url}/messager/backupRecover/startBackup`,
    },
    // 数据库列表
    dataBaseList: {
      url: `${url}/messager/backupRecover/backupRecList?`,
    },
    // 数据恢复
    recoverData: {
      url: `${url}/messager/backupRecover/fileBackupRestore?`
    },
    // 密码设置
    changePassword: {
      url: `${url}/messager/adminUser/changePasword`,
      method: 'post'
    }
  },
  form: {
    // 登录页管理员登录
    findPage: {
      url: `${url}/hObject/findPage`,
      method: 'post',
    },
    save: {
      url: `${url}/hObject/save`,
      method: 'post',
    },
    findById: {
      url: `${url}/hObject/findById`,
      method: 'post',
    },
    deleteOne: {
      url: `${url}/hObject/delete`,
      method: 'post',
    },
    findDataPage: {
      url: `${url}/hObjectData/findPage`,
      method: 'post',
    },
    saveData: {
      url: `${url}/hObjectData/save`,
      method: 'post',
    },
    findByDataId: {
      url: `${url}/hObjectData/findById`,
      method: 'post',
    },
    batchDelete: {
      url: `${url}/hObjectData/delete`,
      method: 'post',
    }
  },
  formDisc
};
export default define(apiObject);
