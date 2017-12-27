var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0
  },
  //获取3本书计划 或者 自助计划 里的书籍列表
  getbookList:function(){
    var that = this;
    let tableID = 3974
    var Product = new wx.BaaS.TableObject(tableID)

    // 实例化查询对象
    var query1 = new wx.BaaS.Query()  //3本书计划的
    // 设置查询条件（比较、字符串包含、组合等）
    query1.contains('givenBook', 'true')

    var query2 = new wx.BaaS.Query()   //加入自助计划的
    // 设置查询条件（比较、字符串包含、组合等）
    query2.contains('userDefined', 'true')

    // or 查询
    var orQuery = wx.BaaS.Query.or(query1, query2)
    
    Product.setQuery(orQuery).find().then((res) => {
      // success
      console.log(res.data.objects)
      that.setData({
        booklist: res.data.objects,
        dataLoadFinish: true
      })
    }, (err) => {
      // err
    })
  },
  //获取今日阅读书籍的阅读位置
  getHistoryPlace:function(){
    var Product = new wx.BaaS.TableObject(4080)
    // 实例化查询对象
    var query = new wx.BaaS.Query()  //3本书计划的
    // 设置查询条件（比较、字符串包含、组合等）
    query.contains('isToday', 'true')
    Product.setQuery(query).find().then((res) => {
      // success
      console.log(res.data.objects)
      that.setData({
        historyPlace: res.data.objects
      })
    }, (err) => {
      // err
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbookList()
    this.getHistoryPlace();
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