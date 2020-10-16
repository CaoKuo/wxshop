// 同时发送异步请求代码的次数
let ajaxTimes = 0;
const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
export const request = (param) => {
    // 判断url中是否带有 /my/ 请求的是私有的路径 带上header token
    let header = {...param.header};
    if(param.url.includes('/my/')){
        // 拼接header 带上token
        header['Authorization'] = wx.getStorageSync('token');
    }
    ajaxTimes ++;
    // 显示加载中效果
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    return new Promise((resolve, reject) => {
        wx.request({
            ...param,
            header: header,
            url: baseUrl + param.url,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                ajaxTimes --;
                // 关闭加载图标
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        })
    })
}
