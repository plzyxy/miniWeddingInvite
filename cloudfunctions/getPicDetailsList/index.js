// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    var open_id=cloud.getWXContext.OPENID
    if(event.open_id){
        open_id=event.open_id
    }
    var url=event.url
    var type=event.type

  const res=  db.collection('indexHunShaList')
    .where({
      w_id: open_id,
      'banner.imagetype':type
    })
    .update({
      data: {
       'banner.$.imageurl': url
      }
    })
    return await  res
}