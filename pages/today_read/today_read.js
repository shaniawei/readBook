var app=getApp()  //小程序实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataLoadFinish:false
  },
  //查询成功后的数据处理函数
  handleData:function(data){
    this.setData({
      booklist: data,
      dataLoadFinish: true
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      booklist:[]
    })
    //获取3本书计划 或者 自助计划 里的书籍列表
    app.findData(3974, undefined, undefined, this.handleData, undefined, undefined, true, 
    [{ 'givenBook': 'true' }, { 'userDefined': 'true' }], false)
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
    this.onLoad()
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