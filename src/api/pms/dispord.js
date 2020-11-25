import request from '@/utils/request'

const api_name = '/pms/dispord'

export default {
  findPageDispOrd(dispOrdQuery, pageNum, pageSize){
    return request({
      // ## 调用后台 带条件的分页查询 - 调度指令库
      url: `${api_name}/${pageNum}/${pageSize}`,
      method: 'post',
      data: dispOrdQuery
    })
  },
  // ## 创建调度指令库信息
  save(dispOrd) {
    return request({
      url: `${api_name}/createDispOrd`,
      method: 'post',
      data: dispOrd
    })
  },
  // ## 回显
  getById(dispOrdId) {
    return request({
      url: `${api_name}/${dispOrdId}`,
      method: 'get'
    })
  },
  // ## 修改调度指令库
  update(dispOrd) {
    return request({
      url: `${api_name}/updateDispOrd`,
      method: 'put',
      data: dispOrd
    })
  },
  // ## 删除调度库指令
  deleteDispOrd(dispOrdId) {
    return request({
      url: `${api_name}/${dispOrdId}`,
      method: `delete`
    })
  }

}
