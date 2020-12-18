import request from '@/utils/request'

/*
 * 告警配置管理模块
 */

// 保存配置
export const saveAlarmConfig = (data) => {
  return request({
    url: '/iot-alarm-config',
    method: 'post',
    data: data
  })
}
// 获取配置列表
export const getAlarmConfig = (parms) => {
  return request({
    url: '/iot-alarm-config',
    method: 'get',
    params: parms
  })
}

// 更新配置
export const updateAlarmConfig = (data) => {
  return request({
    url: '/iot-alarm-config',
    method: 'put',
    data: data
  })
}
// 根据主键删除配置
export const deleteAlarmConfig = (id) => {
  return request({
    url: '/iot-alarm-config/' + id,
    method: 'delete'
  })
}

