//渐入，渐出实现 
function show (that,param,opacity){
    var animation = wx.createAnimation({
      //持续时间800ms
      duration: 800,
      timingFunction: 'ease',
    });
    //var animation = this.animation
    animation.opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  }

  //滑动渐入渐出
  function slideupshow(that,param,px,opacity){
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    
    animation.translateY(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  }

  //向右滑动渐入渐出
  function sliderightshow(that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateX(px).rotate(Math.random() * 720 - 360).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  }

  function test(){
    console.log("aaaaaaaaaaaaaaaaa")
  }

  module.exports={
    show:show,
    slideupshow:slideupshow,
    sliderightshow:sliderightshow,
    test:test

  }