var app=getApp(); //小程序实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    count:3,  //初次加载时显示3本书
    typeCount:2 //书籍分类的代表数字 这里指的是最大的代表数字
  },
  //加入自助计划
  addDefined: function (e) {
    var CategoryID = e.currentTarget.dataset.id;
    console.log(CategoryID)
    //先查询被选中的书籍是否已经被加入自助计划
    app.findData(3974, 'CategoryID', CategoryID, this.updateDefined)
  },
  //更新加入/不加入自助计划的数据
  updateDefined: function (data, none, Product){
    var that=this;
    if (data[0].userDefined == 'true') { //已被加入自助计划
      wx.showModal({
        title: '从自助计划移除',
        content: '移除后将不显示在今日阅读内',
        success: function (result) {
          if (result.confirm == true) {
            //确认移除
            app.updateData(data, Product, [{ 'userDefined': 'false' }], that.getBookList)
          }
        }
      })
    } else if (data[0].userDefined == 'false' && data[0].givenBook == 'false') { //未加入自助计划且不属于三本书计划
      wx.showModal({
        title: '加入自助计划',
        content: '点击收藏，即可加入自助计划，显示在今日阅读中',
        success: function (result) {
          if (result.confirm == true) {
            // 确认加入
            app.updateData(data, Product, [{ 'userDefined': 'true' }], that.getBookList)
          }
        }
      })
    } else if (data[0].userDefined == 'false' && data[0].givenBook == 'true') {  //未加入自助计划且属于三本书计划  此处暂时保留
      wx.showModal({
        title: '加入自助计划',
        content: '无法加入自助计划，此书已在每月3本书计划中',
        showCancel: false
      })
    }
  },
  //显示全部
  showAll: function (e) {
    var type = e.currentTarget.dataset.type;
    var listName = 'booklist' + type;
    var dataArr = this.data[listName];  //拿到对于的书籍数据组
    if (dataArr[1] == dataArr.pop()){ //已显示全部 现在要收起
      dataArr.push(this.data.count)  //更新数组最后一个元素
    }else{  //显示全部
      dataArr.push(dataArr[1])  //更新数组最后一个元素
    }
    this.setData({
      [listName]: dataArr
    })
    console.log(this.data.count)
  },
  // 获取书籍列表
  getBookList:function(){
    var that=this
    for (var i = 1; i <= this.data.typeCount;i++){  //i值指 数据表里的type值 
      //查询数据表的数据
      app.findData(3974, 'type', i.toString(), function (data, conditionCon) {
        var listName = 'booklist' + conditionCon;
        that.setData({
          [listName]: [data, data.length, true, that.data.count]  //第一个元素指书籍列表 第二个元素指这类书籍的总数量 //第三个元素决定是否可以显示这类书籍,第四个元素是指 这类书籍应该显示几本书 默认每类显示指定的3本书
        })
        wx.hideLoading()
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // 微信用户登录小程序
    wx.BaaS.login().then((res) => {
      // 用户允许授权，res 包含用户完整信息
      console.log(res)
      wx.showLoading({
        title: '加载中',
      })
      that.getBookList();

    }, (res) => {
      // 用户拒绝授权
      console.log(res)
    })
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
    // this.getBookList()
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
    this.getBookList()
    wx.stopPullDownRefresh()
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