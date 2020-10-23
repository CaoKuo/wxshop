import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    isFocus: false,     //控制按钮的显示与隐藏
    inputValue: ''      //输入框中的值
  },

  TimeId: -1,

  // 输入框的值发生改变时触发
  handleInput(e) {
    // 进行防抖操作 防止多次触发
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      // 1.获取输入框值
      const { value } = e.detail;
      console.log(value)
      if(!value.trim()) {
        this.setData({
          goods: [],
          isFocus: false
        })
        console.log(this.data.goods)
        // 值不合法 空值
        return;
      }

      this.setData({
        isFocus: true       //在输入框有值之后显示取消按钮
      })

      // 发送数据请求
      this.qsearch(value)
    }, 1000)

  },

  // 获取搜索数据
  async qsearch(query) {
    const { data: goods } = await request({ url: '/goods/qsearch', data: { query } });
    this.setData({
      goods
    })
  },

  // 取消按钮点击事件
  handleCancle() {
    this.setData({
      inputValue: '',
      goods: [],
      isFocus: false
    })
  }
})