/**
 * 1.点击添加购物车后的执行过程
 * a.先绑定点击事件
 * b.获取缓存中的购物车数据  数组格式
 * c.先判断当前商品是否存在于购物车
 * d.已经存在  修改商品的数据 执行购物城数量++ 重新把购物车数组填充回缓存中
 * e.不存在 直接给购物车数组添加一个新元素 带上购买的数量属性num
 * f.弹出适当的提示
 */
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    // 商品是否被收藏过
    isCollect: false
  },

  // 商品详情数据
  GoodsDetail: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages =  getCurrentPages();
    let currentPages = pages[pages.length-1];
    const { goods_id } = currentPages.options;
    // console.log(goods_id)
    this.getGoodsDetail(goods_id)
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const result = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsDetail = result.data.message;
    // 获取缓存中的商品收藏的数据
    let collect = wx.getStorageSync("collect") || [];
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsDetail.goods_id);
    this.setData({
      goodsDetail: {
        pics            : result.data.message.pics,
        goods_price     : result.data.message.goods_price,
        goods_name      : result.data.message.goods_name,
        // 由于部分机型不支持webp图片格式 临时把 .webp 文件名改为 .jpg 做部分机型兼容处理
        goods_introduce : result.data.message.goods_introduce.replace(/\.webp/g, '.jpg')
      },
      isCollect
    })

    // console.log(this.data.goodsDetail.pics)
  },

  // 轮播图实现大图预览
  handlePrevewImage(e) {
    const urls = this.GoodsDetail.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  // 点击加入购物车
  handleCartAdd() {
    let cart = wx.getStorageSync("cart") || [];
    // 判断商品对象是否存入在购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsDetail.goods_id);
    if(index === -1) {
      // 不存在 第一次加入
      this.GoodsDetail.num = 1;
      this.GoodsDetail.checked = true;
      cart.push(this.GoodsDetail);
    } else {
      // 已存在 数量++
      cart[index].num ++;
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true  // 防止用户手抖 疯狂点击
    })
  },
  
  // 点击商品收藏
  handleCollect() {
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsDetail.goods_id);
    // 当 index!=-1 表示 已经收藏过
    if(index !== -1) {
      // 已经收藏，在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      // 没有收藏过
      collect.push(this.GoodsDetail);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 修改data
    this.setData({
      isCollect
    })
  }
})