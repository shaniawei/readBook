// pages/read_history/read_history.js
var app=getApp() //获取小程序实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataLoadFinish:false,
    currentType:'1' //判断选择的是那本书，加上active类
  },
  //显示书籍对应的章节
  showChapter:function(e){
    var chapterType=e.currentTarget.dataset.type;
    var bookname = e.currentTarget.dataset.bookname;
    this.setData({
      currentType: chapterType,
      currentBookName: bookname
    })
    console.log(chapterType,bookname)
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var date=options.date; //获取用户选择的时间
    console.log(date) 
    that.setData({
      date
    })
    app.findData(22303, 'date', date, function (data) {
      var bookNameList = []; //书籍名称列表
      if (data && data.length !== 0) {
        for (var i = 0; i < data.length; i++) {
          bookNameList.push(data[i].bookName);
        }
        bookNameList = Array.from(new Set(bookNameList)) //去重
        console.log(bookNameList)
        that.setData({
          historyFall: data,
          bookNameList: bookNameList,
          currentBookName: bookNameList[0],
          dataLoadFinish:true
        })
        wx.hideLoading()
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