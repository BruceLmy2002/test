

import request from '@/utils/request'

// 获取全部卡口点信息
export function getAllCamInfo() {
  return request({
    url: '/camTra/getAllCamInfo',
    method: 'post'
  })
}

// 轨迹查询
export function searchCarTrajectory(data){
  return request({
    url: '/camTra/searchCarTrajectory',
    method: 'post',
    data: data,
  })
}

// 车辆次数统计包含以下两个方法
export function vehicleCamStats(data){
  return request({
    url: '/camTra/vehicleCamStats',
    method: 'post',
    data: data,
  })
}

export function listByCarNumberOrderInTimeRange(data){
  return request({
    url: '/camTra/listByCarNumberOrderInTimeRange',
    method: 'post',
    data: data,
  })
}
