/**
 * 1.页面加载的时候
 * 获取存储的购物车数据 checked=true
 * 2.微信支付
 *  1.哪些人、哪写账号可以实现微信支付
 *    1.企业账号
 *    2.appid可以绑定多个开发者账号，并有相同的权限
 * 3.支付按钮
 *  1.缓存中是否有token
 *  2.没有则调转至获取token的页面
 */
import { showToast, requestPayment } from "../../utils/asyncWx.js"
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取地址信息
    const addressInfo = wx.getStorageSync('address');
    // 获取购物车信息
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v => v.checked);
    // 重新计算价格 数量 是否全选 数据
    let totalPrice = 0;
    let totalNum = 0;
    // 价格 数量 
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    });
    // 至此在页面中显示的购物车数据仅是勾选过的数据
    this.setData({
      addressInfo,
      cart,
      totalPrice,
      totalNum
    })
  },

  // 点击支付
  async handleOrderPay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync('token');
      // 判断
      if(!token){
        // 没有token跳转至授权页面
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      // 创建订单 请求头
      // const header = { Authorization: token };
      // 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.addressInfo.all;
      let cart = this.data.cart;
      const goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods };
      // 发送请求 创建订单 获取订单编号
      const { order_number } = await request({url: "/my/orders/create", method: "POST", data: orderParams});
      // 发起 预支付接口
      const { pay } = await request({url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number }});
      // 发起微信支付
      await requestPayment(pay);
      // 查询后台 订单状态
      const res = await request({url: "/my/orders/chkOrder", method: "POST", data: { order_number }});
      await showToast({title: "支付成功"})
      // 支付成功 删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      // 支付成功 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      await showToast({title: "支付失败"})
      console.log(error);
    }
  }
})