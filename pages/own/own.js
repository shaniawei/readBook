// clock.js
'use strict';
var app = getApp();  //小程序实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasEmptyGrid: false,  //是否显示空白区域
    startDate:'2000-01-01',
    endDate:'2020-01-01',
    nowYear: new Date().getFullYear(),
    nowMonth: new Date().getMonth(),
    nowday:new Date().getDate()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //跳转至阅读历史流水中
  viewHistoryFall:function(e){
    var that=this;
    var date = parseInt(e.currentTarget.dataset.idx)+1;  //被选中的是哪一天
    var nowTime = new Date(that.data.nowYear, that.data.nowMonth, that.data.nowday).getTime();
    var selectedTime = new Date(that.data.cur_year, that.data.cur_month-1, date).getTime();
    if (nowTime > selectedTime || (that.data.nowYear == that.data.cur_year && that.data.nowMonth == that.data.cur_month - 1 && that.data.nowday==date)){  //选择的是相对于当天过去的时间,包括当天
      wx.navigateTo({
        url: '../read_history/read_history?date=' + that.data.cur_year + '-' + that.data.cur_month + '-' + date,
      })
    }
  },
  onLoad: function () {
    const date = new Date(); 
    const cur_year = date.getFullYear();  //当前的年份
    const cur_month = date.getMonth() + 1; //当前的月份
    const weeks_ch = ['一', '二', '三', '四', '五', '六', '日'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    });
    this.tapDayItem();
  },
  //日期高亮显示
  tapDayItem() {
    if (this.data.cur_year == new Date().getFullYear() && this.data.cur_month == new Date().getMonth()+1){
      console.log(222)
      const idx = new Date().getDate() - 1;   //当天是几号 在此基础上减1
      const days = this.data.days;            //当月多少天
      days[idx].choosed = !days[idx].choosed;
      this.setData({
        days,
      });
    }    
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate(); //这里的month是当前准确的month 返回当前的天数
  },
  getFirstDayOfWeek(year, month) {
    return new Date(year, month-1, 1).getDay();  //返回某年某月第一天是星期几  返回的是数字 比如5代表星期五  这里的month需要减1才可以获得当月第一天准确的星期
  },
  //计算某月的第一天是星期几 比如是 星期六 那么这一行就要从周六开始 前面都是要留白
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month) == 0 ? 7 : this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek!==1&&firstDayOfWeek >0) {
      for (let i = 0; i < firstDayOfWeek-1; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  //计算一个月有多少天
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);  

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false
      });
    }
    this.setData({
      days
    });
    
  },
  //上一个月 下一个月
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle == 'prev') {  //往右 上个月
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
      this.tapDayItem();

    } else {  //往左  下个月
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
      this.tapDayItem();
    }
  },
  //选择年月
  bindDateChange: function (e) {
    var new_year = parseInt(e.detail.value.slice(0, 4));
    var new_month = parseInt(e.detail.value.slice(5))
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.calculateDays(new_year, new_month);
    this.calculateEmptyGrids(new_year, new_month);
    this.setData({
      cur_year: new_year,
      cur_month: new_month
    })
    this.tapDayItem();
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