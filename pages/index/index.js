//index.js
//获取应用实例
const app = getApp()
// 1. 获取数据库引用
const db = wx.cloud.database()
var that = this
Page({
  data: {
    loadingState: 0,
    showTitle: '',
    isLogin: false,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function () {
    that = this
    this.setData({

      isLogin: app.globalData.isLogin

    })
    this.ititLoginAndOpenId()


    that.getStartTitle()
  },

  onGetUserInfo: function(e) {
    console.log(e)
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        isLogin: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      this.onGetOpenid()
      this.jumpIndexPage()
    }
  },
  ititLoginAndOpenId() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                isLogin: true,
              })
              app.globalData.isLogin = true
              this.onGetOpenid()
            }
          })
        }
      }
    })
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
       
        
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
       
      }
    })
  },

  /**
   * 点击重新加载
   */
  reload: function () {
    that.setData({
      loadingState: 0
    })
    that.getStartTitle()
  },

  test: function (e) {


    console.log(e);






  },

  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 获取展示的标题
   */
  getStartTitle: function () {
    db.collection('indexTitle').get({
      success(res) {
        console.log(res)
        if (res.errMsg == "collection.get:ok") {
          that.setData({
            loadingState: 1,
            showTitle: res.data[0].startTitle,
          })
        } else {
          that.setData({
            loadingState: 3
          })
        }
      }
    })
  },

  jumpIndexPage: function () {
    console.log(app.globalData.openid)

    wx.switchTab({
      url: '../../pages/pics/pics',
    })
  }
})