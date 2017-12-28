Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleindex:1,
    booklist:[]
  },
  //选择历史纪录 收藏
  selectTitle:function(e){
    this.setData({
      titleindex: e.currentTarget.dataset.titleindex
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let tableID = 3974
    var Product = new wx.BaaS.TableObject(tableID)
    // 实例化查询对象
    var query = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query.isNotNull('other_index')
    Product.setQuery(query).find().then((res) => {
        // success
      that.setData({
        booklist: res.data.objects
      })
    }, (err) => {
        // err
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
    this.onLoad() //刷新下页面
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