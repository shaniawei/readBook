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
    showCatalog:false,
    date: new Date().getFullYear() + '-' + parseInt(new Date().getMonth() + 1) + '-' + new Date().getDate()
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
    this.findIn(3974, CategoryID, isToday)
  },
  //查询阅读的是第几章 
  findIn: function (tableID, CategoryID, isToday){
    var that=this;
    // 实例化查询对象
    var query = new wx.BaaS.Query()
    //查询条件
    query.contains('CategoryID', CategoryID)
    var Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(query).find().then((res) => {
      //success
      that.setData({
        bookName: res.data.objects[0].bookName
      })
      if (isToday=='true'){  //阅读入口 是 今日阅读
        if (res.data.objects[0].today_index == undefined) {  //没看过这本书
          console.log('没有阅读过 --今日阅读')
        } else {
          var index = res.data.objects[0].today_index   //看过 获取上一次离开的章节 索引  直接显示上次最后阅读的章节
          that.setData({
            index: index
          })
        }
        that.setData({   //判断这本书籍有没有选择题
          showSelect: res.data.objects[0].hasSelect
        })
      }else{
        if (res.data.objects[0].other_index == undefined) {  //没看过这本书
          console.log('没有阅读过 --图书馆')
        } else {
          var index = res.data.objects[0].other_index   //看过 获取上一次离开的章节 索引  直接显示上次最后阅读的章节
          that.setData({
            index: index
          })
        }
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
    var that=this;
    if (this.data.showSelect==false){  //如果没有选择题 离开该页面时记录阅读位置
      var index = this.data.detail.index - 1  //哪一页
      console.log(index)
      var CategoryID = this.data.CategoryID //哪本书
      var isToday = this.data.isToday
      this.findOut(3974, CategoryID, index, isToday)

      //将章节数据存入数据表 start
      let ProductFall = new wx.BaaS.TableObject(22303)
      // 实例化查询对象
      let queryFall = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      queryFall.contains('chapterName', that.data.detail.title)
      ProductFall.setQuery(queryFall).find().then((res) => {
        // success
        console.log(res)
        if (res.data.objects.length == 0) {  //没有数据时存入
          let product = ProductFall.create()

          // 设置方式一
          let dataFall = {
            date: that.data.date,
            bookName: that.data.bookName,
            chapterName: that.data.detail.title,
            index: that.data.detail.index-1
          }
          product.set(dataFall).save().then((res) => {
            // success
            console.log(666)
            console.log(res)
          }, (err) => {
            // err
          })
        } 
      }, (err) => {
        // err
      })
      //将章节数据存入数据表 end

    }
    
  },
  //页面离开
  findOut: function (tableID, CategoryID, index, isToday){
    var that=this;
    let Product = new wx.BaaS.TableObject(tableID)
    // 实例化查询对象
    var query = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query.contains('CategoryID', CategoryID)
    Product.setQuery(query).find().then((res) => {
        // success
      let product = Product.getWithoutData(res.data.objects[0].id)
      if (isToday=='true'){
        product.set('today_index', index)
        product.update().then((res) => {
          // success
          console.log(res)
          product.set('chapterName', that.data.detail.title)
          product.update().then((res) => {
            // success
            console.log(res)
          }, (err) => {
            // err
          })
        }, (err) => {
          // err
        })
      }else{
        product.set('other_index', index)
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