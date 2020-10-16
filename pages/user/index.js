// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    address: { left: "收货地址管理" },
    contact: { left: "联系客服", right: "400-618-4000"},
    advice: { left: "意见反馈", url: "/pages/feedback/index" },
    about: { left: "关于我们" },
    recommend: { left: "把应用推荐给其他人"}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userinfo = wx.getStorageSync("userinfo");
    this.setData({
      userinfo
    })
  }
})