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
    let tableID = 4080
    var Product = new wx.BaaS.TableObject(tableID)
    Product.find().then((res) => {  //首先查询打开过的书籍有哪些
      //success
      var list = res.data.objects;
      var IDlist=[]
      for(var i=0;i<list.length;i++){
        IDlist.push(list[i].CategoryID)
      }
      // 实例化查询对象
      var query = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query.in('CategoryID', IDlist)
      // 应用查询对象
      var ProductID = new wx.BaaS.TableObject(3974)  //根据打开过的书籍id找到对应的书籍信息数据
      ProductID.setQuery(query).find().then((res) => {
        // success
        that.setData({
          booklist:res.data.objects
        })
      }, (err) => {
        // err
      })

      }, (res) => {
        //error
      }
    )
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