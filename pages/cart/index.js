import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx"
// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    // 购物车中的信息
    cart: [],
    // 全选按钮状态
    allChecked: false,
    // 总价格
    totalPrice: 0,
    // 总数量
    totalNum: 0
  },

  onShow() {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 获取购物车信息
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      address
    })
    this.setCart(cart);
  },

  // 点击收货地址触发
  async handleChooseAddress() {
    try {
      const res = await getSetting();
      const scopeAdderss = res.authSetting['scope.address'];
      // 判读权限的状态
      if (scopeAdderss === false) {
        // 没有获取权限时，打开重新申请获取权限页面
        await openSetting();
      }
      // 获取收获地址
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 将获得的地址存储至缓存中
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);       //由于在openSetting的reject方法中没有对执行错误的代码进行操作，代码会产生错误，由此用try--catch方法来进行简单处理
    }
  },

  // 选中点击事件
  handleItemChange(e) {
    // 获取当前选中的货物的id
    const { id } = e.currentTarget.dataset;
    // 购物车中的数组
    let { cart } = this.data;
    // 找到该数据并对其进行取反的操作
    let index = cart.findIndex(v => v.goods_id === id);
    cart[index].checked = !cart[index].checked;
    // 重新计算价格 数量 是否全选 数据
    this.setCart(cart);
  },

  /**
   * 计算底部工具栏数据
   * @param {Array} cart 购物车数组
   */
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    // 价格 数量 是否全选
    cart.forEach(v => {
      if(v.checked) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      }else{
        allChecked = false;
      }
    });
    // 判断数组是否为空 因为如果数组为空的话不会执行forEach
    allChecked = cart.length !== 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart);
  },
  
  // 全选反选事件
  handleAllChange() {
    // 获取data中的数据
    let { cart, allChecked } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 修改数据中的选中状态
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },

  // 商品数量加减
  async handleItemNumEdit(e) {
    const { id,  operation } = e.currentTarget.dataset;
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 当商品数量为1时再减少则提示是否删除
    if(cart[index].num === 1 && operation === -1) {
      const result = await showModal({ content: '是否要删除此商品？' });
      if(result.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 否则数量更改
      cart[index].num += operation;
      this.setCart(cart);
    }
  },

  // 结算功能的实现
  async handlePay() {
    // 判断用户有没有选中收货地址
    const { address, totalNum } = this.data;
    if(!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 判断用户有没有选中商品
    if(totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }

    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})