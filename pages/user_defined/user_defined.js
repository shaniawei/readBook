// pages/user_defined/user_defined.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  //加入自助计划
  removeDefined: function (e) {
    var that = this;
    var CategoryID = e.currentTarget.dataset.id;
    console.log(CategoryID)
    //先查询被选中的书籍是否已经被加入自助计划
    let Product = new wx.BaaS.TableObject(3974)
    // 实例化查询对象
    var query = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query.contains('CategoryID', CategoryID)
    Product.setQuery(query).find().then((res) => {
      // success
      console.log(res)
      let product = Product.getWithoutData(res.data.objects[0].id)
      wx.showModal({
        title: '从自助计划移除',
        content: '移除后将不显示在今日阅读内',
        success: function (data) {
          if (data.confirm == true) {
            //确认移除
            product.set('userDefined', 'false')
            product.update().then((res) => {
              // success
              console.log(res)
              that.getBookList()
            }, (err) => {
              // err
            })

          }
        }
      })
    }, (err) => {
      // err
    })


  },
  // 获取书籍列表
  getBookList: function () {
    var that = this;
    var totalCount=2; //书籍类别的数量
    var count=0;      //加入自助计划的书籍可分为几个类别
    var tableID = 3974
    var Product = new wx.BaaS.TableObject(tableID)
    for (var i = 1; i <= totalCount; i++) {  //i值指 数据表里的type值
      let index = i;  //临时保存type值
      var listName = 'booklist' + index;
      that.setData({
        [listName]:false
      })
      // 实例化查询对象
      var query1 = new wx.BaaS.Query()
      var query2 = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query1.contains('type', i.toString())
      query2.contains('userDefined', 'true')  //查询某一类别下 被加入自助计划的书籍
      // and 查询
      var andQuery = wx.BaaS.Query.and(query1, query2) 
      Product.setQuery(andQuery).find().then((res) => {   //回调
        // success
        console.log(index)
        console.log(res.data.objects)     
        if (res.data.objects.length !== 0) {
          var listName = 'booklist' + index;
          that.setData({
            hasDefined: false,
            [listName]: res.data.objects
          })
        } else if (res.data.objects.length==0){
          count++;
          if (count == totalCount){
            that.setData({
              hasDefined: true
            })
          }
        }
        wx.hideLoading()
      }, (err) => {
        // err
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getBookList();
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