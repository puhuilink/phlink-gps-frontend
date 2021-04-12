import request from '@/utils/request'

export const renderedStartForm = (parms) => {
  return request({
    url: '/flowable/processDefinition/renderedStartForm',
    method: 'get',
    params: parms
  })
}

export const list = (parms) => {
  return request({
    url: '/flowable/processDefinition/list',
    method: 'get',
    params: parms
  })
}

// 导入
export const importDef = (data) => {
  return request({
    url: '/flowable/processDefinition/import',
    method: 'post',
    data: data
  })
}

// 更新
export const updateDef = (suspendOrActivate, parms) => {
  return request({
    url: '/flowable/processDefinition/' + suspendOrActivate,
    method: 'put',
    params: parms
  })
}

// 删除
export const deleteDef = (parms) => {
  return request({
    url: '/flowable/processDefinition/delete',
    method: 'delete',
    params: parms
  })
}

export const listMyself = (parms) => {
  return request({
    url: '/flowable/processDefinition/listMyself',
    method: 'get',
    params: parms
  })
}
