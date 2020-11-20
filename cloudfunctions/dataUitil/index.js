const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

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
      'imagetypelist.imagetype':type
    })
    .update({
      data: {
       'imagetypelist.$.imageurl': url
      }
    })
    return await  res
}