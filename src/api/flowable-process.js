import request from '@/utils/request'

/*
 * 流程
 */

export const formData = (parms) => {
  return request({
    url: '/flowable/processInstance/formData',
    method: 'get',
    params: parms
  })
}

export const comments = (parms) => {
  return request({
    url: '/flowable/processInstance/comments',
    method: 'get',
    params: parms
  })
}

export const start = (data) => {
  return request({
    url: '/flowable/processInstance/start',
    method: 'post',
    data: data
  })
}

export const listMyInvolvedSummary = (parms) => {
  return request({
    url: '/flowable/processInstance/listMyInvolvedSummary',
    method: 'get',
    params: parms
  })
}

export const listMyInvolved = (parms) => {
  return request({
    url: '/flowable/processInstance/listMyInvolved',
    method: 'get',
    params: parms
  })
}

export const list = (parms) => {
  return request({
    url: '/flowable/processInstance/list',
    method: 'get',
    params: parms
  })
}

export const queryById = (parms) => {
  return request({
    url: '/flowable/processInstance/queryById',
    method: 'get',
    params: parms
  })
}

export const deletePro = (parms) => {
  return request({
    url: '/flowable/processInstance/delete',
    method: 'delete',
    params: parms
  })
}

// 更新
export const updatePro = (suspendOrActivate, parms) => {
  return request({
    url: '/flowable/processInstance/' + suspendOrActivate,
    method: 'put',
    params: parms
  })
}
