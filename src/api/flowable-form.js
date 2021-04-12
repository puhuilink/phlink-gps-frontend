import request from '@/utils/request'

/*
 * 流程管理模块
 */

export const getFormById = (parms) => {
  return request({
    url: '/flowable/form/queryById',
    method: 'get',
    params: parms
  })
}

//
export const getFormList = (parms) => {
  return request({
    url: '/flowable/form/list',
    method: 'get',
    params: parms
  })
}

// 保存flowable表单
export const saveForm = (data) => {
  return request({
    url: '/flowable/form/save',
    method: 'post',
    data: data
  })
}

// 更新flowable表单
export const updateForm = (data) => {
  return request({
    url: '/flowable/form/update',
    method: 'put',
    data: data
  })
}

// 删除flowable表单
export const deleteForm = (parms) => {
  return request({
    url: '/flowable/form/delete',
    method: 'delete',
    params: parms
  })
}
