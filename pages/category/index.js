// pages/category/index.js
import { request } from "../../request/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧列表数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧滚动条重新设置为0
    scrollTop: 0

  },

  // 接口返回的数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * web与小程序中本地存储的区别
     * 1.代码方式不同
     * web: localStorage.getItem("key", "value")  localStorage.getItem("key")
     * 小程序中：wx.setStorageSync("key", "value") wx.getStorageSync("key")
     * 2.存储时的类型转换
     * web中存入数据时回进行toString（）进行类型转换
     * 小程序中不存在转换
     * 1.先判断本地存储是否有旧数据
     * 2.有就用，没有请求
     */
    // 1.获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    if(!Cates) {
      this.getCates();
    } else {
      // 是否有旧数据
      if(Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        this.Cates = Cates.data;
        // 构造左侧的菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  async getCates() {
    const result = await request({ url: '/categories' });
    this.Cates = result.data.message;
    // 把数据存入本地存储中
    wx.setStorageSync("cates", {time: Date.now(), data: this.Cates});
    // 构造左侧的菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 左侧菜单点击事件
  handleItemTap(e) {
    /**
     * 1.获取被点击标题身上的索引
     * 2.给data中的currentIndex赋值
     * 3.根据不同的索引渲染右侧的内容
     */
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})