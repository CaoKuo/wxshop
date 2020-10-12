
const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
export const request = (param) => {
    let header = {...param.header};
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
            }
        })
    })
}
