import axios from '../axios'

/*
 * 首页模块
 */

// 首页头信息
export const indexOne = (params) => {
    return axios({
        url: '/indexData/indexOne',
        method: 'get',
        params
    })
}
// 首页头信息
export const indexFour = (params) => {
  return axios({
    url: '/indexData/indexFour',
    method: 'get',
    params
  })
}

//任务执行情况
export const findTaskTatus = (params) => {
    return axios({
        url: '/indexData/findTaskTatus',
        method: 'get',
        params
    })
}

// 首页头信息
export const findTaskPage = (data) => {
  return axios({
    url: '/indexData/findTaskPage',
    method: 'post',
    data
  })
}
