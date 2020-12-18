import request from '@/utils/request'

/*
 * 围栏管理模块
 */

// 保存围栏
export const saveFence = (data) => {
  return request({
    url: '/iot-fence',
    method: 'post',
    data: data
  })
}
// 获取围栏列表
export const getFence = (parms) => {
  return request({
    url: '/iot-fence',
    method: 'get',
    params: parms
  })
}

// 更新围栏
export const updateFence = (data) => {
  return request({
    url: '/iot-fence',
    method: 'put',
    data: data
  })
}
// 根据主键删除围栏
export const deleteFence = (id) => {
  return request({
    url: '/iot-fence/' + id,
    method: 'delete'
  })
}

