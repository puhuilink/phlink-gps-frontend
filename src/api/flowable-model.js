import request from '@/utils/request'

/*
 * 流程管理模块
 */

export const importModel = (data) => {
  return request({
    url: '/flowable/model/import',
    method: 'post',
    data: data
  })
}

export const deployModel = (data) => {
  return request({
    url: '/flowable/model/deploy',
    method: 'post',
    data: data
  })
}

//
export const getModelList = (parms) => {
  return request({
    url: '/flowable/model/list',
    method: 'get',
    params: parms
  })
}

// 保存flowable模型
export const saveModel = (data) => {
  return request({
    url: '/flowable/model/save',
    method: 'post',
    data: data
  })
}

// 更新flowable模型
export const updateModel = (data) => {
  return request({
    url: '/flowable/model/update',
    method: 'put',
    data: data
  })
}

// 删除flowable模型
export const deleteModel = (parms) => {
  return request({
    url: '/flowable/model/delete',
    method: 'delete',
    params: parms
  })
}

// 根据id查询模型
export const queryById = (parms) => {
  return request({
    url: '/flowable/model/queryById',
    method: 'get',
    params: parms
  })
}

// 保存编辑器
export const saveModelEditor = (data) => {
  return request({
    url: '/flowable/model/saveModelEditor',
    method: 'put',
    data: data
  })
}
