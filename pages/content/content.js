const wxParser = require('../../wxParser/index');
var app=getApp() //小程序实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CategoryID:'',
    chapterList:[],
    detail:{},
    dataLoadFinish:false,
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
    var categoryID = id;
    var objects = { categoryID };
    wx.BaaS.getContentList(objects).then((res) => {
      // success
      that.setData({
        chapterList: res.data.objects  //每本书的章节列表
      });
      that.getDetail(that.data.chapterList[that.data.index].id, that.data.index)
    }, (err) => {
      // err
    });
  },
  //获取内容详情
  getDetail:function(id,index){
    var that=this;
    var richTextID = id; //章节id
    var objects = { richTextID }; 
    wx.BaaS.getContent(objects).then((res) => {
      // success
      console.log(res.data)
      that.setData({
        detail:{
          title:res.data.title,  //章节标题
          content:res.data.content, //章节内容 富文本
          index:index+1,  //章节索引
          richTextID: richTextID  //章节id
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
        dataLoadFinish: true
      })
      wx.hideLoading()
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
          image: '',
          duration: 2000
        })
        return
      }
    } else if (flag=='-1'){  //上一章
      newIndex = nowIndex - 1;
      if (newIndex < 0) {
        wx.showToast({
          title: '没有上一章',
          image: '',
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
    wx.showLoading({
      title: '加载中',
    })
    var CategoryID = options.CategoryID;  //书籍id
    var showSelect = options.showSelect.indexOf('false')>-1?false:true  //是否显示选择题跳转按钮标记
    var isToday = options.isToday //判断阅读入口是不是 今日阅读
    this.setData({
      CategoryID: CategoryID,
      showSelect: showSelect,
      isToday
    })
    //查询这本书籍的数据行 对应的today_index或者是other_index
    app.findData(3974, 'CategoryID', CategoryID, this.findIndex)
  },
  //查询成功后所做的数据处理 
  findIndex: function (data){
    var isToday = this.data.isToday;
    this.setData({
      bookName: data[0].bookName  //书籍名称
    })
    if (isToday=='true'){  //阅读入口 是 今日阅读
      if (data[0].today_index == undefined) {  //没看过这本书
        console.log('没有阅读过 --今日阅读')
      } else {
        var index = data[0].today_index   //看过 获取上一次离开的章节 索引  直接显示上次最后阅读的章节
        this.setData({
          index: index //重置索引
        })
      }
      this.setData({   //判断这本书籍有没有选择题
        showSelect: data[0].hasSelect
      })
    }else{
      if (data[0].other_index == undefined) {  //没看过这本书
        console.log('没有阅读过 --图书馆')
      } else {
        var index = data[0].other_index   //看过 获取上一次离开的章节 索引  直接显示上次最后阅读的章节
        this.setData({
          index: index  //重置索引
        })
      }
    }
    this.getChapter(this.data.CategoryID)
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
    var isToday = this.data.isToday
    var index = this.data.detail.index - 1  //正在阅读的章节索引
    console.log(index)
    var CategoryID = this.data.CategoryID //书籍id
    if (isToday=='true'){  //阅读入口是 今日阅读
      if (this.data.showSelect == false) {  //没有选择题的书籍离开记录
        console.log(7777)
        //将章节数据存入数据表
        app.findData(22303, 'chapterName', this.data.detail.title, app.addData, 'add', {
          date: this.data.date,
          bookName: this.data.bookName,
          chapterName: this.data.detail.title,
          index: this.data.detail.index - 1
        })
        //更新数据表里today_index和chapterName字段 保存阅读位置
        app.findData(3974, 'CategoryID', CategoryID, app.updateData, 'update',
          [{ 'today_index': index }, { 'chapterName': this.data.detail.title }])
      }  
      
    }else{ //阅读入口 书城
      //更新数据表里other_index字段 保存阅读位置
      app.findData(3974, 'CategoryID', CategoryID, app.updateData, 'update',
        [{ 'other_index': index}])
    }
   
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