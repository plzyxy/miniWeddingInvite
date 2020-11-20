// pages/swiper/swiper.js
import animation from '../../utils/animation';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: true,
       

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    //页面展示时，触发动画
    onShow: function () {
        animation.sliderightshow(this, 'slide_up1', 0, 1)

        setTimeout(function () {
            animation.show(this, 'slide_up2', 1)
        }.bind(this), 900);
    },
    //页面隐藏时，触发渐出动画
    onHide: function () {
        //你可以看到，动画参数的200,0与渐入时的-200,1刚好是相反的，其实也就做到了页面还原的作用，使页面重新打开时重新展示动画
        animation.slideupshow(this, 'slide_up1', 200, 0)
        //延时展现容器2，做到瀑布流的效果，见上面预览图
        setTimeout(function () {
            animation.slideupshow(this, 'slide_up2', 200, 0)
        }.bind(this), 200);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    viewcontroller() {

        if (!this.data.isShow) {
            animation.show(this, 'slide_up2', 1)
            animation.sliderightshow(this, 'slide_up1', 0, 1)
        } else {
            animation.show(this, 'slide_up2', 0)
            animation.sliderightshow(this, 'slide_up1', -320, 0)
        }
        this.setData({
            isShow: !this.data.isShow
        })


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