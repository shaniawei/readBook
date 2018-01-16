Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataLoadFinish:false,
    count:3  //初次加载时每一类别显示几本书
  },
  //加入自助计划
  addDefined:function(e){
    var that=this;
    var CategoryID=e.currentTarget.dataset.id;
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

      if (res.data.objects[0].userDefined=='true'){ //已被加入自助计划
        wx.showModal({
          title: '从自助计划移除',
          content: '移除后将不显示在今日阅读内',
          success:function(data){
            if(data.confirm==true){
              //确认移除
              
              product.set('userDefined', 'false')
              product.update().then((res) => {
                // success
                console.log(res)
                that.onLoad()
              }, (err) => {
                // err
              })

            }
          }
        })
      } else if (res.data.objects[0].userDefined == 'false' && res.data.objects[0].givenBook == 'false'){ //未加入自助计划且不属于三本书计划
        wx.showModal({
          title: '加入自助计划',
          content: '点击收藏，即可加入自助计划，显示在今日阅读中',
          success: function (data) {
            if (data.confirm == true) {
                // 确认加入
                product.set('userDefined', 'true')
                product.update().then((res) => {
                  // success
                  console.log(res)
                  that.onLoad()
                }, (err) => {
                  // err
                })

            }
          }
        })
      } else if (res.data.objects[0].userDefined == 'false' && res.data.objects[0].givenBook == 'true') {  //未加入自助计划且属于三本书计划
        wx.showModal({
          title: '加入自助计划',
          content: '无法加入自助计划，此书已在每月3本书计划中',
          showCancel:false
        })
      }
    }, (err) => {
      // err
    })


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
        console.log(res.userInfo)
        
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
    this.getBookList();
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