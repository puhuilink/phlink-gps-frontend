import request from '@/utils/request'

/*
 * 任务
 */

export const backNodes = (parms) => {
  return request({
    url: '/flowable/task/backNodes',
    method: 'get',
    params: parms
  })
}

export const getList = (parms) => {
  return request({
    url: '/flowable/task/list',
    method: 'get',
    params: parms
  })
}

export const queryById = (parms) => {
  return request({
    url: '/flowable/task/queryById',
    method: 'get',
    params: parms
  })
}

export const claim = (data) => {
  return request({
    url: '/flowable/task/claim',
    method: 'put',
    data: data
  })
}

export const unclaim = (data) => {
  return request({
    url: '/flowable/task/unclaim',
    method: 'put',
    data: data
  })
}

export const listDone = (parms) => {
  return request({
    url: '/flowable/task/listDone',
    method: 'get',
    params: parms
  })
}

export const listToRead = (parms) => {
  return request({
    url: '/flowable/task/listToRead',
    method: 'get',
    params: parms
  })
}

export const executeTaskData = (parms) => {
  return request({
    url: '/flowable/task/executeTaskData',
    method: 'get',
    params: parms
  })
}

export const listTodo = (parms) => {
  return request({
    url: '/flowable/task/listTodo',
    method: 'get',
    params: parms
  })
}

export const complete = (data) => {
  return request({
    url: '/flowable/task/complete',
    method: 'put',
    data: data
  })
}

export const read = (data) => {
  return request({
    url: '/flowable/task/read',
    method: 'put',
    data: data
  })
}

export const stopProcessInstance = (data) => {
  return request({
    url: '/flowable/task/stopProcessInstance',
    method: 'put',
    data: data
  })
}

export const assign = (data) => {
  return request({
    url: '/flowable/task/assign',
    method: 'put',
    data: data
  })
}

export const delegate = (data) => {
  return request({
    url: '/flowable/task/delegate',
    method: 'put',
    data: data
  })
}

export const back = (data) => {
  return request({
    url: '/flowable/task/back',
    method: 'put',
    data: data
  })
}
