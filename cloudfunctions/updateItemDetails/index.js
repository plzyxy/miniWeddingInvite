// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
    var open_id=cloud.getWXContext.OPENID
    if(event.open_id){
        open_id=event.open_id
    }
    var url=event.url
    var type=event.type
    var content=event.content

  const res=  db.collection('picListDetails')
    .where({
      _id: type
    })
    .update({
      data: {
       'imageurl': url,
       'imagecontent':content
      }
    })
    return await  res
}