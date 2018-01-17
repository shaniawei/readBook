var app=getApp(); //获取小程序实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totlaScore:0,
    dataLoadFinish: false,
    date: new Date().getFullYear() + '-' + parseInt(new Date().getMonth() + 1) +'-'+new Date().getDate() //将做题时间保存在数据表
  },
  //提交
  applyBtn:function(){
    var that=this;
    var arr = that.data.sc.concat(that.data.mcq); //将单选题数组 多选题数组合并
    that.data.totlaScore=0;                       //初始化得分总分数
    for(var i=0;i<arr.length;i++){
      if (arr[i].beenselected == arr[i].current){
        that.data.totlaScore += arr[i].score
        console.log(that.data.totlaScore)
      }
    }
    if (that.data.totlaScore >= 40) {  //分数超过40分
      //查询book数据表，更新today_index和chapterName字段
      app.findData(3974, 'CategoryID', that.data.CategoryID, app.updateData, 'update', 
      [{ 'today_index': Number(that.data.index) }, { 'chapterName': that.data.chapterName}])

      //查询history_fall表，将章节数据存入数据表
      app.findData(22303, 'chapterName', that.data.chapterName, app.addData, 'add', {
        date: that.data.date,
        bookName: that.data.bookName,
        chapterName: that.data.chapterName,
        index: that.data.index
      })

      that.data.totlaScore = that.data.totlaScore.toString();  //将最后得分值转化为字符串
      wx.showModal({
        title: '您的总分数是',
        content: that.data.totlaScore,
        showCancel: false,
        success: function (data) {  //点击确定
          if (data.confirm == true) {
            wx.navigateBack({   //返回上一页
              delta: 1
            })
          }
        }
      })

    }else{  //分数低于40分
      that.data.totlaScore = that.data.totlaScore.toString();
      wx.showModal({
        title: '您的总分数是',
        content: that.data.totlaScore,
        confirmText:'重做？',
        success: function (data){
          console.log(confirm)
          if (data.confirm==true){ //点击重做

          } else if (data.cancel==true){  //点击取消
            wx.navigateBack({   //返回上一页
              delta: 1
            })
          }
        }
      })
    }
    
  },
  //单选处理函数
  radioChange: function (e) {
    var _this = this; //获得page实例
    var id = e.target.id; //获得发生事件的对象
    var len = _this.data.sc.length //获得单选的题量
    for (var i = 0; i < len; i++) {
      if (_this.data.sc[i].id == id) { //找到对应的题目
        _this.data.sc[i].beenselected = e.detail.value; 
      }
    }
    
  },
  //多选处理函数
  checkboxChange:function(e){
    var _this = this;
    var id = e.target.id;
    var len = _this.data.mcq.length
    for (var i = 0; i < len; i++) {
      if (_this.data.mcq[i].id == id) {
        _this.data.mcq[i].beenselected = e.detail.value.sort().join('').toString()
        console.log(_this.data.mcq[i].beenselected)
      }
    }
  },
  //查询成功后进行的显示数据处理
  showSelectData:function(data){
    var that=this;
    var path = data[0].path.cdn_path;  //文件路径
    wx.request({
      url: 'https://cloud-minapp-8044.cloud.ifanrusercontent.com/' + path,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          mcq: res.data.mcq, //多选
          sc: res.data.sc,   //单选
          dataLoadFinish: true      //条件渲染
        })
        wx.hideLoading()
        console.log(that.data.mcq)
        console.log(that.data.sc)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var richTextID = options.richTextID  //章节id
    this.setData({
      richTextID: options.richTextID,
      CategoryID: options.CategoryID,
      index: Number(options.index),
      chapterName: options.chapterName,
      bookName: options.bookName
    }) 
    //查询对应章节的选择题数据
    app.findData(4059, 'richTextID', richTextID, this.showSelectData)
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