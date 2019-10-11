/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

// 后台管理系统服务器地址
export const baseUrl = 'http://192.168.1.236:8011/api'
// export const baseUrl = 'http://xuyejiang520.yicp.io/api'
// 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://192.168.0.150:8002'

export default {
    baseUrl,
    backupBaseUrl
}
