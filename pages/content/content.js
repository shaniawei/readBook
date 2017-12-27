const wxParser = require('../../wxParser/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CategoryID:'',
    chapterList:[],
    detail:{},
    noOrYes:false,
    index:0,
    showSelect:false,
    showCatalog:false
  },
  //显示目录结构
  showCatalog:function(){
    this.setData({
      showCatalog:true
    })
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  //显示对应的章节内容
  showContent:function(e){
    var index=e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    this.getDetail(id,index);
    this.setData({
      showCatalog:false
    })
  },
  //获取CategoryID类里的内容列表
  getChapter: function (id) {
    var that = this;
    let categoryID = id;
    let objects = { categoryID };
    wx.BaaS.getContentList(objects).then((res) => {
      // success
      that.setData({
        chapterList: res.data.objects
      });
      that.getDetail(that.data.chapterList[that.data.index].id, that.data.index)
    }, (err) => {
      // err
    });
  },
  //获取内容详情
  getDetail:function(id,index){
    var that=this;
    let richTextID = id;
    let objects = { richTextID };
    wx.BaaS.getContent(objects).then((res) => {
      // success
      console.log(res.data)
      that.setData({
        detail:{
          title:res.data.title,
          content:res.data.content,
          index:index+1,
          richTextID: richTextID
        }
      })
      //渲染富文本
      wxParser.parse({
        bind: 'richText',
        html: that.data.detail.content,
        target: that
      });
      //文本显示
      that.setData({
        noOrYes: true
      })
    }, (err) => {
      // err
    });
  },
  //获取上一章下一章
  getonechapter:function(e){
    var flag = e.currentTarget.dataset.flag;       //获取上一章还是下一章的标志
    var nowIndex = e.currentTarget.dataset.index;  //现在看的是第几章
    var newIndex
    if (flag=='1'){  //下一章
      newIndex = nowIndex + 1;
      if (newIndex >= this.data.chapterList.length) {
        wx.showToast({
          title: '没有下一章',
          icon: '',
          duration: 2000
        })
        return
      }
    } else if (flag=='-1'){  //上一章
      newIndex = nowIndex - 1;
      if (newIndex < 0) {
        wx.showToast({
          title: '没有上一章',
          icon: '',
          duration: 2000
        })
        return
      }
    }
    var newRichTextID = this.data.chapterList[newIndex].id;
    this.getDetail(newRichTextID, newIndex);
    wx.pageScrollTo({
      scrollTop: 0,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var CategoryID = options.CategoryID;
    var showSelect = options.showSelect.indexOf('false')>-1?false:true  //是否显示选择题跳转按钮标记
    var isToday = options.isToday //判断阅读入口是不是 今日阅读
    this.setData({
      CategoryID: CategoryID,
      showSelect: showSelect,
      isToday
    })
    this.findIn(4080, CategoryID, isToday)
  },
  //查询阅读的是第几章 
  findIn: function (tableID, CategoryID, isToday){
    var that=this;
    // 实例化查询对象
    var query1 = new wx.BaaS.Query()
    var query2 = new wx.BaaS.Query()
    //查询条件
    query1.contains('CategoryID', CategoryID)
    query2.contains('isToday', isToday)
    // and 查询
    var andQuery = wx.BaaS.Query.and(query1, query2)

    var Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(andQuery).find().then((res) => {
      //success
      console.log(res.data.objects)
      if (res.data.objects.length == 0) {  //没看过这本书

      } else {
        var index = parseInt(res.data.objects[0].index)   //看过 获取上一次离开的章节 索引  直接显示上次最后阅读的章节
        that.setData({
          index: index
        })
      }
      that.getChapter(that.data.CategoryID)
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
  onUnload: function () {   //离开的时候看的是哪本书哪一章 记录下来
    var index=this.data.detail.index-1  //哪一页
    console.log(index)
    var CategoryID = this.data.CategoryID //哪本书
    var isToday = this.data.isToday
    this.findOut(4080, CategoryID, index, isToday)

  },
  //页面离开
  findOut: function (tableID, CategoryID, index, isToday){
    //首先查询这个CategoryID是否在数据表里有记录 如果有的话直接更新index数据
    let Product = new wx.BaaS.TableObject(tableID)
    // 实例化查询对象
    var query1 = new wx.BaaS.Query()
    var query2 = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query1.contains('CategoryID', CategoryID)
    query2.contains('isToday', isToday)
    // and 查询
    var andQuery = wx.BaaS.Query.and(query1, query2)

    Product.setQuery(andQuery).find().then((res) => {
      // success
      if (res.data.objects.length == 0) {  //数据表里没有CategoryID这条数据 需要新增一条
        let product = Product.create()
        let history = {
          index: index.toString(),
          CategoryID: CategoryID,
          isToday: isToday
        }
        product.set(history).save().then((res) => {
          // success
          console.log(res)
        }, (err) => {
          // err
        })
      } else {   //数据表里有CategoryID这条数据 需要更新
        let product = Product.getWithoutData(res.data.objects[0].id)
        product.set('index', index.toString())
        product.update().then((res) => {
          // success
          console.log(res)
        }, (err) => {
          // err
        })
      }

    }, (err) => {
      // err
    })
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