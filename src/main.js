import Vue from 'vue'
import App from './App'
import './assets/iconfont.css'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
Vue.prototype.$http = 'https://www.wannengzhaoyao.com/a'

Vue.prototype.$wx = (url, method, data, success, fail) => {
  wx.getStorage({
    key: 'token',
    success: function (res) {
      wx.request({
        url: Vue.prototype.$http + url,
        method: method,
        data: data,
        header: {
          'Content-Type': 'application/json',
          'access_token': res.data
        },
        success: (res) => {
          success(res)
          if (res.data.code === 1000) {
            const url = '../user/main'
            wx.switchTab({ url })
          }
        },
        fail: (res) => {
          fail(res)
        }
      })
    },
    fail: function (res) {
      wx.request({
        url: Vue.prototype.$http + url,
        method: method,
        data: data,
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          success(res)
          if (res.data.code === 1000) {
            const url = '../user/main'
            wx.switchTab({ url })
          }
        },
        fail: (res) => {
          fail(res)
        }
      })
    }
  })
}
Vue.prototype.$toast = (title) => {
  wx.showToast({
    icon: 'none',
    title: title
  })
}
