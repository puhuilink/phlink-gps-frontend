import request from '@/utils/request'

/*
 * 字典管理模块
 */

// 保存字典
export const saveFence = (data) => {
  return request({
    url: '/iot-fence',
    method: 'post',
    data: data
  })
}
// 获取字典列表
export const getFence = (parms) => {
  return request({
    url: '/iot-fence',
    method: 'get',
    params: parms
  })
}

// 更新部门
export const updateFence = (data) => {
  return request({
    url: '/iot-fence',
    method: 'put',
    data: data
  })
}
// 根据主键删除字典
export const deleteFence = (id) => {
  return request({
    url: '/iot-fence/' + id,
    method: 'delete'
  })
}

