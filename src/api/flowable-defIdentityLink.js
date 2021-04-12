import request from '@/utils/request'

export const list = (parms) => {
  return request({
    url: '/flowable/processDefinitionIdentityLink/list',
    method: 'get',
    params: parms
  })
}

export const saveLink = (data) => {
  return request({
    url: '/flowable/processDefinitionIdentityLink/save',
    method: 'post',
    data: data
  })
}

export const deleteLink = (parms) => {
  return request({
    url: '/flowable/processDefinitionIdentityLink/delete',
    method: 'delete',
    params: parms
  })
}

