// pages/invite/invite.js
var that = this
var app = getApp()

// 1. 获取数据库引用
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowInvite:false,
    showDialog: false,
    loadingState: 0,
    pageData: null,
    inputValue:"",
    isInput:false
  },
 

  /**
   * 输入
   * @param {*} e 
   */
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.setNavigationBarTitle({
      title: '邀请函'
      
    })
    that.getPageData()
  },

  /**
   * 获取页面数据
   */
  getPageData: function () {
    db.collection('inviteTab').get({
      success(res) {
        console.log(res)
        if (res.errMsg == "collection.get:ok") {
          that.setData({
            loadingState: 1,
            pageData: res.data[0],
            isShowInvite:app.globalData.isShowInvite
          })
        } else {
          that.setData({
            loadingState: 3
          })
        }
      }
    })
  },

    /**
   * 打开关闭dialog
   */
  toggleDialog(e) {

    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  /**
   * 点击重新加载
   */
  reload: function () {
    that.setData({
      loadingState: 0
    })
    that.getPageData()
  },
   /**
   * 输入
   * @param {*} e 
   */
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      that.setData({
        userInfo: e.detail.userInfo
      })
      that.setData({
        isInput: true
      })
        that.toggleDialog()
     
      // that.foo()
    } else {
    
      wx.showToast({
        title: '授权登录才能接受邀请哦',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})