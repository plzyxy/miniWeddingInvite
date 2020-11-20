//app.js
import xmad from './utils/xmadx_sdk';
App({


  
  onLaunch: function() {
    wx.cloud.init({
      env: "weixin-plzyxy-1e9dcf",
      traceUser: true
    })
   
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log("已授权");
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.isLogin=true

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // xmad.init()
  },
  globalData: {
    userInfo: null,
    isLogin:false,
    isShowEdit:false,
    isShowAd:false
  }
})