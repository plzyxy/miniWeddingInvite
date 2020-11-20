// pages/pics/pics.js
const app = getApp()

var that = this
// 1. 获取数据库引用
const db = wx.cloud.database()
const _ = db.command
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    height: wx.getSystemInfoSync().windowHeight,
    loadingState: 0,
    pageData: null,
    isPlayingMusic: true,
    isShowAd:false,
    isShowEdit:false,
    isLogin:false
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.getPageData()
   
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    innerAudioContext.onPlay(() => {
      console.log('录音播放开始');
      that.setData({
        isPlayingMusic: true
      })
    })

    innerAudioContext.onStop(() => {
      console.log('录音播放停止');
      that.setData({
        isPlayingMusic: false
      })
    })

    innerAudioContext.onEnded(() => {
      console.log('录音播放结束');
      that.setData({
        isPlayingMusic: false
      })
    })

    innerAudioContext.onPause(() => {
      console.log('录音播放暂停');
      that.setData({
        isPlayingMusic: false
      })
    })
  },
  editImage(e) {
    console.log(e)

    var type = e.currentTarget.id

    this.doUpload(type,1)


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
      this.initLoginAndOpenId()
    }
  },

    /**
   * 打开关闭dialog
   */
  toggleDialog(e) {

    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  editbnner:function(e){
    console.log(e)


  },
  // 上传图片
  doUpload: function (type,tp) {

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        var timestamp = (new Date()).valueOf();
        const cloudPath = app.globalData.openid + '/' +
          Math.floor(Math.random() * 10000 + 10000) + timestamp + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            if(tp==1){
              that.updateIndexHunShaImage(type, res.fileID)
            }else if(tp==2){
              that.updateIndexHunShaImage_banner(type, res.fileID)
            }
            
            // app.globalData.fileID = res.fileID
            // app.globalData.cloudPath = cloudPath
            // app.globalData.imagePath = filePath

            // wx.navigateTo({
            //   url: '../storageConsole/storageConsole'
            // })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },



  updateIndexHunShaImage: function (type, url) {

    // 调用云函数
    wx.cloud.callFunction({
      name: 'dataUitil',
      data: {
        type: type, url: url
      },
      success: res => {
        console.log('[云函数] [dataUitil] res: ', res)
        that.getPageData()

      },
      fail: err => {
        console.error('[云函数] [dataUitil] 调用失败', err)

      }
    })

  },

checkPermission(){
  console.log("请求权限")
  if(app.globalData.isLogin){
    db.collection('permission').get({
      success(res) {
        console.log(res)

        if (res.errMsg == "collection.get:ok") {
          that.setData({
            isShowAd: res.data[0].isShowAd,
            isShowEdit: res.data[0].isShowEdit
          })
          app.globalData.isShowAd=res.data[0].isShowAd
          app.globalData.isShowEdit=res.data[0].isShowEdit
          app.globalData.isShowInput=res.data[0].isShowInput
          app.globalData.isShowInvite=res.data[0].isShowInvite
          

         
        } else {
         console.log("error")
        }
      }
    })

  }
},


  updateIndexHunShaImage_banner: function (type, url) {

    // 调用云函数
    wx.cloud.callFunction({
      name: 'editbanner',
      data: {
        type: type, url: url
      },
      success: res => {
        console.log('[云函数] [dataUitil] res: ', res)
        that.getPageData()

      },
      fail: err => {
        console.error('[云函数] [dataUitil] 调用失败', err)

      }
    })

  },

  //编辑banner
  editBannerItem(e){
    var type = e.currentTarget.id

    this.doUpload(type,2)


  },
  xmadSuccess(xmId, xmInfo) {
    console.log(xmId) //成功返回的广告位id
    console.log(xmInfo) //成功返回的广告位详细信息
    console.log(this.data.adData)
},
xmadFail(xmId, code, msg) {
  console.log(xmId) //失败的广告位id
  console.log(code) //错误码
  console.log(msg) //错误信息
},

  /**
   * 获取页面数据
   */
  getPageData: function () {
    this.initLoginAndOpenId()
    
    db.collection('indexHunShaList').get({
      success(res) {
        console.log(res)
        if (res.errMsg == "collection.get:ok") {
          that.setData({
            loadingState: 1,
            pageData: res.data[0],
          })
          //设置背景音乐
          innerAudioContext.autoplay = true
          innerAudioContext.loop = true
          if (that.data.pageData.backMusic) {
            innerAudioContext.src = that.data.pageData.backMusic
          }
        } else {
          that.setData({
            loadingState: 3
          })
        }
        wx.stopPullDownRefresh()
      }
    })
  },

 


   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that.setData({
      pagernumber: 0,
      isRefresh: true
    })
    that.getPageData()
  },

  /**
   * banner的照片点击
   */
  bannerimageClick: function (e) {
    let imagetype = e.currentTarget.id
    wx.navigateTo({
      url: '../piclist/piclist?imagetype=' + imagetype,
    })
  },

  /**
   * banner的照片点击
   */
  listimageClick: function (e) {
    let imagetype = e.currentTarget.id
    wx.navigateTo({
      url: '../piclist/piclist?imagetype=' + imagetype,
    })
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
  del_item: function () {
    db.collection('test')
      .where({
        w_id: "999999"
      }).
      //     .get({
      //       success(e){
      // console.log(e)
      //       }
      //     })

      update({
        data: {
          'list': _.pull({
            _id: _.eq("888")
          })
        }
      }).then(res => {
        console.log(res)
      })



  },
  initLoginAndOpenId() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              that.setData({
                userInfo: res.userInfo,
                isLogin: true,
              })
            app.globalData.isLogin=true
              that.onGetOpenid()
            }
          })
        }else{
          console.log("未授权")
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
        that.checkPermission()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
       
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (innerAudioContext.paused) {
      innerAudioContext.play();
    }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  play: function (event) {
    if (this.data.isPlayingMusic) {
      that.setData({
        isPlayingMusic: false
      })
      innerAudioContext.pause();
    } else {
      that.setData({
        isPlayingMusic: true
      })
      innerAudioContext.play();
    }
  }
})