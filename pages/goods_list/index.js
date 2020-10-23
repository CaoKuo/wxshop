import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        title: '综合',
        isActive: true
      },
      {
        id: 1,
        title: '销量',
        isActive: false
      },
      {
        id: 2,
        title: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },

  // 请求数据的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || '';
    this.QueryParams.query = options.query || '';
    console.log(this.QueryParams.query)
    this.getGoodsList();
  },

  async getGoodsList() {
    const result = await request({ url: "/goods/search", data: this.QueryParams})
    let { total } = result.data.message
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages)
    this.setData({
      goodsList: [...this.data.goodsList,...result.data.message.goods]
    })
  },

  // 标题点击事件 从子组件传递过来
  handleItemChange(e) {
    const { index } = e.detail;

    let { tabs } = this.data;       //此处相当于let tabs = this.data.tabs

    tabs.forEach((v, i) => {
      return i === index ? v.isActive = true : v.isActive = false;
    });

    this.setData({
      tabs
    })
  },

  /**
   * 1.找到滚动条触底事件
   * 2.判断还有没有下一页
   * 要获取总页数 = Math.ceil(总条数/页容量)
   * 3.没有下一页进行提示
   */

  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({ title: '没有下一页数据' });
    } else {
      this.QueryParams.pagenum ++;
      this.getGoodsList();
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.QueryParams.pagenum = 1;
    this.setData({
      goodsList: []
    });
    this.getGoodsList();
  }
})