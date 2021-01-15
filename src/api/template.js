import request from '@/utils/request'

/*
 * 模板管理模块
 */

// 保存配置
export const saveTemplate = (data) => {
  return request({
    url: '/sys-template',
    method: 'post',
    data: data
  })
}
// 获取配置列表
export const getTemplate = (parms) => {
  return request({
    url: '/sys-template',
    method: 'get',
    params: parms
  })
}

// 根据主键删除配置
export const deleteTemplate = (id) => {
  return request({
    url: '/sys-template/' + id,
    method: 'delete'
  })
}

