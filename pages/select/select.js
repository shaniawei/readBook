Page({

  /**
   * 页面的初始数据
   */
  data: {
    mcq:[],   //多选
    sc:[],    //单选
    totlaScore:0,
    noOrYes: false
  },
  applyBtn:function(){
    var _this=this;
    var mcq = this.data.mcq;
    var arr=this.data.sc.concat(mcq);
    _this.data.totlaScore=0;
    for(var i=0;i<arr.length;i++){
      if (arr[i].beenselected == arr[i].current){
        _this.data.totlaScore += arr[i].score
        console.log(_this.data.totlaScore)
      }
    }
    _this.data.totlaScore = _this.data.totlaScore.toString()
    wx.showModal({
      title: '您的总分数是',
      content: _this.data.totlaScore,
      showCancel:false
    })
  },
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var richTextID = options.richTextID  //章节id
    var that = this;                     //获取page实例
    // 实例化查询对象
    var query = new wx.BaaS.Query()
    //查询条件
    query.contains('richTextID', richTextID)

    var tableID = 4059
    var Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(query).find().then((res) => {
      //success
      console.log(res.data.objects)

      var path = res.data.objects[0].path.cdn_path;  //文件路径
      wx.request({
        url: 'https://cloud-minapp-8044.cloud.ifanrusercontent.com/'+path, 
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)

          that.setData({
            mcq:res.data.mcq,
            sc:res.data.sc,
            noOrYes:true
          })
          console.log(that.data.mcq)
          console.log(that.data.sc)
        }
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