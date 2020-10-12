//Page Object
import { request } from "../../request/index"
Page({
  data: {
    swiperList: [],
    catesList: [],
    floorList: []
  },
  //options(Object)
  onLoad: function(options){
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  
  // 获取轮播图数据
  async getSwiperList() {
    const result = await request({ url: "/home/swiperdata"});
    this.setData({
      swiperList: result.data.message
    })
  },

  // 获取导航数据
  async getCateList() {
    const result = await request({ url: "/home/catitems" });
    this.setData({
      catesList: result.data.message
    })
  },

  // 获取楼层数据
  async getFloorList() {
    const result = await request({ url: "/home/floordata" });
    this.setData({
      floorList: result.data.message
    })
  }
});