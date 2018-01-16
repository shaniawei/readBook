//app.js
App({
  onLaunch: function () {
    //引入SDK
    require('./sdk-v1.1.1.js')
    // 初始化 SDK
    let clientID = '07109ed66fb97d68e879'
    wx.BaaS.init(clientID)
  },
  //根据条件查询
  findData: function (tableID, condition, conditionCon,cb,cbType,dataGroup) {  
    //tableID指被查询数据表的ID，condition指条件查询字段名，conditionCon指条件查询字段值，cb指查询成功后所做的处理,cbType判断cb是更新数据函数还是新增数据函数，dataGroup更新/新增数据值(类型为数组或者对象,若为数组则数组元素为对象，每一个对象代表一组需更新的数据键值对)

    // 应用查询对象
    var Product = new wx.BaaS.TableObject(tableID)
    // 实例化查询对象
    var query = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query.contains(condition, conditionCon)
    Product.setQuery(query).find().then((res) => {
      // success
      console.log(res.data.objects)
      if(cbType=='update'){
        cb && cb(res.data.objects, Product, dataGroup);
        return;
      }
      if (cbType=='add'){
        cb && cb(res.data.objects, Product, dataGroup);
        return
      }
      cb && cb(res.data.objects)
    }, (err) => {
      // err
    })
  },
  //更新数据
  updateData: function (data, ProductName, updateData){
    //ProductName指应用名，data指需要更新的数据，updataField指更新数据组  最多更新两组数据
    var that=this;
    var product = ProductName.getWithoutData(data[0].id)
    var firstKey = Object.keys(updateData[0])[0]  //第一个对象的键
    product.set(firstKey, updateData[0][firstKey])
    product.update().then((res) => {
      // success
      console.log(res)
      if (updateData.length>1){
        var secondKey = Object.keys(updateData[1])[0]  //第二个对象的键
        product.set(secondKey, updateData[1][secondKey])
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
  //新增数据
  addData: function (data, ProductName,addData){
    if (data.length == 0) {  //没有数据时存入
      var product = ProductName.create()
      product.set(addData).save().then((res) => {
        // success
        console.log(res)
      }, (err) => {
        // err
      })
    }else{ //如果有数据存入，用户重做了一边 满足 40分 以上 与之前的分值不一样 或高或低 是否需要更新数据表

    }
  },

})