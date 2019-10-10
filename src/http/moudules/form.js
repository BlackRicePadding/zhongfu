import axios from '../axios'

/*
 * 项目表单模块
 */

// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/hObject/findPage',
    method: 'post',
    data
  })
}
// 保存   {"formname":"11111","formcode":"111111","formproperty":"111111","content":"11111"}
//编辑的时候 加 "id":""
export const save = (data) => {
  return axios({
    url: '/hObject/save',
    method: 'post',
    data
  })
}
//ID查询信息  id=1
export const findById = (params) => {
  return axios({
    url: '/hObject/findById',
    method: 'get',
    params
  })
}
//删除 [{"id":"2"}]
export const deleteOne = (data) => {
  return axios({
    url: '/hObject/delete',
    method: 'post',
    data
  })
}

// 分页查询
//根据objid查询
//{"pageNum":1,"pageSize":10,"columnFilters":{"objId":{"name":"objId","value":"2"}}}
//
export const findDataPage = (data) => {
  return axios({
    url: '/hObjectData/findPage',
    method: 'post',
    data
  })
}
// 保存   {"objid":"2","content":"weqweq"}
//编辑的时候 加 "id":""
export const saveData = (data) => {
  return axios({
    url: '/hObjectData/save',
    method: 'post',
    data
  })
}
//ID查询信息  id=1
export const findByDataId = (params) => {
  return axios({
    url: '/hObjectData/findById',
    method: 'get',
    params
  })
}
//删除 [{"id":"2"}]
export const batchDelete = (data) => {
  return axios({
    url: '/hObjectData/delete',
    method: 'post',
    data
  })
}
