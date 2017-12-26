Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataLoadFinish:false,
    count:3,  //初次加载时每一类别显示几本书
  },
  showAll: function (e) {
    var type = e.currentTarget.dataset.type;
    var that = this;
    var tableID = 3974
    var Product = new wx.BaaS.TableObject(tableID)
    // 实例化查询对象
    var query = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query.contains('type', type)
    Product.setQuery(query).find().then((res) => {
      // success
      console.log(res.data.objects)
      var listName = 'booklist' + type;
      that.setData({
        [listName]: res.data.objects
      })
    }, (err) => {
      // err
    })
  },
  // 获取书籍列表
  getBookList:function(){
    var that=this;
    var count = that.data.count;  //初次加载时每一类别显示几本书
    let tableID = 3974
    var Product = new wx.BaaS.TableObject(tableID)
    for(var i=1;i<=2;i++){  //i值指 数据表里的type值
      let index=i;  //临时保存type值
      // 实例化查询对象
      var query = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query.contains('type', i.toString())
      Product.setQuery(query).limit(count).find().then((res) => {
        // success
        console.log(res.data.objects)
        console.log(index)
        var listName = 'booklist'+index;
        that.setData({
          [listName]: res.data.objects,
          dataLoadFinish: true
        })
      }, (err) => {
        // err
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getUserInfo({
      success: function (res) {
        that.getBookList();
      }
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