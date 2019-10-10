import axios from '../axios'

/*
 * 项目表单模块
 */

// 分页查询
//根据objid查询
//
export const findPage = (data) => {
  return axios({
    url: '/hDictionry/findPage',
    method: 'post',
    data
  })
}
// 保存  {"pid":"2","content":"[{label:'',value:''}]","name":"333"}
//编辑的时候 加 "id":""
export const save = (data) => {
  return axios({
    url: '/hDictionry/save',
    method: 'post',
    data
  })
}
//ID查询信息  id=1
export const findById = (params) => {
  return axios({
    url: '/hDictionry/findById',
    method: 'get',
    params
  })
}
//删除 [{"id":"2"}]
export const batchDelete = (data) => {
  return axios({
    url: '/hDictionry/delete',
    method: 'post',
    data
  })
}
