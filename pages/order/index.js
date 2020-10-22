import { request } from "../../request/index.js";
/**
 * 1 页面被打开的时候获取被点击的type值 onShow()
 *    0 onShow 不同于onLoad 无法直接获取options参数
 *    1 获取url上的参数type
 *    2 根据参数去请求数据
 *    3 渲染页面
 * 2 点击不同的标题发送不同的参数请求数据
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        title: '全部订单',
        isActive: false
      },
      {
        id: 1,
        title: '待付款',
        isActive: false
      },
      {
        id: 2,
        title: '待收货',
        isActive: false
      },
      {
        id: 3,
        title: '退款/退货',
        isActive: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 首先要判断是否有token值
    // const token = wx.getStorageSync("token");
    // if(!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   });
    //   return;
    // }
    // 1 获取url上的参数type
    const pages = getCurrentPages();
    let currentPages = pages[pages.length - 1];
    const { type } = currentPages.options;
    this.changeTitleByIndex(type - 1)
    this.getOrders(type)
  },

  handleItemChange(e) {
    const { index } = e.detail;
    this.changeTitleByIndex(index);

    this.getOrders(index + 1)
  },

  // 获取订单列表
  async getOrders(type) {
    const res = await request({url: '/my/orders/all', data: { type: type }});
    this.setData({
      orders: res.orders.map((v) => ({
        ...v,     //对对象进行展开后并对其原样进行返回
        creat_time_cn: (new Date(v.create_time*1000).toLocaleString())    //增加一个新的属性
      }))
    })
  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(type) {
    let { tabs } = this.data;
    tabs.forEach((item, index) => {
      return index === type ? item.isActive = true : item.isActive = false;
    })

    this.setData({
      tabs
    })
  }

})