import axios from '../axios'


// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/researchObject/findPage',
    method: 'post',
    data
  })
}

export const save = (data) => {
  return axios({
    url: '/researchTypes/save',
    method: 'post',
    data
  })
}

export const findType = (data) => {
  return axios({
    url: '/researchTypes/findPage',
    method: 'post',
    data
  })
}

export const findByid = (params) => {
  return axios({
    url: '/researchFollow/findByObjid',
    method: 'get',
    params
  })
}

export const saveFollow = (data) => {
  return axios({
    url: '/researchFollow/saveFollow',
    method: 'post',
    data
  })
}
